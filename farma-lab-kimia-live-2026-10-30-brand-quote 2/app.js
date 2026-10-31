// Contact details are intentionally placeholders until Farma Lab Kimia supplies them.
const CONTACT = { whatsapp: "", email: "" };

const sampleProducts = [
  { name: "Ethyl alcohol, Pure", brand: "Sigma-Aldrich", number: "E7023", cas: "64-17-5", category: "Chemicals", group: "Solvents", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "flask" },
  { name: "Sodium chloride", brand: "Sigma-Aldrich", number: "S9888", cas: "7647-14-5", category: "Chemicals", group: "Inorganic chemicals", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "crystal" },
  { name: "Methanol", brand: "Sigma-Aldrich", number: "34860", cas: "67-56-1", category: "Chemicals", group: "Solvents", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "bottle" },
  { name: "Hydrochloric acid", brand: "Sigma-Aldrich", number: "258148", cas: "7647-01-0", category: "Chemicals", group: "Acids", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "flask" },
  { name: "Dimethyl sulfoxide", brand: "Sigma-Aldrich", number: "D8418", cas: "67-68-5", category: "Chemicals", group: "Solvents", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "bottle" },
  { name: "Acetic acid", brand: "Sigma-Aldrich", number: "695092", cas: "64-19-7", category: "Chemicals", group: "Acids", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "flask" },
  { name: "2-Propanol", brand: "Sigma-Aldrich", number: "34863", cas: "67-63-0", category: "Chemicals", group: "Solvents", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "bottle" },
  { name: "Acetone", brand: "Sigma-Aldrich", number: "179124", cas: "67-64-1", category: "Chemicals", group: "Solvents", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "flask" },
  { name: "Sulfuric acid", brand: "Sigma-Aldrich", number: "258105", cas: "7664-93-9", category: "Chemicals", group: "Acids", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "bottle" },
  { name: "Glass beaker, low form", brand: "Farma Lab Kimia", number: "On request", cas: "—", category: "Glassware", group: "Laboratory glassware", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "beaker" },
  { name: "Graduated glass pipette", brand: "Farma Lab Kimia", number: "On request", cas: "—", category: "Glassware", group: "Laboratory glassware", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "pipette" },
  { name: "Laboratory bottle, amber glass", brand: "Farma Lab Kimia", number: "On request", cas: "—", category: "Glassware", group: "Laboratory glassware", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "bottle" },
  { name: "Analytical balance", brand: "Farma Lab Kimia", number: "On request", cas: "—", category: "Equipment", group: "Lab instruments", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "instrument" },
  { name: "pH meter, benchtop", brand: "Farma Lab Kimia", number: "On request", cas: "—", category: "Equipment", group: "Lab instruments", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "instrument" },
  { name: "Nitrile examination gloves", brand: "Farma Lab Kimia", number: "On request", cas: "—", category: "Medical supplies", group: "Disposables", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "gloves" },
  { name: "Silver nanoparticle dispersion", brand: "Sigma-Aldrich", number: "On request", cas: "7440-22-4", category: "Nanomaterials", group: "Nanomaterials", grade: "Contact for product specifications", pack: "Confirm with sales consultant", art: "nano" }
];

const categoryInfo = [
  { name: "Chemicals", fa: "مواد شیمیایی", icon: "◈", note: "حلال‌ها · معرف‌ها · بافرها", description: "مواد شیمیایی آزمایشگاهی و معرف‌ها را بر اساس نام انگلیسی، شماره کاتالوگ یا شماره CAS جستجو کنید. درجه خلوص، بسته‌بندی و امکان تأمین هر محصول پس از بررسی درخواست اعلام می‌شود.", sigmaTerm: "chemical reagents" },
  { name: "Equipment", fa: "تجهیزات آزمایشگاهی", icon: "⌬", note: "دستگاه‌ها · ملزومات آزمایشگاه", description: "تجهیزات و دستگاه‌های آزمایشگاهی را بر اساس نام و مشخصات فنی در کاتالوگ جستجو کنید. مدل، اقلام همراه، قیمت و زمان تحویل پس از بررسی نیاز شما تأیید می‌شود.", sigmaTerm: "laboratory equipment" },
  { name: "Glassware", fa: "ظروف شیشه‌ای", icon: "♧", note: "بشرها · بالن‌ها · پیپت‌ها", description: "ظروف شیشه‌ای آزمایشگاهی را بر اساس نوع، حجم یا نام محصول جستجو کنید. مشخصات دقیق و گزینه‌های بسته‌بندی هنگام بررسی درخواست تأیید می‌شود.", sigmaTerm: "glassware" },
  { name: "Nanomaterials", fa: "نانومواد", icon: "✳", note: "مواد پیشرفته پژوهشی", description: "نانومواد و مواد پیشرفته پژوهشی را با نام محصول، شماره کاتالوگ یا شماره CAS پیدا کنید. اندازه ذره، خلوص و شرایط نگهداری باید برای هر رکورد جداگانه بررسی شود.", sigmaTerm: "nanoparticles" },
  { name: "Medical supplies", fa: "لوازم مصرفی و ایمنی", icon: "＋", note: "دستکش · حفاظت فردی · مصرفی‌ها", description: "لوازم مصرفی و ایمنی آزمایشگاه را بر اساس نوع و مشخصات جستجو کنید. موجودی و بسته‌بندی پس از استعلام تأیید می‌شود.", sigmaTerm: "laboratory safety" },
  { name: "Reference standards", fa: "استانداردها و کالیبراسیون", icon: "◎", note: "محلول استاندارد · مواد مرجع", description: "استانداردها و مواد مرجع را با نام، کد محصول و کاربرد آزمایشگاهی جستجو کنید. اعتبار، گرید و بسته‌بندی هر مورد پیش از تأمین بررسی می‌شود.", sigmaTerm: "reference standards" },
  { name: "Culture media", fa: "محیط کشت و میکروبیولوژی", icon: "◌", note: "محیط کشت · مواد میکروبیولوژی", description: "مواد مرتبط با محیط کشت و میکروبیولوژی را پیدا کنید. مشخصات فنی، بسته‌بندی و امکان تأمین پس از بررسی اعلام می‌شود.", sigmaTerm: "culture media" }
];

// Classify only records with a generic supplier group. Explicit catalog groups take precedence.
function catalogPlacement(row) {
  const originalCategory = String(row.category || "Chemicals").trim();
  const originalGroup = String(row.subcategory || "").trim();
  const taxonomy = window.FarmaTaxonomy;
  const group = originalGroup || originalCategory;
  if (taxonomy?.find(group) && taxonomy.path(group).some(node => String(node.id) === originalCategory)) {
    return { category: taxonomy.root(group), group };
  }
  if (originalCategory !== "Chemicals" || (originalGroup && originalGroup !== "Source catalog listings")) {
    return { category: originalCategory, group: originalGroup || originalCategory };
  }
  const name = String(row.name_en || "");
  if (/\b(?:calibration standard|certified reference|reference standard|standard solution|standard mix|standard for (?:GC|HPLC|LC|ICP|NMR)|calibra\w*|CRM)\b/i.test(name))
    return { category: "Reference standards", group: "Calibration standards" };
  if (/\b(?:culture media|culture medium|agar suitable for microbiology|tryptic soy|nutrient broth)\b/i.test(name))
    return { category: "Culture media", group: "Microbiology materials" };
  if (/\b(?:hydrochloric|sulfuric|sulphuric|nitric|phosphoric|acetic|formic|lactic|citric|ascorbic|boric|benzoic|salicylic|succinic|tartaric|trifluoroacetic) acid\b/i.test(name))
    return { category: "Chemicals", group: "Acids" };
  if (/\b(?:methanol|ethanol|propanol|butanol|acetone|acetonitrile|dimethyl sulfoxide|dimethylformamide|chloroform|toluene|xylene|hexane|heptane|dichloromethane|tetrahydrofuran|ethyl acetate|dimethyl carbonate|ethyl ether)\b/i.test(name))
    return { category: "Chemicals", group: "Solvents" };
  if (/\b(?:buffer|phosphate|tris\b|hepes|sodium chloride|potassium chloride)\b/i.test(name))
    return { category: "Chemicals", group: "Buffers & salts" };
  if (/\b(?:reagent|indicator|stain|fuchsin|thioflavin|methylene blue|phenolphthalein)\b/i.test(name))
    return { category: "Chemicals", group: "Reagents & indicators" };
  if (/\b(?:albumin|enzyme|histidine|peptide|protein|riboflavin|cholesterol)\b/i.test(name))
    return { category: "Chemicals", group: "Biochemicals" };
  if (/\b(?:chloride|sulfate|sulphate|nitrate|oxide|hydroxide|iodide|carbonate)\b/i.test(name))
    return { category: "Chemicals", group: "Inorganic chemicals" };
  return { category: "Chemicals", group: "Other chemicals & reagents" };
}
const catalogPage = document.body.classList.contains("catalog-page");
const pageParams = new URLSearchParams(window.location.search);
if (catalogPage) {
  const header = document.querySelector(".site-header");
  const updateFilterOffset = () => document.documentElement.style.setProperty("--catalog-filter-top", ((header?.offsetHeight || 0) + 12) + "px");
  updateFilterOffset();
  if (header && "ResizeObserver" in window) new ResizeObserver(updateFilterOffset).observe(header);
}
let requestedProductId = pageParams.get("product") || "";

// The approved pyramid replaces the local demonstration catalogue.
let products = [];
const taxonomy = window.FarmaTaxonomy;

const $ = (selector) => document.querySelector(selector);
const quoteStorageKey = "farma-lab-kimia-quote-v1";
let quote;
try { quote = new Map(JSON.parse(localStorage.getItem(quoteStorageKey) || "[]")); }
catch { quote = new Map(); }
let chosenCategory = categoryInfo.some((category) => category.name === pageParams.get("category")) ? pageParams.get("category") : "";
let chosenSubcategory = (pageParams.get("subcategory") || "").trim();
let catalogPageSize = 24;
let homeProductLimit = 3;
let catalogPageNumber = /^\d+$/.test(pageParams.get("page") || "") ? Math.max(1,Math.min(10000,Number(pageParams.get("page")))) : 1;
let catalogVisibleCount = catalogPageSize;
let catalogReady = false;
let catalogRecords = [];
const categoryFallbacks = categoryInfo.map(item => ({...item}));
let catalogSort = ["name-asc","name-desc"].includes(pageParams.get("sort")) ? pageParams.get("sort") : "relevance";
if (catalogPage && $("#catalog-sort")) $("#catalog-sort").value = catalogSort;
let chosenBrands = new Set(pageParams.getAll("brand").map(canonicalBrand).filter(Boolean));
const expandedFilterCategories = new Set(chosenCategory ? [chosenCategory] : []);
let searchTerm = pageParams.get("q") || "";
let pubchemResults = [];
let pubchemQuery = "";
let pubchemStatus = "";
let pubchemTimer;
let pubchemRequestId = 0;
let searchSubmitted = false;
let toastTimer;

function categoryFa(name) { return categoryInfo.find((c) => c.name === name)?.fa || name; }
function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' && quoted && text[i + 1] === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell); if (row.some((value) => value.trim())) rows.push(row);
      row = []; cell = "";
    } else cell += char;
  }
  row.push(cell); if (row.some((value) => value.trim())) rows.push(row);
  if (!rows.length) return [];
  const headers = rows.shift().map((value, index) => (index === 0 ? value.replace(/^\uFEFF/, "") : value).trim());
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] || "").trim()])));
}


