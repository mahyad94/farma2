/* Shared bilingual catalogue hierarchy. The local preview never writes to Supabase. */
(() => {
  const base = window.FARMA_TAXONOMY_BASE?.tree || [];
  const localKey = 'farma-lab-kimia-taxonomy-local-v1';
  const localMode = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const clone = value => JSON.parse(JSON.stringify(value));
  let tree = clone(base);
  let index = new Map();

  function validate(value) {
    if (!Array.isArray(value) || value.length > 200 || !value.length) throw new Error('ساختار دسته‌بندی معتبر نیست.');
    const seen = new Set();
    let count = 0;
    function visit(nodes, depth) {
      if (depth > 7) throw new Error('عمق دسته‌بندی بیش از حد مجاز است.');
      for (const node of nodes) {
        if (!node || typeof node !== 'object' || Array.isArray(node)) throw new Error('ساختار یک دسته معتبر نیست.');
        const id = String(node.id || '').trim();
        if (!id || id.length > 90 || seen.has(id)) throw new Error('شناسه دسته خالی یا تکراری است.');
        if (!String(node.name || '').trim() || !String(node.fa || '').trim()) throw new Error('نام فارسی و انگلیسی هر دسته لازم است.');
        if (String(node.name).length > 180 || String(node.fa).length > 180) throw new Error('نام دسته بیش از حد بلند است.');
        if (!Array.isArray(node.children)) throw new Error('زیرگروه‌ها معتبر نیستند.');
        seen.add(id); count += 1;
        if (count > 4000) throw new Error('تعداد دسته‌ها بیش از حد مجاز است.');
        visit(node.children, depth + 1);
      }
    }
    visit(value, 0);
    return value;
  }
  function rebuild() {
    index = new Map();
    function walk(nodes, parent = null, root = null, depth = 0, hidden = false) {
      for (const node of nodes) {
        const rootId = root || String(node.id);
        const inheritedHidden = hidden || node.visible === false;
        index.set(String(node.id), { node, parent, root: rootId, depth, hidden: inheritedHidden });
        walk(node.children, String(node.id), rootId, depth + 1, inheritedHidden);
      }
    }
    walk(tree);
  }
  function configure(remoteValue) {
    let value = remoteValue;
    if (localMode) {
      try { value = localStorage.getItem(localKey) || remoteValue; } catch {}
    }
    if (value) {
      try { tree = validate(typeof value === 'string' ? JSON.parse(value) : clone(value)); }
      catch (error) { console.warn('Catalogue taxonomy fallback:', error); tree = clone(base); }
    } else tree = clone(base);
    rebuild();
    window.dispatchEvent(new CustomEvent('farma-taxonomy-changed'));
  }
  async function save(next, client) {
    const checked = validate(clone(next));
    if (localMode) {
      localStorage.setItem(localKey, JSON.stringify(checked));
    } else {
      if (!client) throw new Error('ورود مدیر برای ذخیره دسته‌بندی لازم است.');
      const { data, error } = await client.from('site_content').upsert({
        content_key: 'catalog_taxonomy_v1', content_value: JSON.stringify(checked), updated_at: new Date().toISOString()
      }, { onConflict: 'content_key' }).select('content_key');
      if (error) throw error;
      if (!data?.some(row => row.content_key === 'catalog_taxonomy_v1')) throw new Error('ذخیره دسته‌بندی تأیید نشد.');
    }
    tree = checked; rebuild();
    window.dispatchEvent(new CustomEvent('farma-taxonomy-changed'));
  }
  function path(id) {
    const result = []; let current = index.get(String(id));
    while (current) { result.unshift(current.node); current = current.parent ? index.get(current.parent) : null; }
    return result;
  }
  const record = id => index.get(String(id));
  const visible = id => !!record(id) && !record(id).hidden;
  const children = id => (id ? record(id)?.node.children || [] : tree).filter(node => visible(node.id));
  const belongs = (product, id) => {
    if (!id) return true;
    const target = String(id), group = String(product.group || product.subcategory || ''), category = String(product.category || '');
    if (!visible(target)) return false;
    if (group && record(group)) return visible(group) && path(group).some(node => String(node.id) === target);
    return category === target;
  };
  rebuild();
  window.FarmaTaxonomy = {
    localMode, configure, save, validate, path, record, visible, children, belongs,
    get tree() { return tree; },
    get roots() { return children(null); },
    find: id => record(id)?.node || null,
    root: id => record(id)?.root || null,
    label: id => record(id)?.node.fa || String(id || ''),
    labelEn: id => record(id)?.node.name || String(id || ''),
    all: () => [...index.values()],
  };
})();
