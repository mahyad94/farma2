(() => {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const fallbackCategories = [
    { name: "Chemicals", fa: "مواد شیمیایی", note: "حلال‌ها، معرف‌ها و بافرها", icon: "◈" },
    { name: "Equipment", fa: "تجهیزات آزمایشگاهی", note: "دستگاه‌ها و تجهیزات تخصصی", icon: "⌬" },
    { name: "Glassware", fa: "ظروف شیشه‌ای", note: "ظروف و شیشه‌آلات آزمایشگاهی", icon: "♧" },
    { name: "Nanomaterials", fa: "نانومواد", note: "مواد پیشرفته پژوهشی", icon: "✳" },
    { name: "Medical supplies", fa: "لوازم مصرفی و ایمنی", note: "دستکش و حفاظت فردی", icon: "＋" },
    { name: "Reference standards", fa: "استانداردها و کالیبراسیون", note: "محلول‌های استاندارد و مواد مرجع", icon: "◎" },
    { name: "Culture media", fa: "محیط کشت و میکروبیولوژی", note: "مواد میکروبیولوژی", icon: "◌" }
  ];
  const groupLabels = {
    "Solvents": "حلال‌ها",
    "Acids": "اسیدها",
    "Inorganic chemicals": "مواد شیمیایی معدنی",
    "Buffers & salts": "بافرها و نمک‌ها",
    "Biochemicals": "مواد بیوشیمیایی",
    "Source catalog listings": "سایر مواد و معرف‌ها",
    "Other chemicals & reagents": "سایر مواد و معرف‌ها",
    "Reagents & indicators": "معرف‌ها و شناساگرها",
    "Calibration standards": "استانداردهای کالیبراسیون",
    "Microbiology materials": "مواد میکروبیولوژی",
    "Reference materials": "مواد مرجع",
    "Prepared culture media": "محیط کشت آماده",
    "Measuring instruments": "ابزارهای اندازه‌گیری",
    "Beakers": "بشرها",
    "Flasks": "بالن‌ها و ارلن‌ها",
    "Pipettes": "پیپت‌ها",
    "Personal protective equipment": "تجهیزات حفاظت فردی",
    "Nanoparticles and nanopowders": "نانوذرات و نانوپودرها",
    "Nanomaterials": "نانومواد",
    "Laboratory glassware": "شیشه‌آلات آزمایشگاهی",
    "Lab instruments": "دستگاه‌های آزمایشگاهی",
    "Neuroscience research accessories": "ملزومات پژوهش علوم اعصاب",
    "Disposables": "ملزومات مصرفی"
  };
  let brands = [
    { name: "Sigma-Aldrich", id: "brand-sigma-aldrich", symbol: "σ", className: "sigma" },
    { name: "Merck", id: "brand-merck", symbol: "M", className: "merck" },
    { name: "Supelco", id: "brand-supelco", symbol: "S", className: "supelco" },
    { name: "Millipore", id: "brand-millipore", symbol: "m", className: "millipore" }
  ];
  const menus = new Map();
  const finePointer = window.matchMedia("(min-width: 721px) and (hover: hover) and (pointer: fine)");
  const compactLayout = window.matchMedia("(max-width: 720px)");
  const taxonomyCategories = () => window.FarmaTaxonomy?.roots.map(node => ({name:String(node.id),fa:node.fa,en:node.name,note:node.name,icon:'◈'})) || fallbackCategories;
  let categories = taxonomyCategories();
  let catalog = [];
  let availableBrands = new Set();
  let brandCatalogKnown = false;
  let catalogKnown = false;
  let categoryCounts = new Map();
  try {
    const cached = JSON.parse(sessionStorage.getItem('farma-nav-category-counts-v1') || 'null');
    if (cached && Date.now() - cached.savedAt < 300000 && Array.isArray(cached.counts)) {
      categoryCounts = new Map(cached.counts);
      catalogKnown = true;
    }
  } catch {}
  function countCatalogProducts(rows) {
    const counts = new Map();
    for (const product of rows) {
      const path = window.FarmaTaxonomy?.path(product.group || product.subcategory || product.category) || [];
      const ids = path.length ? path.map(node => String(node.id)) : [String(product.category || '')];
      for (const id of ids) if (id) counts.set(id, (counts.get(id) || 0) + 1);
    }
    categoryCounts = counts;
    catalogKnown = true;
    try { sessionStorage.setItem('farma-nav-category-counts-v1', JSON.stringify({savedAt:Date.now(),counts:[...counts]})); } catch {}
  }

  function escape(value) {
    return String(value || "").replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }
  function catalogHref(category, group) {
    return "catalog.html?category=" + encodeURIComponent(category) +
      (group ? "&subcategory=" + encodeURIComponent(group) : "");
  }
  function brandHref(name) {
    return "catalog.html?brand=" + encodeURIComponent(name);
  }
  function recordBrands(rows) {
    const names = rows.map(product => String(product.brand || "").trim()).filter(Boolean);
    if (!names.length) return;
    availableBrands = new Set(names);
    brandCatalogKnown = true;
    try { sessionStorage.setItem("farma-nav-brands-v1", JSON.stringify({savedAt: Date.now(), names: [...availableBrands]})); } catch {}
  }
  try {
    const cached = JSON.parse(sessionStorage.getItem("farma-nav-brands-v1") || "null");
    if (cached && Date.now() - cached.savedAt < 300000 && Array.isArray(cached.names)) {
      availableBrands = new Set(cached.names);
      brandCatalogKnown = true;
    }
  } catch {}
  function setOpen(menu, open) {
    clearTimeout(menu.closeTimer);
    if (open) {
      for (const other of menus.values()) if (other !== menu) setOpen(other, false);
      const suggestions = document.getElementById("suggestions");
      if (suggestions) suggestions.hidden = true;
    }
    menu.item.classList.toggle("is-open", open);
    menu.toggle.setAttribute("aria-expanded", String(open));
    menu.panel.hidden = !open;
  }
  function closeAll() {
    for (const menu of menus.values()) setOpen(menu, false);
  }
  function groupsFor(category) {
    if (window.FarmaTaxonomy?.find(category)) return window.FarmaTaxonomy.children(category).map(node => String(node.id));
    return [...new Set(catalog.filter(product => product.category === category)
      .map(product => String(product.group || "").trim())
      .filter(group => group && group !== category))]
      .sort((a, b) => (groupLabels[a] || a).localeCompare(groupLabels[b] || b, "fa"));
  }
  function treeRoots() {
    return window.FarmaTaxonomy?.children(null) || categories.map(category => ({
      id: category.name, name: category.en || category.name, fa: category.fa || category.name, children: []
    }));
  }
  function treeChildren(id) {
    return window.FarmaTaxonomy?.children(id) || [];
  }
  function nodeById(id) {
    return window.FarmaTaxonomy?.find(id) || treeRoots().find(node => String(node.id) === String(id));
  }
  function showProductTree(menu, path = []) {
    const shell = menu.panel.querySelector(".nav-tree-shell");
    if (!shell) return;
    shell.replaceChildren();
    const columns = [];
    let nodes = treeRoots();
    for (let depth = 0; depth <= path.length; depth += 1) {
      const parent = depth ? nodeById(path[depth - 1]) : null;
      const column = document.createElement("div");
      column.className = "nav-tree-column" + (depth === 0 ? " nav-tree-root" : "");
      column.dataset.depth = String(depth);
      const heading = document.createElement("div");
      heading.className = "nav-tree-caption";
      heading.textContent = parent?.fa || "دسته‌های اصلی";
      column.append(heading);
      for (const node of nodes) {
        const id = String(node.id);
        const children = treeChildren(id);
        const row = document.createElement("div");
        row.className = "nav-tree-item" + (path[depth] === id ? " nav-tree-active" : "") +
          (depth > 0 && catalogKnown && !categoryCounts.get(id) ? " is-empty-category" : "");
        row.dataset.nodeId = id;
        const anchor = document.createElement("a");
        anchor.className = "nav-tree-link";
        anchor.href = depth ? catalogHref(path[0], id) : catalogHref(id);
        anchor.innerHTML = '<span class="nav-tree-label"><span class="nav-tree-name" dir="rtl" lang="fa"></span><span class="nav-tree-english" dir="ltr" lang="en"></span></span>';
        anchor.querySelector(".nav-tree-name").textContent = node.fa || node.name || id;
        anchor.querySelector(".nav-tree-english").textContent = node.name || "";
        row.append(anchor);
        if (children.length) {
          const expand = document.createElement("button");
          expand.type = "button";
          expand.className = "nav-tree-expand nav-tree-toggle";
          expand.setAttribute("aria-label", "نمایش زیرگروه‌های " + (node.fa || node.name || id));
          expand.setAttribute("aria-expanded", String(path[depth] === id));
          expand.innerHTML = '<span aria-hidden="true">‹</span>';
          expand.addEventListener("click", event => {
            event.stopPropagation();
            const next = path.slice(0, depth);
            if (path[depth] !== id) next.push(id);
            showProductTree(menu, next);
          });
          row.append(expand);
          row.addEventListener("pointerenter", () => {
            if (finePointer.matches && path[depth] !== id) showProductTree(menu, [...path.slice(0, depth), id]);
          });
          row.addEventListener("focusin", () => {
            if (finePointer.matches && path[depth] !== id) showProductTree(menu, [...path.slice(0, depth), id]);
          });
          row.addEventListener("click", event => {
            if (event.target.closest("button")) return;
            if (!finePointer.matches && event.target.closest("a")) return;
            showProductTree(menu, [...path.slice(0, depth), id]);
          });
        }
        column.append(row);
      }
      shell.append(column);
      columns.push(column);
      if (depth < path.length) {
        const parentId = path[depth];
        nodes = treeChildren(parentId);
      }
    }
    // On narrow screens, place each open level directly under its parent row.
    if (compactLayout.matches) {
      for (let depth = 1; depth < columns.length; depth += 1) {
        const parentRow = [...columns[depth - 1].children]
          .find(child => child.dataset.nodeId === path[depth - 1]);
        if (parentRow) parentRow.after(columns[depth]);
      }
    }
  }
  function renderMenus() {
    const productsMenu = menus.get("products");
    if (productsMenu) {
      productsMenu.panel.innerHTML = '<div class="nav-tree-shell"></div>';
      showProductTree(productsMenu);
    }
    const categoryMenu = menus.get("categories");
    if (categoryMenu) categoryMenu.panel.innerHTML = categories.map(category =>
      '<a class="nav-category-link" href="' + catalogHref(category.name) + '">' +
      '<span class="nav-category-symbol" aria-hidden="true">' + escape(category.icon) + '</span>' +
      '<span><b>' + escape(category.fa) + '</b><small dir="ltr" lang="en">' + escape(category.en || category.note) + '</small></span>' +
      '<span class="nav-item-arrow" aria-hidden="true">←</span></a>').join("");
    const brandMenu = menus.get("brands");
    if (brandMenu) {
      const configured = new Map(brands.filter(brand => brand?.name).map(brand => [brand.name, brand]));
      const names = brandCatalogKnown ? [...availableBrands] : [...configured.keys()];
      const visible = names.sort((a, b) => a.localeCompare(b, "en", {sensitivity: "base"}));
      brandMenu.panel.innerHTML = '<div class="nav-tree-shell"><div class="nav-tree-column nav-tree-root"><div class="nav-tree-caption">برندهای محصولات</div>' +
        visible.map(name => {
          const brand = configured.get(name);
          return '<div class="nav-tree-item"><a class="nav-tree-link" href="' + escape(brandHref(name)) + '">' +
            '<span class="nav-tree-label"><span class="nav-tree-name" dir="ltr" lang="en">' + escape(name) + '</span>' +
            (brand?.caption ? '<span class="nav-tree-english" dir="rtl" lang="fa">' + escape(brand.caption) + '</span>' : '') +
            '</span><span class="nav-brand-arrow" aria-hidden="true">←</span></a></div>';
        }).join("") + '</div></div>';
      const tiles = document.querySelector('.brand-tiles');
      if (tiles && brandCatalogKnown) {
        tiles.querySelectorAll('[data-dynamic-brand]').forEach(tile => tile.remove());
        for (const name of visible) {
          if ([...configured.keys()].includes(name)) continue;
          const tile = document.createElement('a');
          tile.className = 'brand-tile';
          tile.dataset.dynamicBrand = name;
          tile.href = brandHref(name);
          tile.setAttribute('aria-label', 'مشاهده محصولات ' + name);
          const symbol = document.createElement('span');
          symbol.className = 'brand-symbol';
          symbol.textContent = name.slice(0, 1);
          const label = document.createElement('b');
          label.dir = 'auto';
          label.textContent = name;
          tile.append(symbol, label);
          tiles.append(tile);
        }
      }
    }
    for (const menu of menus.values()) {
      menu.toggle.setAttribute("aria-label", "زیرمجموعه‌های " + menu.link.textContent.trim());
    }
  }

  for (const key of ["products", "categories", "brands"]) {
    const link = nav.querySelector('a[data-site-content="nav_' + key + '"]');
    if (!link) continue;
    const item = document.createElement("div");
    item.className = "nav-item nav-item-" + key;
    const head = document.createElement("div");
    head.className = "nav-item-head";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-submenu-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "nav-" + key + "-panel");
    toggle.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>';
    const panel = document.createElement("div");
    panel.id = "nav-" + key + "-panel";
    panel.className = "nav-dropdown nav-dropdown-" + key;
    panel.hidden = true;
    link.before(item);
    link.classList.add("nav-parent-link");
    head.append(link, toggle);
    item.append(head, panel);
    const menu = { item, link, toggle, panel, closeTimer: null };
    menus.set(key, menu);

    item.addEventListener("pointerenter", () => {
      if (finePointer.matches) setOpen(menu, true);
    });
    item.addEventListener("pointerleave", () => {
      if (!finePointer.matches) return;
      menu.closeTimer = setTimeout(() => {
        if (!item.contains(document.activeElement)) setOpen(menu, false);
      }, 130);
    });
    item.addEventListener("focusin", event => {
      if (event.target !== toggle) setOpen(menu, true);
    });
    item.addEventListener("focusout", event => {
      // Rebuilding an expanded mobile branch removes the focused button.
      // Its blur must not dismiss the whole menu.
      if (compactLayout.matches) return;
      if (!item.contains(event.relatedTarget)) setOpen(menu, false);
    });
    toggle.addEventListener("click", () => {
      setOpen(menu, toggle.getAttribute("aria-expanded") !== "true");
    });
    item.addEventListener("keydown", event => {
      if ((event.key === "ArrowDown" || event.key === "ArrowUp") && head.contains(event.target)) {
        event.preventDefault();
        setOpen(menu, true);
        const links = panel.querySelectorAll("a[href]");
        (event.key === "ArrowUp" ? links[links.length - 1] : links[0])?.focus();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(menu, false);
        toggle.focus();
      }
    });
    panel.addEventListener("click", event => {
      if (!event.target.closest("a")) return;
      closeAll();
      nav.classList.remove("nav-open");
      document.getElementById("menu-toggle")?.setAttribute("aria-expanded", "false");
    });
  }
  document.addEventListener("click", event => {
    if (!event.target.closest(".nav-item")) closeAll();
  });
  finePointer.addEventListener("change", closeAll);
  compactLayout.addEventListener("change", () => { closeAll(); renderMenus(); });
  renderMenus();
  let navHiddenOnScroll = false;
  function updateScrollVisibility() {
    const hidden = window.innerWidth > 720 && window.scrollY > 24;
    if (hidden === navHiddenOnScroll) return;
    navHiddenOnScroll = hidden;
    nav.classList.toggle("nav-scrolled", hidden);
    if (hidden) closeAll();
  }
  window.addEventListener("scroll", updateScrollVisibility, { passive: true });
  window.addEventListener("resize", updateScrollVisibility);
  updateScrollVisibility();
  window.FarmaNavigation = {
    closeAll,
    groupLabel: group => window.FarmaTaxonomy?.label(group) || groupLabels[group] || group,
    setSettings(data) {
      if (Array.isArray(data.brands)) brands = data.brands;
      renderMenus();
    },
    setCatalog(data) {
      categories = window.FarmaTaxonomy ? taxonomyCategories() : data.categories || fallbackCategories;
      if (Array.isArray(data.products)) {
        catalog = data.products;
        countCatalogProducts(catalog);
        recordBrands(catalog);
      }
      renderMenus();
    }
  };
  window.addEventListener('farma-taxonomy-changed', () => { categories = taxonomyCategories(); renderMenus(); });
  window.addEventListener('DOMContentLoaded', async () => {
    if (brandCatalogKnown || document.getElementById('product-grid')) return;
    try {
      const client = await (window.farmaSupabaseReady || Promise.resolve(null));
      if (!client || brandCatalogKnown) return;
      const names = new Set();
      for (let start = 0; ; start += 1000) {
        const result = await client.from('products').select('brand').eq('active', true).eq('usage_permission_confirmed', true).range(start, start + 999);
        if (result.error) throw result.error;
        const rows = result.data || [];
        rows.forEach(row => { if (row.brand) names.add(row.brand); });
        if (rows.length < 1000) break;
      }
      if (names.size) { availableBrands = names; brandCatalogKnown = true; renderMenus(); }
    } catch (error) { console.info('Brand navigation unavailable:', error); }
  }, {once:true});
})();