function applyCatalogSettings(editable=window.FARMA_SITE_CONTENT||{}) {
  CONTACT.whatsapp=editable.contact_whatsapp||"";
  CONTACT.email=editable.contact_email||"";
  if (taxonomy) {
    taxonomy.configure(editable.catalog_taxonomy_v1);
    categoryInfo.splice(0, categoryInfo.length, ...taxonomy.roots.map(node => ({
      name: String(node.id), fa: node.fa, en: node.name, icon: '◈', note: node.name,
      description: `دسته ${node.fa} در کاتالوگ فارما لب کیمیا. برای بررسی تأمین و قیمت، محصول مورد نظر را انتخاب کنید.`
    })));
    homeProductLimit=Math.max(1,Math.min(12,Number(editable.home_products_per_category)||3));
    catalogPageSize=[12,24,48].includes(Number(editable.catalog_page_size))?Number(editable.catalog_page_size):24;
    catalogVisibleCount=catalogPageSize;
    if(catalogReady) products=catalogRecords.filter(product => taxonomy.visible(product.group) && taxonomy.root(product.group)===String(product.category));
    if(chosenCategory && !taxonomy.visible(chosenCategory)) { chosenCategory=''; chosenSubcategory=''; }
    if(chosenSubcategory && !taxonomy.visible(chosenSubcategory)) chosenSubcategory='';
    return;
  }
  const keys={Chemicals:"chemicals",Equipment:"equipment",Glassware:"glassware",Nanomaterials:"nanomaterials","Medical supplies":"medical","Reference standards":"standards","Culture media":"culture"};
  let configured=categoryFallbacks.map(category=>({...category,fa:editable["category_"+keys[category.name]+"_name"]??category.fa,note:editable["category_"+keys[category.name]+"_note"]??category.note}));
  if(editable.catalog_categories!==undefined){
    try{const list=JSON.parse(editable.catalog_categories);if(Array.isArray(list)){
      configured=list.filter(c=>c.visible!==false&&c.name&&c.fa).map(c=>({...categoryFallbacks.find(base=>base.name===c.name),...c,sigmaTerm:categoryFallbacks.find(base=>base.name===c.name)?.sigmaTerm||c.name}));
      for(const category of categoryFallbacks)if(!list.some(item=>item.name===category.name))configured.push(category);
    }}catch{}
  }
  configured=configured.map(category=>category.name==="Medical supplies"&&category.fa==="ملزومات پزشکی"
    ? {...category,fa:"لوازم مصرفی و ایمنی",note:category.note==="ایمنی · یک‌بارمصرف · حفاظت فردی"?"دستکش · حفاظت فردی · مصرفی‌ها":category.note}
    : category);
  categoryInfo.splice(0,categoryInfo.length,...configured);
  homeProductLimit=Math.max(1,Math.min(12,Number(editable.home_products_per_category)||3));
  catalogPageSize=[12,24,48].includes(Number(editable.catalog_page_size))?Number(editable.catalog_page_size):24;
  catalogVisibleCount=catalogPageSize;
  catalogSort=["relevance","name-asc","name-desc"].includes(editable.catalog_default_sort)?editable.catalog_default_sort:"relevance";
  if($("#catalog-sort"))$("#catalog-sort").value=catalogSort;
  if(catalogReady)products=catalogRecords.filter(product=>categoryInfo.some(c=>c.name===product.category));
  if(!categoryInfo.some(c=>c.name===chosenCategory)){chosenCategory="";chosenSubcategory="";}
}
window.addEventListener("farma-settings-applied",()=>{
  if(!catalogReady)return;
  applyCatalogSettings();
  window.FarmaNavigation?.setCatalog({categories:categoryInfo,products});
  renderCategories();renderProducts();updateQuote();
});

async function initializeCatalog() {
  try {
    const localOnlyPreview = window.FarmaLocalLinkTest?.previewFromLocation();
    await (window.farmaSiteContentReady || Promise.resolve());
    const editable = window.FARMA_SITE_CONTENT || {};
    applyCatalogSettings(editable);
    const supabase = localOnlyPreview ? null : await (window.farmaSupabaseReady || Promise.resolve(null));
    let rows = null;
    if (localOnlyPreview) {
      rows = [];
    } else if (supabase) {
      rows = [];
      for (let start = 0; ; start += 1000) {
        const result = await supabase.from("products").select("*").eq("active", true).eq("usage_permission_confirmed", true).order("name_en").order("id").range(start, start + 999);
        if (result.error) throw result.error;
        rows.push(...(result.data || []).map((row) => ({ ...row, active: "YES", usage_permission_confirmed: "YES" })));
        if (!result.data || result.data.length < 1000) break;
      }
    } else {
      const response = await fetch("catalog.csv", { cache: "no-store" });
      if (!response.ok) throw new Error("Catalog file unavailable");
      rows = parseCsv(await response.text());
    }
    if (rows.length || window.farmaSupabase || localOnlyPreview) {
      products = rows.filter((row) => !["Daya Exir", "Mina Tajhiz"].includes(row.source_name) && row.active.toUpperCase() === "YES" && row.usage_permission_confirmed.toUpperCase() === "YES" && row.name_en && row.brand).map((row, index) => {
        const number = row.product_number || "On request";
        const placement = catalogPlacement(row);
        const category = placement.category;
        const categoryArt = { Chemicals: "flask", Glassware: "beaker", Equipment: "instrument", "Medical supplies": "gloves", Nanomaterials: "nano" };
        let detail = row.detail_json;
        if (typeof detail === "string") {
          try { detail = JSON.parse(detail); } catch { detail = null; }
        }
        if (!detail || typeof detail !== "object" || Array.isArray(detail)) detail = null;
        return {
          id: row.id || (number !== "On request" ? number : `${row.name_en}-${index}`),
          name: row.name_en,
          brand: row.brand,
          number,
          cas: row.cas_number || "—",
          category,
          group: placement.group,
          grade: row.grade_purity || "Contact for product specifications",
          pack: row.pack_size || "Confirm with sales consultant",
          description: row.description_en || "",
          descriptionFa: row.description_fa || "",
          imageUrl: safeImageUrl(row.image_url),
          imageType: row.image_type || (/^https:\/\/pubchem\.ncbi\.nlm\.nih\.gov\/rest\/pug\/compound\/.*\/PNG/i.test(row.image_url || "") ? "molecular_structure" : "supplier_photo"),
          documentsUrl: safeImageUrl(row.technical_document_url),
          sourceUrl: safeImageUrl(row.source_url),
          sourceName: row.source_name || "Source catalog",
          additionalSourceUrl: safeImageUrl(row.additional_source_url),
          additionalSourceName: row.additional_source_name || "",
          detail,
          nameFa: detail?.name_fa || row.name_fa || "",
          cid: row.compound_cid || "Not listed",
          formula: row.molecular_formula || "Not listed",
          molecularWeight: row.molecular_weight ? `${row.molecular_weight} g/mol` : "Not listed",
          pubchemSid: row.pubchem_sid || "",
          art: categoryArt[category] || "flask"
        };
      });
    }
  } catch (error) {
    console.info("Catalogue products are not available:", error);
  }
  const localLinkRecord = window.FarmaLocalLinkTest?.previewFromLocation();
  if (localLinkRecord && !taxonomy && !products.some((item) => String(item.id) === localLinkRecord.id)) {
    products.push({
      id: localLinkRecord.id, name: localLinkRecord.name_en, nameFa: localLinkRecord.detail_json.name_fa,
      brand: localLinkRecord.brand, number: localLinkRecord.product_number, cas: localLinkRecord.cas_number,
      category: localLinkRecord.category, group: localLinkRecord.subcategory, grade: localLinkRecord.grade_purity,
      pack: localLinkRecord.pack_size, description: "", descriptionFa: localLinkRecord.description_fa,
      imageUrl: "", imageType: "supplier_photo", documentsUrl: "", sourceUrl: localLinkRecord.source_url,
      sourceName: localLinkRecord.source_name, detail: localLinkRecord.detail_json, art: "flask", localPreview: true
    });
    if (catalogPage && !pageParams.has("q")) searchTerm = localLinkRecord.product_number;
  }
  // Products explicitly imported on disk are part of the normal catalog, without preview parameters.
  for (const row of taxonomy ? [] : window.FarmaProductPackages?.records() || []) {
    const placement = catalogPlacement(row);
    const identity = value => { try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return ""; } };
    products = products.filter(item => String(item.id) !== row.id && !(item.number === row.product_number && identity(item.sourceUrl) === identity(row.source_url)));
    products.push({
      id:row.id, name:row.name_en, nameFa:row.detail_json?.name_fa || row.name_fa || "", brand:row.brand,
      number:row.product_number, cas:row.cas_number || "—", category:placement.category, group:placement.group,
      grade:row.grade_purity || "", pack:row.pack_size || "", description:row.description_en || "",
      descriptionFa:row.description_fa || "", imageUrl:safeImageUrl(row.image_url), imageType:row.image_type || "supplier_photo",
      documentsUrl:safeImageUrl(row.technical_document_url), sourceUrl:safeImageUrl(row.source_url), sourceName:row.source_name,
      detail:row.detail_json, formula:row.molecular_formula || "", molecularWeight:row.molecular_weight || "",
      cid:row.compound_cid || "", pubchemSid:row.pubchem_sid || "", art:"flask"
    });
  }
  catalogRecords = products.slice();
  catalogReady = true;
  applyCatalogSettings();
  const requestedCategory = pageParams.get("category");
  if (categoryInfo.some(category => category.name === requestedCategory)) chosenCategory = requestedCategory;
  if (taxonomy && chosenSubcategory && (!taxonomy.visible(chosenSubcategory) || taxonomy.root(chosenSubcategory)!==chosenCategory)) chosenSubcategory='';
  if(taxonomy && chosenCategory) taxonomy.path(chosenSubcategory||chosenCategory).forEach(node=>{
    if(taxonomy.children(node.id).length)expandedFilterCategories.add(String(node.id));
  });
  if ($("#search-input")) $("#search-input").value = searchTerm;
  if ($("#filter-search")) $("#filter-search").value = searchTerm;
  products.forEach((product) => { product.id = String(product.id); });
  window.FarmaNavigation?.setCatalog({ categories: categoryInfo, products });
  renderCategories();
  renderProducts(); updateQuote();
  if (catalogPage && pageParams.get("quote") === "1") openQuote();
  updateCatalogSeo();
  if (localLinkRecord) setRobots("noindex,nofollow");
  if (requestedProductId) {
    const requestedProduct = products.find((product) => product.id === requestedProductId);
    if (requestedProduct) openProductDetail(requestedProductId, { direct: true });
    else {
      setRobots("noindex,follow");
      setPageMeta("title", "محصول پیدا نشد | فارما لب کیمیا");
      setPageMeta("description", "این محصول در کاتالوگ فعال در دسترس نیست. نام، شماره CAS یا شماره کاتالوگ را برای بررسی تأمین جستجو کنید.");
      setCanonical(new URL("catalog.html", location.href).href);
    }
  }
  if (searchTerm && catalogPage && !requestedProductId && !localLinkRecord) schedulePubChemSearch(searchTerm);
}

function productArt(kind) {
  const drawings = {
    flask: '<path d="M39 13h22M45 13v31L23 80a6 6 0 0 0 5 9h44a6 6 0 0 0 5-9L55 44V13"/><path d="M31 71h39M43 65h.1M59 77h.1"/>',
    beaker: '<path d="M34 20h50l-5 69H39zM34 30h50M43 47h8M43 58h8M43 69h8"/><path d="M40 62q17 4 39 0"/>',
    pipette: '<path d="m28 80 47-56a8 8 0 0 1 11 11L40 91l-15 5zM28 80l12 11M72 31l10 8"/>',
    bottle: '<path d="M42 18h26v14l7 8v42a7 7 0 0 1-7 7H42a7 7 0 0 1-7-7V40l7-8zM42 28h26M35 62h40"/>',
    crystal: '<path d="m56 17 27 16-5 43-25 15-25-15-5-43zM56 17v74M28 33l28 17 27-17M28 76l28-26 22 26"/>',
    instrument: '<rect x="24" y="24" width="65" height="53" rx="7"/><path d="M35 39h42M37 53h18v13H37zM64 54h14M64 63h14M36 83h42"/><circle cx="74" cy="39" r="3"/>',
    gloves: '<path d="M42 81 30 59l-8-17c-2-5 4-8 7-4l10 13-7-27c-1-5 6-7 8-2l8 22-3-31c0-5 7-5 8 0l5 29 3-22c1-5 8-4 8 1l-1 29 5-13c2-5 9-2 7 3l-8 26c-3 10-8 18-16 20z"/>',
    nano: '<circle cx="57" cy="55" r="23"/><circle cx="57" cy="55" r="8"/><circle cx="31" cy="34" r="5"/><circle cx="84" cy="36" r="4"/><circle cx="35" cy="79" r="4"/><circle cx="84" cy="77" r="6"/><path d="m38 39 10 9m18 0 14-9M42 71l9-9m13 0 14 12"/>'
  };
  return `<svg class="product-illustration" viewBox="0 0 112 112" aria-hidden="true"><defs><linearGradient id="glass-${kind}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d9f4f0"/><stop offset="1" stop-color="#6cb9c5"/></linearGradient></defs><circle class="art-halo" cx="56" cy="56" r="47"/><g class="art-lines" fill="url(#glass-${kind})">${drawings[kind] || drawings.flask}</g><circle class="art-dot" cx="87" cy="26" r="3"/></svg>`;
}

