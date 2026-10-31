/* Shared local quote checkout, without changing the existing contact configuration. */
(() => {
  const $ = selector => document.querySelector(selector);
  const legal = 'تمامی حقوق این وب‌سایت متعلق به شرکت پیشگامان شیمی آزما دارو است.';
  const syncLegal = () => document.querySelectorAll('[data-site-content="footer_copyright"]').forEach(node => {
    if (!node.textContent.includes('پیشگامان شیمی آزما دارو') || !node.textContent.includes('حقوق')) node.textContent = legal;
  });
  syncLegal();
  const footer = document.querySelector('footer');
  if (footer) new MutationObserver(syncLegal).observe(footer, {childList:true,subtree:true,characterData:true});
  const list = $('#quote-items');
  const drawer = $('#quote-drawer');
  const send = $('#quote-send');
  if (!list || !drawer || !send) return;
  const storageKey = 'farma-lab-kimia-quote-v1';
  const compact = value => String(value || '').replace(/\s+/g, ' ').trim();
  const entries = () => { try { return new Map(JSON.parse(localStorage.getItem(storageKey) || '[]')); } catch { return new Map(); } };
  const proceed = document.createElement('button');
  proceed.type = 'button'; proceed.className = 'quote-proceed'; proceed.textContent = 'ارسال درخواست';
  send.prepend(proceed);

  const backdrop = document.createElement('div');
  backdrop.className = 'request-form-backdrop'; backdrop.hidden = true;
  backdrop.innerHTML = `<section class="request-form-panel" role="dialog" aria-modal="true" aria-labelledby="request-form-title" dir="rtl">
    <div class="request-form-head"><h2 id="request-form-title">اطلاعات درخواست‌کننده</h2><button type="button" class="request-form-close" aria-label="بستن">×</button></div>
    <form id="request-customer-form"><div class="request-form-grid">
      <label>نام و نام خانوادگی *<input name="customerName" autocomplete="name" required /></label>
      <label>نام سازمان<input name="organization" autocomplete="organization" /></label>
      <label>شماره تماس *<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required /></label>
      <label>ایمیل<input name="email" type="email" autocomplete="email" /></label>
      <label>توضیحات<input name="notes" /></label>
    </div><div class="request-form-actions"><button type="submit" data-channel="whatsapp">ارسال از طریق واتساپ</button><button type="submit" data-channel="email">ارسال از طریق ایمیل</button></div><p class="request-form-error" role="status" hidden></p></form>
  </section>`;
  const notesInput = backdrop.querySelector('[name="notes"]');
  const notesTextarea = document.createElement('textarea');
  notesTextarea.name = 'notes'; notesTextarea.rows = 3;
  notesInput.replaceWith(notesTextarea);
  document.body.append(backdrop);
  const form = backdrop.querySelector('form');
  const error = backdrop.querySelector('.request-form-error');
  let priorFocus = null;
  let channel = 'whatsapp';

  function syncItems() {
    for (const row of list.querySelectorAll('.quote-item')) {
      const field = row.querySelector('[data-qty-input]');
      const id = field?.dataset.qtyInput || row.querySelector('[data-remove]')?.dataset.remove;
      const name = row.querySelector('.quote-item-info > b');
      if (id && name && !row.querySelector('.quote-item-name')) {
        const product = entries().get(id)?.product || {};
        const query = new URLSearchParams({id});
        for (const [key, value] of Object.entries({name:product.name,fa:product.nameFa,brand:product.brand,number:product.number,cas:product.cas,category:product.category,source:product.sourceUrl || product.sigmaUrl})) {
          if (value && value !== '—') query.set(key, value);
        }
        const link = document.createElement('a');
        link.href = 'product.html?' + query;
        link.target = '_blank'; link.rel = 'noopener noreferrer';
        link.className = 'quote-item-name'; link.dir = 'auto';
        link.textContent = name.textContent;
        name.replaceWith(link);
      }
      row.querySelector('[data-package-input]')?.closest('.quote-field')?.remove();
    }
  }
  new MutationObserver(syncItems).observe(list, {childList:true});
  syncItems();

  function openForm() {
    if (!entries().size) return;
    priorFocus = document.activeElement;
    backdrop.hidden = false;
    document.body.classList.add('request-form-open');
    error.hidden = true;
    form.elements.customerName.focus({preventScroll:true});
  }
  function closeForm() {
    backdrop.hidden = true;
    document.body.classList.remove('request-form-open');
    priorFocus?.focus?.({preventScroll:true});
  }
  proceed.addEventListener('click', openForm);
  backdrop.querySelector('.request-form-close').addEventListener('click', closeForm);
  backdrop.addEventListener('click', event => { if (event.target === backdrop) closeForm(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !backdrop.hidden) {
      event.preventDefault(); event.stopImmediatePropagation(); closeForm();
    }
  }, true);
  backdrop.querySelectorAll('[data-channel]').forEach(button => button.addEventListener('click', () => { channel = button.dataset.channel; }));

  function message() {
    const data = new FormData(form);
    const name = compact(data.get('customerName'));
    const lines = [`باسلام، ${name} هستم.`];
    const organization = compact(data.get('organization'));
    const phone = compact(data.get('phone'));
    const email = compact(data.get('email'));
    const notes = compact(data.get('notes'));
    if (organization) lines.push('نام سازمان: ' + organization);
    lines.push('شماره تماس: ' + phone);
    if (email) lines.push('ایمیل: ' + email);
    lines.push('', 'برای محصولات زیر درخواست قیمت و شرایط تأمین دارم:');
    for (const {product,qty} of entries().values()) {
      if (!product) continue;
      lines.push('', '• نام محصول: ' + compact(product.nameFa || product.name));
      if (product.nameFa && product.name) lines.push('نام انگلیسی: ' + compact(product.name));
      if (product.number && !['—','On request','Request by CAS'].includes(product.number)) lines.push('شماره کاتالوگ: ' + compact(product.number));
      if (product.cas && product.cas !== '—') lines.push('شماره کاس: ' + compact(product.cas));
      lines.push('مقدار: ' + (compact(qty) || 'مشخص نشده'));
    }
    if (notes) lines.push('', 'توضیحات: ' + notes);
    return lines.join('\n');
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const raw = $(channel === 'whatsapp' ? '#send-whatsapp' : '#send-email');
    let destination = '';
    if (channel === 'whatsapp') {
      try { destination = new URL(raw.href).pathname.replace(/\D/g, ''); } catch {}
      if (!destination || raw.getAttribute('aria-disabled') === 'true') destination = '';
    } else {
      const match = raw.href.match(/^mailto:([^?]+)/i);
      destination = match ? decodeURIComponent(match[1]) : '';
      if (raw.getAttribute('aria-disabled') === 'true') destination = '';
    }
    if (!destination) {
      error.textContent = channel === 'whatsapp' ? 'شماره واتساپ هنوز در سایت ثبت نشده است.' : 'نشانی ایمیل هنوز در سایت ثبت نشده است.';
      error.hidden = false; return;
    }
    const body = message();
    const url = channel === 'whatsapp'
      ? 'https://wa.me/' + destination + '?text=' + encodeURIComponent(body)
      : 'mailto:' + destination + '?subject=' + encodeURIComponent('درخواست استعلام قیمت | Farma Lab Kimia') + '&body=' + encodeURIComponent(body);
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  let compactOpen = false;
  $('#quote-open')?.addEventListener('click', () => {
    drawer.classList.toggle('quote-compact', compactOpen);
  }, true);
  let previousCount = entries().size;
  const count = $('#quote-count');
  if (count) new MutationObserver(() => {
    const current = entries().size;
    if (current > previousCount && drawer.getAttribute('aria-hidden') === 'true') {
      compactOpen = true;
      try { $('#quote-open')?.click(); }
      finally { compactOpen = false; }
    }
    previousCount = current;
  }).observe(count, {childList:true,characterData:true,subtree:true});
})();