// Lightweight, once-only section reveal; ?motion=off disables motion.
(() => {
  const motionEnabled = new URLSearchParams(window.location.search).get("motion") !== "off";
  if (!motionEnabled || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("motion-preview-force");

  const targets = document.querySelectorAll([
    ".category-section .section-head", ".category-section .category-grid",
    ".catalog-section .section-head", ".catalog-section .filters",
    ".brands-section .section-head", ".brands-section .brand-tile",
    ".faq-section .section-head", ".faq-section .faq-item",
    ".seo-guide", ".about-band"
  ].join(","));
  const reveal = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("lab-visible");
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -28px 0px", threshold: 0.08 });

  for (const target of targets) {
    if (target.matches(".brand-tile, .faq-item")) {
      const siblings = Array.from(target.parentElement.children);
      target.style.setProperty("--lab-delay", `${Math.min(siblings.indexOf(target), 3) * 65}ms`);
    }
    target.classList.add("lab-reveal");
    const bounds = target.getBoundingClientRect();
    if (bounds.top < window.innerHeight * 0.88 && bounds.bottom > 0) {
      target.classList.add("lab-visible");
    } else {
      reveal.observe(target);
    }
  }

  const hero = document.querySelector(".hero");
  if (hero) {
    new IntersectionObserver(([entry]) => {
      hero.classList.toggle("lab-hero-active", entry.isIntersecting);
    }, { threshold: 0.1 }).observe(hero);
  }
})();