function safeImageUrl(value) {
  if (/^assets\/[\w./-]+\.(?:png|jpe?g|webp|svg)$/i.test(value || "")) return value;
  try { const url = new URL(value); return url.protocol === "https:" ? url.href : ""; }
  catch { return ""; }
}

function isValidCasNumber(value) {
  if (!/^[0-9]{2,7}-[0-9]{2}-[0-9]$/.test(value)) return false;
  const digits = value.replace(/-/g, "");
  const checkDigit = Number(digits.at(-1));
  const sum = [...digits.slice(0, -1)].reverse().reduce((total, digit, index) => total + Number(digit) * (index + 1), 0);
  return sum % 10 === checkDigit;
}

function faValue(value) {
  const text = String(value ?? "");
  const translations = {
    "Not listed": "ثبت نشده",
    "Contact for product specifications": "برای دریافت مشخصات تماس بگیرید",
    "Confirm exact grade with sales consultant": "درجه خلوص را با مشاور فروش تأیید کنید",
    "Confirm with sales consultant": "با مشاور فروش تأیید شود",
    "Request by CAS": "درخواست بر اساس شماره کاس",
    "On request": "با درخواست"
  };
  return translations[text] || text;
}

function renderProductMeta(rows) {
  return rows.map(([label, value]) => `<div class="product-meta${label === "درجه خلوص" ? " product-grade" : ""}"><span>${escapeHtml(label)}</span><b dir="auto">${escapeHtml(faValue(value))}</b></div>`).join("");
}

function productArtOrImage(product, withPlaceholder = false) {
  return product.imageUrl
    ? `${withPlaceholder ? '<span class="product-image-placeholder" aria-hidden="true">' + productArt(product.art) + '</span>' : ''}<img class="product-photo${product.imageType === "molecular_structure" ? " is-molecular" : ""}" src="${escapeHtml(product.imageUrl)}" data-fallback-art="${escapeHtml(product.art || "flask")}" alt="${escapeHtml(product.imageType === "molecular_structure" ? "ساختار مولکولی " + product.name : "تصویر محصول " + product.name + " از برند " + product.brand)}" loading="lazy" decoding="async" width="320" height="320" />`
    : productArt(product.art);
}

function schedulePubChemSearch(value) {
  if (taxonomy) { clearTimeout(pubchemTimer); pubchemResults=[]; pubchemQuery=''; pubchemStatus=''; return; }
  const query = value.trim();
  clearTimeout(pubchemTimer);
  if (query.length < 2) {
    pubchemResults = []; pubchemQuery = ""; pubchemStatus = "";
    renderProducts();
    return;
  }
  pubchemQuery = query;
  pubchemResults = [];
  pubchemStatus = "در حال جستجو در رکوردهای سیگما آلدریچ در پاب‌کم…";
  renderProducts();
  pubchemTimer = setTimeout(() => searchSigmaPubChem(query), 700);
}

async function searchSigmaPubChem(query) {
  const requestId = ++pubchemRequestId;
  const compoundBase = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound";
  const substanceBase = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/substance";
  try {
    const sourceQuery = `${substanceBase}/name/${encodeURIComponent(query)}/sids/JSON?sourcename=Sigma-Aldrich`;
    let sidResponse = await fetch(sourceQuery);
    let sidData = sidResponse.ok ? await sidResponse.json() : {};
    let sids = [...new Set(sidData.IdentifierList?.SID || [])];
    if (!sids.length) {
      sidResponse = await fetch(sourceQuery + "&name_type=word");
      sidData = sidResponse.ok ? await sidResponse.json() : {};
      sids = [...new Set(sidData.IdentifierList?.SID || [])];
    }
    sids = sids.slice(0, 8);
    if (!sids.length) throw new Error("No Sigma source match");
    const sidPath = sids.join(",");
    const [descriptionResponse, synonymResponse, cidResponse] = await Promise.all([
      fetch(`${substanceBase}/sid/${sidPath}/description/JSON`),
      fetch(`${substanceBase}/sid/${sidPath}/synonyms/JSON`),
      fetch(`${substanceBase}/sid/${sidPath}/cids/JSON?cids_type=all&list_return=grouped`)
    ]);
    const descriptionData = descriptionResponse.ok ? await descriptionResponse.json() : {};
    const synonymData = synonymResponse.ok ? await synonymResponse.json() : {};
    const cidData = cidResponse.ok ? await cidResponse.json() : {};
    if (requestId !== pubchemRequestId || $("#search-input").value.trim() !== query) return;
    const descriptions = new Map((descriptionData.InformationList?.Information || []).map((item) => [item.SID, item]));
    const synonyms = new Map((synonymData.InformationList?.Information || []).map((item) => [item.SID, Array.isArray(item.Synonym) ? item.Synonym : item.Synonym ? [item.Synonym] : []]));
    const cidsBySid = new Map((cidData.InformationList?.Information || []).map((item) => [item.SID, Array.isArray(item.CID) ? item.CID : item.CID ? [item.CID] : []]));
    const cids = [...new Set(sids.flatMap((sid) => cidsBySid.get(sid) || []))];
    const propertyResponse = cids.length
      ? await fetch(compoundBase + "/cid/" + cids.join(",") + "/property/MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES,InChIKey/JSON")
      : null;
    const propertyData = propertyResponse?.ok ? await propertyResponse.json() : {};
    const properties = new Map((propertyData.PropertyTable?.Properties || []).map((item) => [item.CID, item]));
    pubchemResults = sids.map((sid) => {
      const description = descriptions.get(sid) || {};
      const names = synonyms.get(sid) || [];
      const cidList = cidsBySid.get(sid) || [];
      const cid = cidList[0];
      const property = properties.get(cid) || {};
      const cas = names.find(isValidCasNumber) || "Not listed";
      return {
        id: "pubchem-sid-" + sid,
        name: description.Title || names.find((name) => !isValidCasNumber(name)) || query,
        brand: "Sigma-Aldrich",
        number: String(sid),
        cas,
        category: "Chemicals",
        group: "Sigma-Aldrich substance records",
        grade: "Confirm exact grade with sales consultant",
        pack: "Confirm with sales consultant",
        art: "crystal",
        pubchem: true,
        synonyms: names,
        cid: cid ? String(cid) : "Not listed",
        formula: property.MolecularFormula || "Not listed",
        molecularWeight: property.MolecularWeight || "Not listed",
        iupacName: property.IUPACName || "Not listed",
        canonicalSmiles: property.CanonicalSMILES || "Not listed",
        inchiKey: property.InChIKey || "",
        imageUrl: cid ? compoundBase + "/cid/" + cid + "/PNG?image_size=300x300" : "",
        sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/substance/" + sid
      };
    });
    pubchemStatus = "این نتایج از رکوردهای سیگما آلدریچ در پاب‌کم هستند؛ درجه خلوص، بسته‌بندی و موجودی را مشاور فروش تأیید می‌کند.";
    renderProducts();
    if (!searchSubmitted) renderSuggestions(query);
  } catch (error) {
    if (requestId !== pubchemRequestId || $("#search-input").value.trim() !== query) return;
    pubchemResults = [];
    pubchemStatus = error.message === "No Sigma source match"
      ? "در رکوردهای سیگما آلدریچ در پاب‌کم نتیجه‌ای پیدا نشد."
      : "جستجوی PubChem در دسترس نیست؛ کمی بعد دوباره تلاش کنید.";
    renderProducts();
    if (!searchSubmitted) renderSuggestions(query);
  }
}

function canonicalBrand(value) {
  const name = String(value || "").trim().replace(/\s+/g, " ");
  const key = name.toLowerCase().replace(/[\s\u2010-\u2015-]/g, "");
  return ({ sigmaaldrich: "Sigma-Aldrich", farmalabkimia: "Farma Lab Kimia", merck: "Merck", supelco: "Supelco", millipore: "Millipore" })[key] || name;
}

function matchesSelectedBrand(product) {
  return !chosenBrands.size || chosenBrands.has(canonicalBrand(product.brand));
}

function subcategoryLabel(group) {
  return taxonomy?.find(group)?.fa || window.FarmaNavigation?.groupLabel(group) || group;
}

function catalogResultsHref(category = chosenCategory) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (chosenSubcategory && (!chosenCategory || category === chosenCategory)) params.set("subcategory", chosenSubcategory);
  if (searchTerm.trim()) params.set("q", searchTerm.trim());
  for (const brand of chosenBrands) params.append("brand", brand);
  return "catalog.html" + (params.size ? "?" + params.toString() : "");
}

function groupsForCategory(category) {
  return [...new Set(products.filter(product => product.category === category)
    .map(product => product.group).filter(group => group && group !== category))]
    .sort((a, b) => subcategoryLabel(a).localeCompare(subcategoryLabel(b), "fa"));
}

function renderCategories() {
  if (taxonomy) {
    if(!document.getElementById('taxonomy-search')) {
      const field=document.createElement('label');field.className='taxonomy-search';
      field.innerHTML='<span>جستجو در دسته‌بندی‌ها</span><input id="taxonomy-search" type="search" inputmode="search" placeholder="نام فارسی یا انگلیسی دسته" autocomplete="off" />';
      $('#category-grid').before(field);
      field.querySelector('input').addEventListener('input',renderCategories);
    }
    const selected = taxonomy.find(chosenSubcategory || chosenCategory);
    const ancestors = selected ? taxonomy.path(selected.id) : [];
    const query=document.getElementById('taxonomy-search').value.trim().toLocaleLowerCase();
    const cards = query ? taxonomy.all().filter(({node})=>taxonomy.visible(node.id) && [node.fa,node.name].some(value=>String(value).toLocaleLowerCase().includes(query))).slice(0,80).map(item=>item.node) : taxonomy.children(selected?.id);
    const trail = '<nav class="taxonomy-trail" aria-label="مسیر دسته‌بندی"><a href="catalog.html#categories">همه دسته‌ها</a>' + ancestors.map(node =>
      '<span aria-hidden="true">›</span><a href="catalog.html?category=' + encodeURIComponent(taxonomy.root(node.id)) +
      (String(node.id)===taxonomy.root(node.id) ? '' : '&subcategory=' + encodeURIComponent(node.id)) +
      '#categories"><bdi>' + escapeHtml(node.fa) + '</bdi></a>').join('') + '</nav>';
    const back = selected ? taxonomy.path(selected.id).at(-2) : null;
    const backHref = back ? 'catalog.html?category=' + encodeURIComponent(taxonomy.root(back.id)) +
      (String(back.id)===taxonomy.root(back.id) ? '' : '&subcategory=' + encodeURIComponent(back.id)) + '#categories' : 'catalog.html#categories';
    const backCard = selected ? '<a class="category-card taxonomy-back" href="' + escapeHtml(backHref) +
      '"><span class="category-icon" aria-hidden="true">↩</span><span class="category-text"><b>بازگشت یک سطح</b><small dir="ltr" lang="en">Back to categories</small></span></a>' : '';
    const cardHtml = cards.map((node,index) => {
      const rootId = taxonomy.root(node.id);
      const url = 'catalog.html?category=' + encodeURIComponent(rootId) +
        (String(node.id)===rootId ? '' : '&subcategory=' + encodeURIComponent(node.id)) + '#categories';
      return '<a class="category-card cat-' + index%7 + '" href="' + escapeHtml(url) + '">' +
        '<span class="category-icon" aria-hidden="true">' + (node.children.length ? '◈' : '◇') +
        '</span><span class="category-text"><b dir="rtl">' + escapeHtml(node.fa) +
        '</b><small lang="en" dir="ltr">' + escapeHtml(node.name) +
        '</small>'+(query?'<small class="taxonomy-card-path">'+escapeHtml(taxonomy.path(node.id).slice(0,-1).map(part=>part.fa).join(' › '))+'</small>':'')+'</span><span class="category-arrow" aria-hidden="true">←</span></a>';
    }).join('');
    $('#category-grid').innerHTML = trail + backCard + cardHtml +
      (query && !cards.length ? '<p class="taxonomy-leaf-note">دسته‌ای با این نام پیدا نشد.</p>' :
        selected && !cards.length ? '<p class="taxonomy-leaf-note">این زیرگروه در پایین‌ترین سطح دسته‌بندی است. محصولات مرتبط پس از ثبت در اینجا نمایش داده می‌شوند.</p>' : '');
    return;
  }
  $("#category-grid").innerHTML = categoryInfo.map((category, index) =>
    '<a class="category-card cat-' + index + '" href="catalog.html?category=' + encodeURIComponent(category.name) + '">' +
    '<span class="category-icon" aria-hidden="true">' + escapeHtml(category.icon) + '</span><span class="category-text"><b>' +
    escapeHtml(category.fa) + '</b><small>' + escapeHtml(category.note) +
    '</small></span><span class="category-arrow" aria-hidden="true">←</span></a>').join("");
}

function renderSidebarFilters() {
  if (taxonomy) {
    const activeId = chosenSubcategory || chosenCategory;
    const facetProducts = products.filter(product => matchesSearch(product,searchTerm) && matchesSelectedBrand(product));
    let panelNumber = 0;
    const renderNode = (node,depth=0) => {
      const id=String(node.id), selected=id===activeId;
      const count=facetProducts.filter(product => taxonomy.belongs(product,id)).length;
      const children=taxonomy.children(id),open=expandedFilterCategories.has(id);
      const panelId='taxonomy-filter-panel-'+panelNumber++;
      return '<div class="filter-category-branch taxonomy-filter-branch'+(selected?' is-selected':'')+'" data-taxonomy-depth="'+depth+'"><div class="filter-category-line">'+
        '<label class="check-row filter-category-choice" title="'+escapeHtml(node.name)+'"><input type="radio" name="taxonomy-category" value="'+escapeHtml(id)+'" data-taxonomy-filter="'+escapeHtml(id)+'"'+(selected?' checked':'')+' />'+
        '<span dir="auto">'+escapeHtml(node.fa)+'</span><small class="filter-option-count">'+count.toLocaleString('fa-IR')+'</small></label>'+
        (children.length?'<button class="filter-branch-toggle" type="button" data-filter-expand="'+escapeHtml(id)+'" aria-expanded="'+String(open)+'" aria-controls="'+panelId+'" aria-label="زیرگروه‌های '+escapeHtml(node.fa)+'"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></button>':'')+
        '</div>'+(children.length?'<div class="filter-subcategory-list" id="'+panelId+'"'+(open?'':' hidden')+'>'+children.map(child=>renderNode(child,depth+1)).join('')+'</div>':'')+'</div>';
    };
    $('#category-filters').innerHTML=taxonomy.roots.map(node=>renderNode(node)).join('');
    const brandProducts = products.filter(product => matchesSearch(product,searchTerm) && (!activeId || taxonomy.belongs(product,activeId)));
    const brandCounts = new Map();for(const product of brandProducts){const brand=canonicalBrand(product.brand);brandCounts.set(brand,(brandCounts.get(brand)||0)+1);}
    $('#brand-filters').innerHTML=[...brandCounts].sort((a,b)=>b[1]-a[1]).map(([brand,count])=>'<label class="check-row filter-brand-choice"><input type="checkbox" name="brand" value="'+escapeHtml(brand)+'"'+(chosenBrands.has(brand)?' checked':'')+'/><span dir="ltr">'+escapeHtml(brand)+'</span><small class="filter-option-count">'+count.toLocaleString('fa-IR')+'</small></label>').join('');
    return;
  }
  const focused = document.activeElement;
  const focusKey = focused?.closest(".filters") && focused.matches("input")
    ? { name: focused.name, value: focused.value } : null;
  const facetProducts = products.filter(product => matchesSearch(product, searchTerm) && matchesSelectedBrand(product));
  const availableCategories = categoryInfo.filter(category =>
    products.some(product => product.category === category.name) || chosenCategory === category.name);
  $("#category-filters").innerHTML = availableCategories.map((category, index) => {
    const items = facetProducts.filter(product => product.category === category.name);
    const selected = chosenCategory === category.name;
    const groups = groupsForCategory(category.name).filter(group =>
      items.some(product => product.group === group) || (selected && chosenSubcategory === group));
    const open = expandedFilterCategories.has(category.name);
    const panelId = "filter-subcategories-" + index;
    const children = groups.map(group => {
      const count = items.filter(product => product.group === group).length.toLocaleString("fa-IR");
      return '<label class="check-row filter-subcategory-choice"><input type="radio" name="subcategory" value="' +
        escapeHtml(group) + '" data-parent-category="' + escapeHtml(category.name) + '"' +
        (selected && chosenSubcategory === group ? ' checked' : '') + ' /><span dir="auto">' +
        escapeHtml(subcategoryLabel(group)) + '</span><small class="filter-option-count">' + count + '</small></label>';
    }).join("");
    return '<div class="filter-category-branch' + (selected ? ' is-selected' : '') + '"><div class="filter-category-line">' +
      '<label class="check-row filter-category-choice"><input type="radio" name="category" value="' +
      escapeHtml(category.name) + '"' + (selected && !chosenSubcategory ? ' checked' : '') + ' /><span>' +
      escapeHtml(category.fa) + '</span><small class="filter-option-count">' + items.length.toLocaleString("fa-IR") +
      '</small></label>' + (groups.length ? '<button class="filter-branch-toggle" type="button" data-filter-expand="' +
      escapeHtml(category.name) + '" aria-expanded="' + String(open) + '" aria-controls="' + panelId +
      '" aria-label="زیرگروه‌های ' + escapeHtml(category.fa) + '"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></button>' : '') +
      '</div>' + (groups.length ? '<div class="filter-subcategory-list" id="' + panelId + '"' + (open ? '' : ' hidden') + '>' +
      children + '</div>' : '') + '</div>';
  }).join("");

  const brandProducts = products.filter(product => matchesSearch(product, searchTerm) &&
    (!chosenCategory || product.category === chosenCategory) && (!chosenSubcategory || product.group === chosenSubcategory));
  const brandCounts = new Map();
  for (const product of brandProducts) {
    const brand = canonicalBrand(product.brand);
    if (brand) brandCounts.set(brand, (brandCounts.get(brand) || 0) + 1);
  }
  const brands = [...new Set([...brandCounts.keys(), ...chosenBrands])].filter(Boolean)
    .sort((a, b) => (brandCounts.get(b) || 0) - (brandCounts.get(a) || 0) || a.localeCompare(b, "en"));
  if ($("#brand-filters")) $("#brand-filters").innerHTML = brands.map(brand => {
    const count = (brandCounts.get(brand) || 0).toLocaleString("fa-IR");
    return '<label class="check-row filter-brand-choice"><input type="checkbox" name="brand" value="' +
      escapeHtml(brand) + '"' + (chosenBrands.has(brand) ? ' checked' : '') + ' /><span dir="ltr">' +
      escapeHtml(brand) + '</span><small class="filter-option-count">' + count + '</small></label>';
  }).join("");

  if (focusKey) [...document.querySelectorAll(".filters input")].find(input =>
    input.name === focusKey.name && input.value === focusKey.value)?.focus({ preventScroll: true });
}

function selectCategory(categoryName) {
  if (!categoryInfo.some(category => category.name === categoryName)) return;
  chosenCategory = categoryName;
  chosenSubcategory = "";
  expandedFilterCategories.add(categoryName);
  catalogVisibleCount = catalogPageSize; catalogPageNumber = 1;
  renderProducts();
  scrollToSelectedCategory();
}

function matchesSearch(product, value) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;
  return [product.name, product.nameFa, product.number, product.cas, product.brand, product.category, categoryFa(product.category), product.group, subcategoryLabel(product.group), product.grade, ...(product.synonyms || [])].some((field) => String(field).toLowerCase().includes(normalized));
}

function renderProducts() {
  closeProductPeek();
  let results = products.filter(product => matchesSearch(product, searchTerm) &&
    (taxonomy ? taxonomy.belongs(product, chosenSubcategory || chosenCategory) :
      (!chosenCategory || product.category === chosenCategory) && (!chosenSubcategory || product.group === chosenSubcategory)) &&
    matchesSelectedBrand(product));
  catalogSort = $("#catalog-sort")?.value || catalogSort;
  if (catalogSort === "name-asc") results = results.slice().sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
  if (catalogSort === "name-desc") results = results.slice().sort((a, b) => b.name.localeCompare(a.name, "en", { sensitivity: "base" }));
  const remote = !taxonomy && pubchemQuery === searchTerm.trim() ? pubchemResults.filter(product =>
    (!chosenCategory || product.category === chosenCategory) &&
    (!chosenSubcategory || product.group === chosenSubcategory) && matchesSelectedBrand(product)) : [];
  const allShown = results.concat(remote);
  const start = catalogPage ? (catalogPageNumber - 1) * catalogPageSize : 0;
  const shown = allShown.slice(start, start + (catalogPage ? catalogVisibleCount : 24));
  $("#result-count").textContent = allShown.length + " محصول";
  $("#pubchem-status").textContent = searchTerm.trim() ? pubchemStatus : "";
  $("#pubchem-status").hidden = !searchTerm.trim() || !pubchemStatus;
  const isHomeCatalog = !taxonomy && !catalogPage && !searchTerm.trim() && !remote.length;
  const narrowed = Boolean(chosenSubcategory || chosenBrands.size);
  $("#product-grid").classList.toggle("grouped-catalog", isHomeCatalog);
  if (isHomeCatalog) {
    $("#product-grid").innerHTML = categoryInfo.filter(category => !chosenCategory || category.name === chosenCategory).map(category => {
      const items = results.filter(product => product.category === category.name);
      if (!items.length) return "";
      const cards = items.slice(0, homeProductLimit).map(renderProductCard).join("");
      const moreLink = items.length > homeProductLimit ? '<a class="category-more" href="' + escapeHtml(catalogResultsHref(category.name)) +
        '">مشاهده همه محصولات این بخش <span aria-hidden="true">←</span></a>' : "";
      const sigmaUrl = "https://www.sigmaaldrich.com/TR/en/search?focus=products&page=1&perpage=30&sort=relevance&term=" +
        encodeURIComponent(category.sigmaTerm) + "&type=product";
      const empty = '<div class="category-empty"><p>محصولی ثبت نشده است</p><a href="' + escapeHtml(sigmaUrl) +
        '" target="_blank" rel="noopener noreferrer">جستجو در کاتالوگ سیگما آلدریچ</a></div>';
      return '<section class="catalog-category-group" data-category-group="' + escapeHtml(category.name) +
        '"><div class="catalog-category-heading"><div><span class="eyebrow">' + escapeHtml(category.note) +
        '</span><h3>' + escapeHtml(category.fa) + '</h3></div><span class="catalog-category-count">' +
        items.length + ' محصول</span></div>' + (items.length ? '<div class="product-grid">' + cards + '</div>' + moreLink : empty) + '</section>';
    }).join("");
  } else {
    const remaining = Math.max(0,allShown.length - start - shown.length);
    const more = remaining > 0 ? (catalogPage ?
      '<button class="catalog-load-more" type="button" data-catalog-more>نمایش ' + Math.min(catalogPageSize, remaining) +
      ' محصول دیگر <span>↓</span></button>' : '<a class="catalog-load-more" href="' + escapeHtml(catalogResultsHref()) +
      '">مشاهده همه نتایج <span aria-hidden="true">←</span></a>') : "";
    $("#product-grid").innerHTML = shown.map(renderProductCard).join("") + more;
  }
  $("#empty-state").hidden = shown.length > 0 || (isHomeCatalog && !narrowed);
  if(taxonomy && !searchTerm.trim()) {
    const title=$('#empty-state [data-site-content="no_results_title"]');
    const detail=$('#empty-state [data-site-content="no_results_description"]');
    if(title)title.textContent='هنوز محصولی در این بخش ثبت نشده است';
    if(detail)detail.textContent='دسته‌بندی‌ها را مرور کنید یا برای محصول موردنظر خود درخواست ثبت کنید.';
  }
  renderCatalogPagination(allShown.length);
  const active = [];
  if (searchTerm) active.push('<button data-reset="search">' + escapeHtml(searchTerm) + ' <span>×</span></button>');
  if (chosenCategory) active.push('<button data-reset="category">' + escapeHtml(categoryFa(chosenCategory)) + ' <span>×</span></button>');
  if (chosenSubcategory) active.push('<button data-reset="subcategory">' + escapeHtml(subcategoryLabel(chosenSubcategory)) + ' <span>×</span></button>');
  for (const brand of chosenBrands) active.push('<button data-reset="brand" data-brand="' + escapeHtml(brand) +
    '"><bdi dir="ltr">' + escapeHtml(brand) + '</bdi> <span>×</span></button>');
  $("#active-filters").innerHTML = active.join("");
  renderSidebarFilters();
  if(taxonomy) renderCategories();
  syncCatalogSelection();
  if (catalogPage && catalogReady) {
    const url = new URL(location.href);
    if (chosenCategory) url.searchParams.set("category", chosenCategory);
    else url.searchParams.delete("category");
    if (chosenCategory && chosenSubcategory) url.searchParams.set("subcategory", chosenSubcategory);
    else url.searchParams.delete("subcategory");
    if (catalogPageNumber > 1) url.searchParams.set("page",catalogPageNumber); else url.searchParams.delete("page");
    if (searchTerm.trim()) url.searchParams.set("q",searchTerm.trim()); else url.searchParams.delete("q");
    url.searchParams.delete("brand"); for(const brand of chosenBrands) url.searchParams.append("brand",brand);
    if(catalogSort!=="relevance") url.searchParams.set("sort",catalogSort); else url.searchParams.delete("sort");
    if (url.href !== location.href) history.replaceState(null, "", url);
    updateCatalogSeo();
  }
}

function renderCatalogPagination(total) {
  const nav=document.getElementById("catalog-pagination");
  if(!catalogPage || !nav) return;
  const pages=Math.ceil(total/catalogPageSize);
  nav.hidden=pages<=1;
  if(nav.hidden) { nav.replaceChildren(); return; }
  const href=page=>{
    const params=new URLSearchParams();
    if(chosenCategory) params.set("category",chosenCategory);
    if(chosenSubcategory) params.set("subcategory",chosenSubcategory);
    if(searchTerm.trim()) params.set("q",searchTerm.trim());
    for(const brand of chosenBrands) params.append("brand",brand);
    if(catalogSort!=="relevance") params.set("sort",catalogSort);
    if(page>1) params.set("page",page);
    return "catalog.html"+(params.toString()?"?"+params:"")+"#catalog";
  };
  const link=(page,label,rel="")=>'<a href="'+escapeHtml(href(page))+'"'+(rel?' rel="'+rel+'"':'')+'>'+escapeHtml(label)+'</a>';
  const numbers=[...new Set([1,catalogPageNumber-1,catalogPageNumber,catalogPageNumber+1,pages])].filter(page=>page>0&&page<=pages).sort((a,b)=>a-b);
  let previous=0;
  const items=numbers.map(page=>{
    const gap=previous&&page-previous>1?'<span aria-hidden="true">…</span>':'';
    previous=page;
    return gap+(page===catalogPageNumber?'<span aria-current="page" aria-label="صفحه '+page.toLocaleString("fa-IR")+'">'+page.toLocaleString("fa-IR")+'</span>':link(page,page.toLocaleString("fa-IR")));
  }).join("");
  nav.innerHTML=(catalogPageNumber>1?link(Math.min(pages,catalogPageNumber-1),"قبلی","prev"):"")+items+(catalogPageNumber<pages?link(catalogPageNumber+1,"بعدی","next"):"");
}

function scrollToSelectedCategory() {
  requestAnimationFrame(() => {
    const selectedGroup = document.querySelector(`[data-category-group="${CSS.escape(chosenCategory)}"]`);
    (selectedGroup || $("#catalog-results") || $("#catalog"))?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function syncCatalogSelection() {
  document.querySelectorAll("#product-grid .product-card").forEach(card => {
    const selected = quote.has(card.querySelector(".add-quote")?.dataset.add);
    card.classList.toggle("is-in-request", selected);
  });
  document.querySelectorAll("#product-grid .product-card [data-add], #product-peek [data-add]").forEach(button => {
    if (!("catalogDefaultMarkup" in button.dataset)) {
      button.dataset.catalogDefaultMarkup = button.innerHTML;
      button.dataset.catalogDefaultLabel = button.getAttribute("aria-label") || "";
    }
    const added = quote.has(button.dataset.add);
    button.classList.toggle("is-in-request", added);
    button.setAttribute("aria-pressed", String(added));
    button.innerHTML = added
      ? (button.classList.contains("quick-add") ? "−" : button.closest("#product-peek") || button.closest(".product-hover-sheet") ? 'حذف از فهرست درخواست −' : 'حذف از فهرست درخواست <span aria-hidden="true">−</span>')
      : button.dataset.catalogDefaultMarkup;
    if (added) button.setAttribute("aria-label", "حذف این محصول از فهرست درخواست");
    else if (button.dataset.catalogDefaultLabel) button.setAttribute("aria-label", button.dataset.catalogDefaultLabel);
    else button.removeAttribute("aria-label");
  });
}

function productPageHref(product) {
  const params = new URLSearchParams(Object.entries({
    id: product.id, name: product.name, fa: product.nameFa || "", brand: product.brand,
    number: product.number, cas: product.cas, category: product.category,
    cid: product.pubchem ? product.cid : "", source: product.sourceUrl || ""
  }).filter(([, value]) => value && value !== "—"));
  if (product.localPreview) params.set("local-link", "442410");
  return `product.html?${params}`;
}

function renderProductCard(product) {
  const displayName = product.nameFa || product.name;
  const titleMarkup = product.nameFa
    ? '<span class="product-title-fa" lang="fa" dir="rtl">' + escapeHtml(product.nameFa) + '</span><small class="product-title-en" lang="en" dir="ltr">' + escapeHtml(product.name) + '</small>'
    : escapeHtml(product.name);
  const isCatalogPage = document.body.classList.contains("catalog-page");
  const actualGrade = String(product.grade || "").trim();
  const hasActualGrade = Boolean(actualGrade) && !/^(?:confirm|contact|see pubchem|با مشاور|not listed|on request|request by cas|—)/i.test(actualGrade);
  const gradeRow = isCatalogPage && hasActualGrade ? [["درجه خلوص", actualGrade]] : [];
  const generalDescription = String(product.detail?.general || product.descriptionFa || product.description || "").replace(/\s+/g, " ").trim();
  const shortDescription = generalDescription.length > 140
    ? generalDescription.slice(0, 140).replace(/\s+\S*$/, "").replace(/[،,;؛:\s]+$/, "") + "…"
    : generalDescription;
  const genericDescription = /^(?:این محصول در فهرست عرضه ثبت شده است|این رکورد|مشخصات تکمیلی، موجودی|Sigma-Aldrich contributor record)/i.test(generalDescription);
  const descriptionMarkup = isCatalogPage && shortDescription && !genericDescription
    ? '<p class="product-general" dir="auto">' + escapeHtml(shortDescription) + '</p>'
    : '';
  const meta = renderProductMeta(gradeRow);
  const peekHint = isCatalogPage ? '<span class="product-preview-hint" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>نگاه سریع</span>' : '';
  const imageNote = product.imageType === "illustrative_image" ? '<small class="product-image-note">تصویر نمایشی</small>' : '';
  const productHref = productPageHref(product);
  const previewFields = [
    ["برند", product.brand, "brand"],
    ["دسته‌بندی", categoryFa(product.category), "category"],
    ["شماره کاتالوگ", product.number === "Request by CAS" ? "" : product.number, "number"],
    ["شماره کاس", product.cas === "—" ? "" : product.cas, "cas"]
  ].filter(([, value]) => value && value !== "—");
  const previewRows = previewFields.map(([label, value, key]) => '<div class="product-hover-row" data-peek-field="' + key + '"><span>' + escapeHtml(label) + '</span><bdi dir="ltr">' + escapeHtml(value) + '</bdi></div>').join("");
  const preview = '<div class="product-hover-sheet"><span class="product-hover-eyebrow">مشخصات کوتاه محصول</span><strong class="product-hover-name" dir="auto">' + escapeHtml(displayName) + '</strong><div class="product-hover-fields">' + previewRows + '</div><div class="product-hover-actions"><a href="' + escapeHtml(productHref) + '" target="_blank" rel="noopener noreferrer" data-detail-link="' + escapeHtml(product.id) + '">مشاهده جزئیات</a><button type="button" data-add="' + escapeHtml(product.id) + '">افزودن به فهرست درخواست ＋</button></div></div>';
  return '<article class="product-card"><div class="product-visual" data-detail="' + escapeHtml(product.id) + '">' + productArtOrImage(product, true) + imageNote + peekHint + '<span class="product-brand">' + escapeHtml(product.brand) + '</span><button class="quick-add" data-add="' + escapeHtml(product.id) + '" aria-label="افزودن ' + escapeHtml(displayName) + ' به فهرست درخواست">+</button></div><div class="product-info"><span class="product-category">' + escapeHtml(categoryFa(product.category)) + '</span><a class="product-title" href="' + escapeHtml(productHref) + '" target="_blank" rel="noopener noreferrer" data-detail-link="' + escapeHtml(product.id) + '">' + titleMarkup + '</a>' + descriptionMarkup + meta + '<div class="product-bottom"><span class="price-contact">استعلام قیمت از مشاور فروش</span><button class="add-quote" data-add="' + escapeHtml(product.id) + '">' + escapeHtml(window.FARMA_SITE_CONTENT?.product_add_button || "افزودن به فهرست درخواست") + ' <span>＋</span></button></div></div>' + preview + '</article>';
}

// A single floating preview stays inside the viewport and leaves the catalog layout untouched.
const productPeek = document.createElement("aside");
productPeek.id = "product-peek";
productPeek.setAttribute("aria-label", "پیش‌نمایش سریع محصول");
productPeek.setAttribute("aria-hidden", "true");
productPeek.setAttribute("inert", "");
productPeek.dir = "rtl";
document.body.append(productPeek);
let peekCard = null;
let peekCloseTimer;
let peekDismissedCard = null;
function closeProductPeek() {
  clearTimeout(peekCloseTimer);
  peekCard = null;
  productPeek.classList.remove("is-open");
  productPeek.setAttribute("aria-hidden", "true");
  productPeek.setAttribute("inert", "");
}
function positionProductPeek(card) {
  const rect = card.getBoundingClientRect();
  const width = productPeek.offsetWidth;
  const height = productPeek.offsetHeight;
  const left = Math.max(14, Math.min(innerWidth - width - 14, rect.left + rect.width / 2 - width / 2));
  const topLimit = Math.min(150, Math.max(14, innerHeight - height - 14));
  const top = Math.max(topLimit, Math.min(innerHeight - height - 14, rect.top + rect.height / 2 - height / 2));
  productPeek.style.left = `${left}px`;
  productPeek.style.top = `${top}px`;
}
function openProductPeek(card) {
  const settings = window.FARMA_SITE_CONTENT || {};
  if (settings.peek_enabled === "false") return;
  if (!matchMedia("(hover: hover) and (pointer: fine) and (min-width: 721px)").matches) return;
  if (card === peekDismissedCard) return;
  clearTimeout(peekCloseTimer);
  if (peekCard === card) return;
  const template = card.querySelector(".product-hover-sheet");
  if (!template) return;
  peekCard = card;
  const visual = card.querySelector(".product-visual");
  const loadedPhoto = visual?.classList.contains("has-loaded-image") && visual.querySelector(":scope > .product-photo");
  const art = (loadedPhoto || visual?.querySelector(".product-image-placeholder > .product-illustration, :scope > .product-illustration"))?.outerHTML || "";
  const category = escapeHtml(card.querySelector(".product-category")?.textContent || "");
  const name = template.querySelector(".product-hover-name")?.outerHTML || "";
  const english = card.querySelector(".product-title-en")?.outerHTML || "";
  const fields = template.querySelector(".product-hover-fields")?.outerHTML || "";
  const actions = template.querySelector(".product-hover-actions")?.outerHTML || "";
  const href = escapeHtml(template.querySelector("a[data-detail-link]")?.getAttribute("href") || "");
  productPeek.classList.remove("is-open");
  productPeek.innerHTML = `<div class="product-peek-top"><span><i aria-hidden="true"></i> مشخصات برای استعلام</span><button type="button" class="product-peek-close" aria-label="بستن پیش‌نمایش">×</button></div><div class="product-peek-hero"><a class="product-peek-media" href="${href}" target="_blank" rel="noopener noreferrer" data-detail-link aria-label="مشاهده صفحه محصول">${art}</a><div class="product-peek-heading"><span class="product-peek-category">${category}</span><a class="product-peek-title-link" href="${href}" target="_blank" rel="noopener noreferrer" data-detail-link>${name}${english}</a></div></div><div class="product-peek-divider"><span>اطلاعات کلیدی</span></div>${fields}<p class="product-peek-note">قیمت، موجودی و زمان تحویل پس از بررسی درخواست اعلام می‌شود.</p>${actions}`;
  productPeek.querySelector('.product-peek-top>span').lastChild.textContent = ' ' + (settings.peek_title ?? 'مشخصات برای استعلام');
  productPeek.querySelector('.product-peek-divider span').textContent = settings.peek_fields_title ?? 'اطلاعات کلیدی';
  productPeek.querySelector('.product-peek-note').textContent = settings.peek_note ?? 'قیمت، موجودی و زمان تحویل پس از بررسی درخواست اعلام می‌شود.';
  productPeek.querySelector('.product-hover-actions a').textContent = settings.peek_details_label ?? 'مشاهده جزئیات';
  productPeek.querySelector('.product-peek-category').hidden = settings.peek_show_category === 'false';
  productPeek.querySelectorAll('[data-peek-field]').forEach(row=>{row.hidden=settings['peek_show_'+row.dataset.peekField]==='false';});
  productPeek.removeAttribute("inert");
  productPeek.setAttribute("aria-hidden", "false");
  syncCatalogSelection();
  positionProductPeek(card);
  void productPeek.offsetWidth;
  productPeek.classList.add("is-open");
}
function scheduleProductPeekClose() {
  clearTimeout(peekCloseTimer);
  peekCloseTimer = setTimeout(closeProductPeek, 140);
}
const productGrid = $("#product-grid");
productGrid.addEventListener("pointerover", (event) => {
  if (event.pointerType === "touch") return;
  const card = event.target.closest(".product-card");
  if (card) openProductPeek(card);
});
productGrid.addEventListener("pointerout", (event) => {
  const card = event.target.closest(".product-card");
  if (card && card === peekDismissedCard && !card.contains(event.relatedTarget)) peekDismissedCard = null;
  if (!card || card !== peekCard || card.contains(event.relatedTarget) || productPeek.contains(event.relatedTarget)) return;
  scheduleProductPeekClose();
});
productGrid.addEventListener("focusin", (event) => {
  const card = event.target.closest(".product-card");
  if (card) openProductPeek(card);
});
productGrid.addEventListener("focusout", (event) => {
  const card = event.target.closest(".product-card");
  if (!card || card !== peekCard || card.contains(event.relatedTarget) || productPeek.contains(event.relatedTarget)) return;
  scheduleProductPeekClose();
});
productPeek.addEventListener("pointerenter", () => clearTimeout(peekCloseTimer));
productPeek.addEventListener("pointerleave", (event) => {
  if (!peekCard?.contains(event.relatedTarget)) scheduleProductPeekClose();
});
productPeek.addEventListener("click", (event) => {
  if (event.target.closest(".product-peek-close")) { peekDismissedCard = peekCard; closeProductPeek(); }
});
window.addEventListener("scroll", closeProductPeek, { passive: true });
window.addEventListener("resize", closeProductPeek);
window.addEventListener("farma-settings-applied", closeProductPeek);

function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]); }

function renderSuggestions(value) {
  const box = $("#suggestions");
  if (!value.trim()) { box.hidden = true; return; }
  const matches = products.filter((product) => matchesSearch(product, value)).slice(0, 6);
  const remoteMatches = pubchemQuery === value.trim() ? pubchemResults.slice(0, 5) : [];
  const externalUrl = `https://www.sigmaaldrich.com/TR/en/search?focus=products&page=1&perpage=30&sort=relevance&term=${encodeURIComponent(value.trim())}&type=product`;
  const localResults = matches.length
    ? matches.map((product) => {
      const reference = !product.number || ["Request by CAS", "On request", "—"].includes(product.number) ? "" : `<span>شماره کاتالوگ <bdi dir="ltr">${escapeHtml(product.number)}</bdi></span>`;
      return `<a role="option" href="${escapeHtml(productPageHref(product))}"><span class="suggestion-icon">⌕</span><span><b dir="auto">${escapeHtml(product.nameFa || product.name)}</b>${product.nameFa ? `<small lang="en" dir="ltr">${escapeHtml(product.name)}</small>` : ""}<small class="suggestion-meta"><span dir="ltr">${escapeHtml(product.brand)}</span>${reference}<span>شماره کاس <bdi dir="ltr">${escapeHtml(product.cas)}</bdi></span></small></span><span class="suggestion-arrow">↙</span></a>`;
    }).join("")
    : `<div class="suggestion-empty">محصول موردنظر در کاتالوگ ما یافت نشد. برای بررسی امکان تأمین، نام محصول، شماره کاس یا شماره کاتالوگ آن را به فهرست درخواست اضافه کنید.</div>`;
  const remoteResults = remoteMatches.map((product) => `<button type="button" role="option" data-add="${escapeHtml(product.id)}"><span class="suggestion-icon">⚗</span><span><b>${escapeHtml(product.name)}</b><small class="suggestion-meta"><span>سیگما آلدریچ</span><span>شناسه پاب‌کم <bdi dir="ltr">${escapeHtml(product.number)}</bdi></span><span dir="ltr">${escapeHtml(product.formula)}</span><span>شماره کاس <bdi dir="ltr">${escapeHtml(product.cas)}</bdi></span></small></span><span class="suggestion-arrow">＋</span></button>`).join("");
  const remoteStatus = pubchemQuery === value.trim() && pubchemStatus ? `<div class="suggestion-pubchem-status">${escapeHtml(pubchemStatus)}</div>` : "";
  const sigmaSearch = `<a class="sigma-search-link" href="${externalUrl}" target="_blank" rel="noopener noreferrer"><span>↗</span><span><b>جستجو در کاتالوگ سیگما آلدریچ</b><small>مشاهده نتیجه برای «<bdi>${escapeHtml(value.trim())}</bdi>»</small></span></a>`;
  const productRequest = `<form class="sigma-cas-form" id="product-request-form"><label for="product-request-value">نام محصول، شماره کاس یا شماره کاتالوگ</label><div><input id="product-request-value" name="request" value="${escapeHtml(value.trim())}" required /><button type="submit">افزودن به فهرست درخواست</button></div><small>اگر محصول در کاتالوگ ما موجود نباشد، امکان تأمین آن از سیگما آلدریچ را بررسی می‌کنیم. پس از بررسی، مشاور فروش با شما تماس می‌گیرد.</small></form>`;
  box.innerHTML = localResults + remoteStatus + remoteResults + sigmaSearch + productRequest;
  box.hidden = false;
}

function updateQuote() {
  try { localStorage.setItem(quoteStorageKey, JSON.stringify([...quote])); } catch {}
  $("#quote-count").textContent = quote.size;
  const items = [...quote.values()];
  $("#quote-empty").hidden = items.length > 0;
  $("#quote-send").hidden = items.length === 0;
  $("#quote-items").innerHTML = items.map(({ product, qty, packPreference }) => {
    const referenceLabel = product.pubchem ? "شناسه پاب‌کم" : "شماره کاتالوگ";
    const reference = ["Request by CAS", "On request"].includes(product.number) ? "" : `<span>${referenceLabel} <bdi dir="ltr">${escapeHtml(product.number)}</bdi></span>`;
    const sourceUrl = product.sigmaUrl || product.sourceUrl;
    const cas = product.cas && product.cas !== "—" ? `<span>شماره کاس <bdi dir="ltr">${escapeHtml(product.cas)}</bdi></span>` : "";
    const source = sourceUrl ? `<span><a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">مشاهده مرجع محصول ↗</a></span>` : "";
    return `<div class="quote-item"><div class="quote-item-art">${productArtOrImage(product)}</div><div class="quote-item-info"><b dir="auto">${escapeHtml(product.nameFa || product.name)}</b>${product.nameFa ? '<small class="quote-item-en" lang="en" dir="ltr">' + escapeHtml(product.name) + '</small>' : ''}<small class="quote-item-meta"><span dir="ltr">${escapeHtml(product.brand)}</span>${reference}${cas}${source}</small><div class="quote-inputs"><div class="quote-field"><label class="quote-quantity-label" for="quantity-${escapeHtml(product.id)}">مقدار موردنیاز</label><input type="text" dir="auto" value="${escapeHtml(qty || "")}" data-qty-input="${escapeHtml(product.id)}" id="quantity-${escapeHtml(product.id)}" placeholder="مثلاً ۵۰۰ گرم یا ۲ بسته" aria-label="مقدار موردنیاز" /></div><div class="quote-field"><label class="quote-quantity-label" for="package-${escapeHtml(product.id)}">بسته‌بندی دلخواه (اختیاری)</label><input type="text" dir="auto" value="${escapeHtml(packPreference || "")}" data-package-input="${escapeHtml(product.id)}" id="package-${escapeHtml(product.id)}" placeholder="مثلاً بطری ۲۵۰ میلی‌لیتری" aria-label="بسته‌بندی دلخواه" /></div></div><button type="button" class="remove-item" data-remove="${escapeHtml(product.id)}" aria-label="حذف ${escapeHtml(product.nameFa || product.name)} از فهرست درخواست">حذف</button></div></div>`;
  }).join("");
  updateContactLinks();
  syncCatalogSelection();
}

function formatQuoteMessage(items, note) {
  const singleLine = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const list = items.map(({ product, qty, packPreference }) => {
    const name = singleLine(product.nameFa ? `${product.nameFa} (${product.name})` : product.name);
    const number = singleLine(product.number);
    const cas = singleLine(product.cas);
    const lines = [`• نام محصول: ${name}`];
    if (product.pubchem && number && number !== "—") {
      lines.push(`شناسه پاب‌کم: ${number}`);
    } else if (number && !["Request by CAS", "On request", "—", name, cas].includes(number)) {
      lines.push(`شماره کاتالوگ: ${number}`);
    }
    if (cas && cas !== "—") lines.push(`شماره کاس: ${cas}`);
    lines.push(`مقدار درخواستی: ${singleLine(qty) || "مشخص نشده"}`);
    if (singleLine(packPreference)) lines.push(`بسته‌بندی دلخواه: ${singleLine(packPreference)}`);
    if (product.sigmaUrl) lines.push(`پیوند بررسی محصول: ${product.sigmaUrl}`);
    return lines.join("\n");
  }).join("\n\n");
  const extraNote = note.trim() ? `\n\nتوضیحات تکمیلی:\n${note.trim()}` : "";
  const subject = items.length === 1 ? "محصول زیر" : "محصولات زیر";
  return `سلام، برای ${subject} درخواست استعلام قیمت و شرایط تأمین دارم:\n\n${list}${extraNote}\n\nاطلاعات درخواستی: قیمت، بسته‌بندی، امکان تأمین عمده یا نمونه و زمان تقریبی تحویل.`;
}

function updateContactLinks() {
  const items = [...quote.values()];
  const note = $("#quote-note")?.value.trim() || "";
  const message = formatQuoteMessage(items, note);
  const isConfigured = Boolean(CONTACT.whatsapp.replace(/\D/g, ""));
  const emailConfigured = Boolean(CONTACT.email.trim());
  const whatsappLink = $("#send-whatsapp");
  const emailLink = $("#send-email");
  whatsappLink.href = isConfigured ? `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}` : "#contact";
  whatsappLink.dataset.placeholder = isConfigured ? "false" : "true";
  whatsappLink.setAttribute("aria-disabled", String(!isConfigured));
  whatsappLink.classList.toggle("is-disabled", !isConfigured);
  emailLink.href = emailConfigured ? `mailto:${CONTACT.email}?subject=${encodeURIComponent(window.FARMA_SITE_CONTENT?.quote_email_subject || "درخواست استعلام قیمت | Farma Lab Kimia")}&body=${encodeURIComponent(message)}` : "#contact";
  emailLink.dataset.placeholder = emailConfigured ? "false" : "true";
  emailLink.setAttribute("aria-disabled", String(!emailConfigured));
  emailLink.classList.toggle("is-disabled", !emailConfigured);
  const wa = $("#footer-whatsapp"); const em = $("#footer-email");
  wa.href = isConfigured ? `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}` : "#contact";
  wa.setAttribute("aria-disabled", String(!isConfigured)); wa.classList.toggle("is-disabled", !isConfigured);
  em.href = emailConfigured ? `mailto:${CONTACT.email}` : "#contact";
  em.setAttribute("aria-disabled", String(!emailConfigured)); em.classList.toggle("is-disabled", !emailConfigured);
}

function showToast(message) {
  const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function addProduct(id) {
  const product = products.find((item) => item.id === id) || pubchemResults.find((item) => item.id === id);
  if (!product) return;
  if (quote.has(id)) {
    quote.delete(id); updateQuote(); showToast("محصول از فهرست درخواست حذف شد");
    return;
  }
  const entry = quote.get(id) || { product, qty: "" };
  quote.set(id, entry); updateQuote(); showToast("محصول به فهرست درخواست اضافه شد");
}

function openProductDetail(id, options = {}) {
  closeProductPeek();
  const product = products.find((item) => item.id === id) || pubchemResults.find((item) => item.id === id);
  if (!product) return;
  if (product.detail?.enabled) { location.href = `product.html?id=${encodeURIComponent(product.id)}`; return; }
  $("#detail-title").textContent = product.name;
  $("#detail-category").textContent = categoryFa(product.category);
  $("#detail-brand").textContent = product.brand;
  $("#detail-art").innerHTML = productArtOrImage(product) + (product.imageType === "illustrative_image" ? '<small class="detail-image-note">تصویر نمایشی؛ بسته‌بندی دقیق پس از بررسی اعلام می‌شود.</small>' : "");
  $("#detail-description").textContent = product.description || "";
  $("#detail-description").setAttribute("dir", ["Daya Exir", "Mina Tajhiz"].includes(product.sourceName) ? "rtl" : "ltr");
  $("#detail-description").hidden = !product.description;
  const fields = product.pubchem
    ? [["شناسه پاب‌کم", product.number], ["شناسه ترکیب", product.cid], ["شماره کاس", product.cas], ["فرمول مولکولی", product.formula], ["جرم مولکولی", product.molecularWeight], ["نام آی‌یواسی", product.iupacName], ["ساختار کانونی", product.canonicalSmiles], ...(product.inchiKey ? [["شناسه این‌چی‌کی", product.inchiKey]] : [])]
    : product.pubchemSid
      ? [["شماره کاتالوگ", product.number], ["شناسه پاب‌کم", product.pubchemSid], ["شناسه ترکیب", product.cid], ["شماره کاس", product.cas], ["فرمول مولکولی", product.formula], ["جرم مولکولی", product.molecularWeight], ["دسته‌بندی", categoryFa(product.category)], ["درجه خلوص", faValue(product.grade)], ["اندازه بسته‌بندی", faValue(product.pack)]]
      : [["شماره کاتالوگ", faValue(product.number)], ["شماره کاس", product.cas], ["دسته‌بندی", categoryFa(product.category)], ["درجه خلوص", faValue(product.grade)], ["اندازه بسته‌بندی", faValue(product.pack)]];
  const documentField = product.documentsUrl ? `<div><span>سند فنی</span><b><a href="${escapeHtml(product.documentsUrl)}" target="_blank" rel="noopener noreferrer">مشاهده سند ↗</a></b></div>` : "";
  $("#detail-fields").innerHTML = fields.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><b dir="auto">${escapeHtml(faValue(value))}</b></div>`).join("") + documentField;
  $("#detail-add").dataset.detailAdd = product.id;
  $("#detail-overlay").hidden = false;
  $(".detail-modal").scrollTop = 0;
  $(".detail-content").scrollTop = 0;
  syncMobileOverlayScroll();
  if (options.direct) setProductSeo(product);
}

const SEO_ORIGIN = window.FarmaSeo?.origin || "https://farma-lab-kimia-test.pages.dev/";
function setPageMeta(name, content, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.head.querySelector(selector);
  if (!element) { element = document.createElement("meta"); element.setAttribute(property ? "property" : "name", name); document.head.append(element); }
  element.content = content;
}
function setCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) { element = document.createElement("link"); element.rel = "canonical"; document.head.append(element); }
  element.href = url;
}
function setRobots(value) { setPageMeta("robots", value); }
function setJsonLd(id, data) {
  let script = document.getElementById(id);
  if (!script) { script = document.createElement("script"); script.type = "application/ld+json"; script.id = id; document.head.append(script); }
  script.textContent = JSON.stringify(data);
}
function catalogCanonical(params = new URLSearchParams()) {
  const url = new URL("catalog.html", SEO_ORIGIN);
  for (const key of ["category", "subcategory", "page"]) if (params.has(key)) url.searchParams.set(key, params.get(key));
  return url.href;
}
function updateCatalogSeo() {
  if (!catalogPage) return;
  const product = requestedProductId && products.find((item) => item.id === requestedProductId);
  if (product) { setProductSeo(product); return; }
  document.getElementById("product-schema")?.remove();
  const category = categoryInfo.find((item) => item.name === chosenCategory);
  const group = category && chosenSubcategory ? subcategoryLabel(chosenSubcategory) : "";
  const list = products.filter((item) => taxonomy ? taxonomy.belongs(item,chosenSubcategory||chosenCategory) : (!category || item.category === category.name) && (!group || item.group === chosenSubcategory));
  const count = list.length;
  const title = group ? `${group} | ${category.fa} | فارما لب کیمیا` : category ? `${category.fa}؛ خرید و استعلام محصولات | فارما لب کیمیا` : "کاتالوگ مواد شیمیایی و تجهیزات آزمایشگاهی | فارما لب کیمیا";
  const heading = document.getElementById("catalog-title");
  if (heading) heading.textContent = group ? `کاتالوگ ${group}` : category ? `کاتالوگ ${category.fa}` : "کاتالوگ مواد شیمیایی و تجهیزات آزمایشگاهی";
  const description = group ? `محصولات ${group} در دسته ${category.fa}؛ جستجو با نام محصول، شماره کاس یا کد کاتالوگ و ارسال درخواست قیمت و شرایط تأمین.` : category ? (category.description || `بررسی محصولات ${category.fa} و استعلام قیمت و شرایط تأمین از فارما لب کیمیا.`) : "کاتالوگ محصولات مواد شیمیایی، نانومواد، تجهیزات و ملزومات آزمایشگاهی؛ جستجو با نام انگلیسی، شماره CAS یا شماره کاتالوگ و استعلام قیمت از مشاور فروش.";
  document.title = title + (catalogPageNumber>1 ? " | صفحه "+catalogPageNumber.toLocaleString("fa-IR") : "");
  setPageMeta("description", description);
  setPageMeta("og:title", document.title, true); setPageMeta("og:description", description, true);
  const categoryParams = new URLSearchParams();
  if (category) categoryParams.set("category", category.name);
  if (group) categoryParams.set("subcategory", chosenSubcategory);
  if (catalogPageNumber>1) categoryParams.set("page",catalogPageNumber);
  const categoryUrl = catalogCanonical(categoryParams);
  setPageMeta("og:url", categoryUrl, true);
  setPageMeta("twitter:title", document.title); setPageMeta("twitter:description", description);
  setCanonical(categoryUrl);
  setRobots(pageParams.get("cms-preview") === "1" || searchTerm || chosenBrands.size || catalogSort!=="relevance" || count === 0 || (catalogPageNumber-1)*catalogPageSize >= count ? "noindex,follow" : "index,follow");
  setJsonLd("catalog-schema", {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: title, description, inLanguage: "fa-IR", url: categoryUrl,
    ...(list.length ? { mainEntity: { "@type": "ItemList", numberOfItems: list.length, itemListElement: list.slice((catalogPageNumber-1)*catalogPageSize,(catalogPageNumber-1)*catalogPageSize+catalogVisibleCount).map((item, index) => ({ "@type": "ListItem", position: (catalogPageNumber-1)*catalogPageSize+index+1, url: new URL(`product.html?id=${encodeURIComponent(item.id)}`, SEO_ORIGIN).href, name: item.nameFa || item.name })) } } : {})
  });
  setBreadcrumbs(taxonomy && category ? [
    {name:'صفحه اصلی',url:'index.html'}, {name:'کاتالوگ محصولات',url:'catalog.html'},
    ...taxonomy.path(chosenSubcategory||chosenCategory).map((node,index,array)=>({name:node.fa,...(index<array.length-1?{url:'catalog.html?category='+encodeURIComponent(chosenCategory)+(index?'&subcategory='+encodeURIComponent(node.id):'')}: {})}))
  ] : category ? [{ name: "صفحه اصلی", url: "index.html" }, { name: "کاتالوگ محصولات", url: "catalog.html" }, ...(group ? [{ name: category.fa, url: `catalog.html?category=${encodeURIComponent(category.name)}` }, { name: group }] : [{ name: category.fa }])] : [{ name: "صفحه اصلی", url: "index.html" }, { name: "کاتالوگ محصولات" }]);
}
function setBreadcrumbs(items) {
  const nav = document.getElementById("seo-breadcrumbs");
  if (nav) nav.innerHTML = items.map((item, index) => item.url ? `<a href="${escapeHtml(item.url)}">${escapeHtml(item.name)}</a>${index < items.length - 1 ? '<span aria-hidden="true">›</span>' : ""}` : `<span aria-current="page">${escapeHtml(item.name)}</span>`).join("");
  setJsonLd("breadcrumb-schema", { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, ...(item.url ? { item: new URL(item.url, SEO_ORIGIN).href } : {}) })) });
}
function setProductSeo(product) {
  const displayName = product.nameFa ? `${product.nameFa} (${product.name})` : product.name;
  const title = `${displayName} (${product.cas !== "—" ? product.cas : product.number}) | ${product.brand} | فارما لب کیمیا`;
  const description = product.detail?.general || `${displayName} از برند ${product.brand}. شماره کاتالوگ: ${product.number}؛ شماره کاس: ${product.cas}. قیمت، بسته‌بندی و امکان تأمین پس از بررسی توسط مشاور فروش اعلام می‌شود.`;
  document.title = title;
  setPageMeta("description", description.slice(0, 300));
  setPageMeta("og:title", title, true); setPageMeta("og:description", description.slice(0, 300), true);
  if (product.imageUrl) setPageMeta("og:image", product.imageUrl, true);
  const url = new URL(`product.html?id=${encodeURIComponent(product.id)}`, SEO_ORIGIN).href;
  setPageMeta("og:url", url, true); setPageMeta("twitter:title", title); setPageMeta("twitter:description", description.slice(0, 300));
  setCanonical(url);
  const publicDetail = product.detail?.enabled === true && pageParams.get("cms-preview") !== "1";
  setRobots(publicDetail ? "index,follow" : "noindex,follow");
  if (publicDetail) setJsonLd("product-schema", {
    "@context": "https://schema.org", "@type": "Product", name: displayName, description,
    brand: { "@type": "Brand", name: product.brand }, category: categoryFa(product.category), url,
    ...(product.imageUrl ? { image: [product.imageUrl] } : {}),
    ...(product.number && product.number !== "Request by CAS" ? { sku: product.number, mpn: product.number } : {}),
    ...(product.cas && product.cas !== "—" ? { identifier: { "@type": "PropertyValue", propertyID: "CAS Number", value: product.cas } } : {}),
    additionalProperty: [
      ...(product.grade && !/confirm with sales/i.test(product.grade) ? [{ "@type": "PropertyValue", name: "Grade", value: product.grade }] : []),
      ...(product.formula && product.formula !== "Not listed" ? [{ "@type": "PropertyValue", name: "Molecular formula", value: product.formula }] : [])
    ]
  });
  setBreadcrumbs([{ name: "صفحه اصلی", url: "index.html" }, { name: "کاتالوگ محصولات", url: "catalog.html" }, { name: categoryFa(product.category), url: `catalog.html?category=${encodeURIComponent(product.category)}` }, { name: product.nameFa || product.name }]);
}

let mobileOverlayScroll = null;
function syncMobileOverlayScroll() {
  const open = window.innerWidth <= 720 && (!$("#detail-overlay").hidden || $("#quote-drawer").classList.contains("open"));
  if (open && !mobileOverlayScroll) {
    const body = document.body;
    mobileOverlayScroll = {
      y: window.scrollY,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow
    };
    body.style.position = "fixed";
    body.style.top = `-${mobileOverlayScroll.y}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
  } else if (!open && mobileOverlayScroll) {
    const { y, position, top, width, overflow } = mobileOverlayScroll;
    mobileOverlayScroll = null;
    Object.assign(document.body.style, { position, top, width, overflow });
    const scrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, y);
    document.documentElement.style.scrollBehavior = scrollBehavior;
  }
}
function closeProductDetail() {
  $("#detail-overlay").hidden = true;
  syncMobileOverlayScroll();
  if (catalogPage && requestedProductId) {
    requestedProductId = "";
    const url = new URL(location.href);
    url.searchParams.delete("product");
    history.replaceState(null, "", url);
    updateCatalogSeo();
  }
}
function openQuote() { closeProductPeek(); $("#quote-overlay").hidden = false; $("#quote-drawer").classList.add("open"); $("#quote-drawer").setAttribute("aria-hidden", "false"); document.body.classList.add("drawer-open"); syncMobileOverlayScroll(); }
function closeQuote() { $("#quote-overlay").hidden = true; $("#quote-drawer").classList.remove("open"); $("#quote-drawer").setAttribute("aria-hidden", "true"); document.body.classList.remove("drawer-open"); syncMobileOverlayScroll(); }
window.addEventListener("resize", syncMobileOverlayScroll);

window.addEventListener("DOMContentLoaded", initializeCatalog, { once: true });

$("#search-input").addEventListener("input", (event) => { searchSubmitted = false; searchTerm = event.target.value; catalogVisibleCount = catalogPageSize; catalogPageNumber = 1; renderSuggestions(searchTerm); renderProducts(); schedulePubChemSearch(searchTerm); });
$("#filter-search").addEventListener("input", (event) => { searchSubmitted = false; searchTerm = event.target.value; catalogVisibleCount = catalogPageSize; catalogPageNumber = 1; $("#search-input").value = searchTerm; renderSuggestions(searchTerm); renderProducts(); schedulePubChemSearch(searchTerm); });
$("#search-form").addEventListener("submit", (event) => { event.preventDefault(); searchSubmitted = true; searchTerm = $("#search-input").value; catalogVisibleCount = catalogPageSize; catalogPageNumber = 1; schedulePubChemSearch(searchTerm); renderProducts(); $("#suggestions").hidden = true; $("#catalog").scrollIntoView({ behavior: "smooth" }); });
$("#search-input").addEventListener("keydown", (event) => { if (event.key === "Escape") $("#suggestions").hidden = true; });
document.addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]"); if (add) { addProduct(add.dataset.add); if (add.closest("#suggestions")) $("#suggestions").hidden = true; }
  const detailLink = event.target.closest("a[data-detail-link]");
  if (detailLink && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    // Keep the native target=_blank navigation so browsers do not block the new tab.
    setTimeout(() => window.focus(), 0);
    return;
  }
  const detail = event.target.closest("[data-detail]");
  if (detail && !event.target.closest("[data-add]") && !event.target.closest("a")) {
    const href = detail.closest(".product-card")?.querySelector(".product-title")?.href;
    if (href) {
      const opened = window.open(href, "_blank");
      if (opened) { opened.opener = null; opened.blur(); }
      window.focus();
    }
  }
  const moreProducts = event.target.closest("[data-catalog-more]"); if (moreProducts) { catalogVisibleCount += catalogPageSize; renderProducts(); }
  if (event.target.closest("#detail-close") || event.target.id === "detail-overlay") closeProductDetail();
  const category = event.target.closest("[data-category]"); if (category) selectCategory(category.dataset.category);
  const reset = event.target.closest("[data-reset]");
  if (reset) {
    if (reset.dataset.reset === "search") { searchTerm = ""; $("#search-input").value = ""; $("#filter-search").value = ""; }
    if (reset.dataset.reset === "category") { chosenCategory = ""; chosenSubcategory = ""; }
    if (reset.dataset.reset === "subcategory") chosenSubcategory = "";
    if (reset.dataset.reset === "brand") chosenBrands.delete(reset.dataset.brand);
    catalogVisibleCount = catalogPageSize; catalogPageNumber = 1;
    renderProducts();
  }
  const remove = event.target.closest("[data-remove]"); if (remove) { quote.delete(remove.dataset.remove); updateQuote(); }
  const browse = event.target.closest("#browse-products"); if (browse) { closeQuote(); $("#catalog").scrollIntoView({ behavior: "smooth" }); }
  if (!event.target.closest(".searchbar")) $("#suggestions").hidden = true;
});
window.addEventListener("storage", event => {
  if (event.key !== quoteStorageKey) return;
  try { quote = new Map(JSON.parse(event.newValue || "[]")); } catch { quote = new Map(); }
  updateQuote();
});
document.addEventListener("load", (event) => {
  const image = event.target;
  if (image instanceof HTMLImageElement && image.classList.contains("product-photo")) image.closest(".product-visual")?.classList.add("has-loaded-image");
}, true);
document.addEventListener("error", (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.classList.contains("product-photo")) return;
  if (!image.parentElement.querySelector(".product-image-placeholder")) image.insertAdjacentHTML("afterend", productArt(image.dataset.fallbackArt || "flask"));
  image.remove();
}, true);
$("#suggestions").addEventListener("submit", (event) => {
  if (event.target.id !== "product-request-form") return;
  event.preventDefault();
  const requestValue = event.target.elements.request.value.trim();
  if (!requestValue) return;
  const cas = isValidCasNumber(requestValue) ? requestValue : "—";
  const id = `sigma-request-${[...requestValue].map((character) => character.codePointAt(0).toString(16)).join("-")}`;
  const sigmaUrl = `https://www.sigmaaldrich.com/TR/en/search?focus=products&page=1&perpage=30&sort=relevance&term=${encodeURIComponent(requestValue)}&type=product`;
  const product = { id, name: requestValue, brand: "Sigma-Aldrich availability check", number: requestValue, requestType: cas === "—" ? "Requested name / catalog number" : "CAS", cas, category: "Chemicals", group: "Supply availability request", grade: "Confirm with sales consultant", pack: "Confirm with sales consultant", description: "این محصول در کاتالوگ ثبت نشده است. مشاور فروش امکان تأمین از سیگما آلدریچ را بررسی می‌کند و نتیجه را به شما اطلاع می‌دهد.", art: "flask", sigmaUrl };
  const entry = quote.get(id) || { product, qty: "" };
  quote.set(id, entry);
  updateQuote();
  showToast("درخواست محصول به فهرست اضافه شد");
  $("#suggestions").hidden = true;
});
$("#category-filters").addEventListener("change", event => {
  const taxonomyInput = event.target.closest('input[data-taxonomy-filter]');
  if (taxonomy && taxonomyInput) {
    const id=taxonomyInput.dataset.taxonomyFilter;
    chosenCategory=taxonomy.root(id);
    chosenSubcategory=id===chosenCategory?'':id;
    taxonomy.path(id).slice(0,-1).forEach(node=>expandedFilterCategories.add(String(node.id)));
    if(taxonomy.children(id).length)expandedFilterCategories.add(id);
    catalogVisibleCount=catalogPageSize;catalogPageNumber=1;
    renderProducts();return;
  }
  const category = event.target.closest('input[name="category"]');
  if (category) { selectCategory(category.value); return; }
  const subgroup = event.target.closest('input[name="subcategory"]');
  if (subgroup) {
    chosenCategory = subgroup.dataset.parentCategory;
    chosenSubcategory = subgroup.value;
    expandedFilterCategories.add(chosenCategory);
    catalogVisibleCount = catalogPageSize; catalogPageNumber = 1;
    renderProducts();
    scrollToSelectedCategory();
  }
});
$("#category-filters").addEventListener("click", event => {
  const taxonomyInput=event.target.closest('input[data-taxonomy-filter]');
  if(taxonomy && taxonomyInput){
    const id=taxonomyInput.dataset.taxonomyFilter;
    if(id===(chosenSubcategory||chosenCategory)){
      event.preventDefault();chosenCategory='';chosenSubcategory='';
      expandedFilterCategories.delete(id);
      catalogVisibleCount=catalogPageSize;catalogPageNumber=1;
      renderProducts();return;
    }
  }
  const categoryInput = event.target.closest('input[name="category"]');
  if (categoryInput?.value === chosenCategory && !chosenSubcategory) {
    chosenCategory = "";
    expandedFilterCategories.delete(categoryInput.value);
    catalogVisibleCount = catalogPageSize; catalogPageNumber = 1;
    renderProducts();
    return;
  }
  const toggle = event.target.closest("[data-filter-expand]");
  if (!toggle) return;
  const category = toggle.dataset.filterExpand;
  const open = !expandedFilterCategories.has(category);
  if (open) expandedFilterCategories.add(category); else expandedFilterCategories.delete(category);
  toggle.setAttribute("aria-expanded", String(open));
  document.getElementById(toggle.getAttribute("aria-controls")).hidden = !open;
});
$("#brand-filters")?.addEventListener("change", event => {
  const input = event.target.closest('input[name="brand"]');
  if (!input) return;
  if (input.checked) chosenBrands.add(input.value); else chosenBrands.delete(input.value);
  catalogVisibleCount = catalogPageSize; catalogPageNumber = 1;
  renderProducts();
});
$("#catalog-sort")?.addEventListener("change", () => { catalogVisibleCount = catalogPageSize; catalogPageNumber = 1; renderProducts(); });
$("#clear-filters").addEventListener("click", () => {
  chosenCategory = ""; chosenSubcategory = ""; chosenBrands.clear(); expandedFilterCategories.clear(); searchTerm = ""; catalogVisibleCount = catalogPageSize; catalogPageNumber = 1;
  $("#filter-search").value = ""; $("#search-input").value = ""; renderProducts();
});
$("#quote-open").addEventListener("click", openQuote); $("#quote-close").addEventListener("click", closeQuote); $("#quote-overlay").addEventListener("click", closeQuote);
$("#quote-note").addEventListener("input", updateContactLinks);
$("#quote-items").addEventListener("input", (event) => {
  const quantity = event.target.closest("[data-qty-input]");
  const packaging = event.target.closest("[data-package-input]");
  const item = quote.get(quantity?.dataset.qtyInput || packaging?.dataset.packageInput);
  if (!item) return;
  if (quantity) item.qty = quantity.value.trim();
  if (packaging) item.packPreference = packaging.value.trim();
  updateContactLinks();
  try { localStorage.setItem(quoteStorageKey, JSON.stringify([...quote])); } catch {}
});
$("#send-whatsapp").addEventListener("click", (event) => { if (event.currentTarget.dataset.placeholder === "true") { event.preventDefault(); showToast("اطلاعات واتساپ هنوز در سایت ثبت نشده است"); } });
$("#send-email").addEventListener("click", (event) => { if (event.currentTarget.dataset.placeholder === "true") { event.preventDefault(); showToast("نشانی ایمیل هنوز در سایت ثبت نشده است"); } });
$("#copy-request").addEventListener("click", async () => {
  const message = formatQuoteMessage([...quote.values()], $("#quote-note")?.value || "");
  const copied = await window.FarmaQuoteWorkspace.copyText(message);
  showToast(copied ? "متن درخواست کپی شد" : "متن آماده است؛ آن را از کادر درخواست کپی کنید");
});
$("#menu-toggle").addEventListener("click", () => { const open = $("#nav").classList.toggle("nav-open"); $("#menu-toggle").setAttribute("aria-expanded", String(open)); if (!open) window.FarmaNavigation?.closeAll(); });
$("#detail-close").addEventListener("click", closeProductDetail);
$("#detail-add").addEventListener("click", () => { const number = $("#detail-add").dataset.detailAdd; closeProductDetail(); addProduct(number); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeProductPeek(); closeProductDetail(); closeQuote(); } });
