import {createSiteEditor} from "./admin-studio.js?v=taxonomy-20261027-r1";
import {createProductManager} from "./admin-products.js?v=category-path-20261028";
import {localImagePath,embeddedImage,importPublicationFlags,readProductArchive} from "./admin-product-archive.js?v=embedded-images-20261028";
import {prepareProductLink} from "./product-link.js?v=taxonomy-20261027-r1";
import {createTaxonomyEditor} from "./admin-taxonomy.js?v=taxonomy-20261027-r1";
import {contentGroups,editableSections,categoryDefaults,categoryKeys,brandDefaults,menuDefaults,readList,defaultFaq} from "./cms-schema.js?v=taxonomy-20261027-r1";
const client = await (window.farmaSupabaseReady || Promise.resolve(null));
const $ = (selector) => document.querySelector(selector);
const loginView = $("#login-view");
const dashboard = $("#dashboard-view");
const loginForm = $("#login-form");
const loginMessage = $("#login-message");
const resetRequestButton = $("#request-password-reset");
const resetRequestMessage = $("#reset-request-message");
const passwordResetView = $("#password-reset-view");
const passwordResetForm = $("#password-reset-form");
const passwordResetMessage = $("#password-reset-message");
const productsBody = $("#product-rows");
const productDialog = $("#product-dialog");
const productForm = $("#product-form");
const productLinkDialog = $("#product-link-dialog");
const productLinkForm = $("#product-link-form");
const productFields = ["id","name_en","brand","product_number","cas_number","category","subcategory","grade_purity","description_en","description_fa","pack_size","image_url","technical_document_url","source_name","source_url","additional_source_name","additional_source_url"];
const csvColumns = ["id","name_en","brand","product_number","cas_number","category","subcategory","grade_purity","description_en","description_fa","pack_size","image_url","technical_document_url","source_name","source_url","usage_permission_confirmed","active","compound_cid","molecular_formula","molecular_weight","pubchem_sid","image_type","additional_source_name","additional_source_url","detail_json"];
const pairLines = (value) => String(value || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
  const colon = line.search(/[:：]/);
  return colon < 0 ? {label:"",value:line} : {label:line.slice(0,colon).trim(),value:line.slice(colon+1).trim()};
});
const pairText = (items) => (Array.isArray(items) ? items : []).map((item) => `${item.label || ""}: ${item.value || ""}`).join("\n");
const detailReadyForPublication = (detail) => Boolean(detail?.enabled && detail.name_fa?.trim());
function detailFromForm() {
  const fields = productForm.elements;
  return {
    enabled: fields.detail_enabled.checked,
    name_fa: fields.detail_name_fa.value.trim(),
    about: pairLines(fields.detail_about.value),
    general: fields.detail_general.value.trim(),
    applications: fields.detail_applications.value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
    properties: pairLines(fields.detail_properties.value),
    safety: pairLines(fields.detail_safety.value),
    sds_note: fields.detail_sds_note.value.trim(),
    sds_url: fields.detail_sds_url.value.trim()
  };
}
function fillDetail(record) {
  const detail = record?.detail_json && typeof record.detail_json === "object" ? record.detail_json : {};
  productForm.elements.detail_enabled.checked = Boolean(detail.enabled);
  productForm.elements.detail_name_fa.value = detail.name_fa || "";
  productForm.elements.detail_about.value = pairText(detail.about);
  productForm.elements.detail_general.value = detail.general || "";
  productForm.elements.detail_applications.value = (detail.applications || []).join("\n");
  productForm.elements.detail_properties.value = pairText(detail.properties);
  productForm.elements.detail_safety.value = pairText(detail.safety);
  productForm.elements.detail_sds_note.value = detail.sds_note || "";
  productForm.elements.detail_sds_url.value = detail.sds_url || "";
  $("#product-detail-editor").open = Boolean(detail.enabled || record?.source_name === "Sigma-Aldrich" && /^Pending review · Sigma-Aldrich /.test(record.name_en));
}
function setProductPreview(record) {
  const link = $("#preview-product-detail");
  link.hidden = !record?.id || !record?.detail_json?.enabled;
  if (!link.hidden) link.href = `product.html?id=${encodeURIComponent(record.id)}&preview=1`;
}
async function loadProductQuestions(productId) {
  const section = $("#product-questions-admin");
  section.hidden = false; $("#product-question-rows").textContent = "در حال دریافت پرسش‌ها…";
  const {data,error} = await client.from("product_questions").select("id,question,answer,status").eq("product_id",productId).order("created_at",{ascending:false}).limit(100);
  if (productForm.elements.id.value !== productId) return;
  if (error) { $("#product-question-rows").textContent = "بخش پرسش‌ها پس از اجرای migration فعال می‌شود."; return; }
  $("#product-question-rows").innerHTML = (data || []).length ? data.map((item) => `<div class="product-question-row" data-question-id="${escapeHtml(item.id)}"><p><b>${escapeHtml(item.question)}</b> · ${item.status === "published" ? "منتشرشده" : item.status === "archived" ? "بایگانی" : "در انتظار"}</p><textarea aria-label="پاسخ به پرسش">${escapeHtml(item.answer || "")}</textarea><div class="product-question-actions"><button type="button" data-publish-question="${escapeHtml(item.id)}">ذخیره و انتشار پاسخ</button><button type="button" data-archive-question="${escapeHtml(item.id)}">بایگانی</button></div></div>`).join("") : "هنوز پرسشی ثبت نشده است.";
}
let allProducts = [];
let currentImage = "";
let allArticles = [];
let siteMedia = [];
let currentAdminUser = null;
let choosingCover = false;

function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char])); }
function setMessage(element, text, ok = false) { element.textContent = text; element.classList.toggle("is-success", ok); }
function cleanArticleHtml(input) {
  const parsed = new DOMParser().parseFromString(String(input || ""), "text/html");
  const allowed = new Set(["P","BR","H2","H3","H4","UL","OL","LI","STRONG","B","EM","I","BLOCKQUOTE","A"]);
  const blocked = new Set(["SCRIPT","STYLE","IFRAME","OBJECT","SVG","MATH","FORM","INPUT","BUTTON"]);
  const copy = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent || "");
    if (node.nodeType !== Node.ELEMENT_NODE) return document.createDocumentFragment();
    const tag = node.tagName;
    if (blocked.has(tag)) return document.createDocumentFragment();
    const output = allowed.has(tag) ? document.createElement(tag.toLowerCase()) : document.createDocumentFragment();
    if (tag === "A" && output.nodeType === Node.ELEMENT_NODE) {
      const rawHref = node.getAttribute("href") || "";
      try {
        const url = new URL(rawHref, location.origin);
        if (["http:","https:","mailto:"].includes(url.protocol)) {
          output.setAttribute("href", url.href);
          if (url.protocol !== "mailto:") { output.setAttribute("target", "_blank"); output.setAttribute("rel", "noopener noreferrer"); }
        }
      } catch {}
    }
    for (const child of node.childNodes) output.append(copy(child));
    return output;
  };
  const clean = document.createDocumentFragment();
  for (const child of parsed.body.childNodes) clean.append(copy(child));
  const holder = document.createElement("div"); holder.append(clean); return holder.innerHTML;
}
function safeHttpUrl(value) {
  const text = String(value || "").trim(); if (!text) return "";
  try { const url = new URL(text); return ["https:","http:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }
}
function slugifyArticle(value) {
  return String(value || "").normalize("NFKC").trim().toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 160);
}
function articleStatus(status) {
  return status === "published" ? "منتشرشده" : status === "archived" ? "بایگانی‌شده" : "پیش‌نویس";
}
function updateMetrics() {
  $("#metric-products").textContent = allProducts.length.toLocaleString("fa-IR");
  $("#metric-published").textContent = allArticles.filter((item) => item.status === "published").length.toLocaleString("fa-IR");
  $("#metric-drafts").textContent = allArticles.filter((item) => item.status === "draft").length.toLocaleString("fa-IR");
  $("#metric-media").textContent = siteMedia.length.toLocaleString("fa-IR");
}
function renderArticles() {
  const q = $("#article-search").value.trim().toLocaleLowerCase();
  const status = $("#article-status-filter").value;
  const rows = allArticles.filter((item) => (!status || item.status === status) && [item.title,item.category,...(item.tags || [])].some((value) => String(value || "").toLocaleLowerCase().includes(q)));
  $("#article-count").textContent = `${rows.length.toLocaleString("fa-IR")} مقاله`;
  $("#empty-articles").hidden = rows.length > 0;
  $("#article-rows").innerHTML = rows.map((item) => `<tr><td><b>${escapeHtml(item.title)}</b><small class="article-slug" dir="ltr">/${escapeHtml(item.slug)}</small></td><td>${escapeHtml(item.category || "—")}</td><td><span class="status-pill ${item.status === "published" ? "" : "off"}">${articleStatus(item.status)}</span></td><td>${item.updated_at ? new Date(item.updated_at).toLocaleDateString("fa-IR") : "—"}</td><td><div class="row-actions"><button data-edit-article="${escapeHtml(item.id)}">ویرایش</button>${item.status === "archived" ? `<button data-restore-article="${escapeHtml(item.id)}">بازگردانی</button>` : `<button data-toggle-article="${escapeHtml(item.id)}">${item.status === "published" ? "پیش‌نویس" : "انتشار"}</button><button class="delete" data-archive-article="${escapeHtml(item.id)}">بایگانی</button>`}${item.status === "published" ? `<a class="article-open-link" href="articles.html?slug=${encodeURIComponent(item.slug)}" target="_blank" rel="noopener">مشاهده ↗</a>` : ""}</div></td></tr>`).join("");
  const categories = [...new Set(allArticles.map((item) => item.category).filter(Boolean))];
  $("#article-categories").innerHTML = categories.map((value) => `<option value="${escapeHtml(value)}"></option>`).join("");
  updateMetrics();
}
async function loadArticles() {
  const { data, error } = await client.from("articles").select("*").order("updated_at", { ascending: false }).limit(1000);
  if (error) { allArticles = []; renderArticles(); setMessage($("#article-message"), `برای فعال‌شدن نوشته‌ها، migration بخش CMS را در Supabase اجرا کنید. (${error.message})`); return; }
  allArticles = data || []; renderArticles();
}
function renderMedia() {
  $("#empty-media").hidden = siteMedia.length > 0;
  $("#media-grid").innerHTML = siteMedia.map((item) => {
    const url = client.storage.from("site-media").getPublicUrl(item.name).data.publicUrl;
    return `<article class="media-card"><img src="${escapeHtml(url)}" alt="${escapeHtml(item.name)}" loading="lazy" /><div><b title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</b><div class="media-actions"><button type="button" data-use-media="${escapeHtml(item.name)}">${choosingCover ? "انتخاب تصویر" : "کپی نشانی"}</button><button type="button" class="delete" data-delete-media="${escapeHtml(item.name)}">حذف</button></div></div></article>`;
  }).join("");
  updateMetrics();
}
async function loadMedia() {
  const { data, error } = await client.storage.from("site-media").list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error) { siteMedia = []; renderMedia(); setMessage($("#media-message"), `کتابخانه رسانه آماده نیست. migration بخش CMS را در Supabase اجرا کنید. (${error.message})`); return; }
  siteMedia = (data || []).filter((item) => item.id); renderMedia();
}
function switchTab(name) {
  document.querySelectorAll("[data-tab]").forEach((tab) => { const active = tab.dataset.tab === name; tab.classList.toggle("is-active", active); tab.setAttribute("aria-selected", String(active)); });
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("is-active", panel.id === `${name}-panel`));
  if (name === "media") loadMedia();
}
function openArticle(record = null) {
  const form = $("#article-form"); form.reset(); form.elements.id.value = record?.id || "";
  if (record?.slug) form.elements.slug.dataset.manuallyEdited = "true"; else delete form.elements.slug.dataset.manuallyEdited;
  form.elements.title.value = record?.title || ""; form.elements.slug.value = record?.slug || "";
  form.elements.category.value = record?.category || ""; form.elements.excerpt.value = record?.excerpt || "";
  form.elements.cover_image_url.value = record?.cover_image_url || "";
  form.elements.tags.value = (record?.tags || []).join(", "); form.elements.status.value = record?.status || "draft";
  $("#article-body-editor").innerHTML = cleanArticleHtml(record?.body_html || "");
  $("#article-dialog-title").textContent = record ? "ویرایش مقاله" : "مقاله جدید";
  setMessage($("#article-message"), ""); $("#article-dialog").showModal();
}
async function saveArticle(event) {
  event.preventDefault();
  const form = $("#article-form"), title = form.elements.title.value.trim();
  const body = cleanArticleHtml($("#article-body-editor").innerHTML);
  if (!title) { setMessage($("#article-message"), "عنوان مقاله را وارد کنید."); return; }
  if (!body.replace(/<[^>]*>/g, "").replace(/&nbsp;|&#160;/gi, " ").trim()) { setMessage($("#article-message"), "متن مقاله را وارد کنید."); $("#article-body-editor").focus(); return; }
  const previous = allArticles.find((item) => item.id === form.elements.id.value);
  const slug = slugifyArticle(form.elements.slug.value || title) || `article-${Date.now()}`;
  const record = {
    ...(previous?.id ? { id: previous.id } : {}), title, slug,
    category: form.elements.category.value.trim(), excerpt: form.elements.excerpt.value.trim(),
    body_html: body, cover_image_url: safeHttpUrl(form.elements.cover_image_url.value),
    tags: [...new Set(form.elements.tags.value.split(/[,،]/).map((tag) => tag.trim()).filter(Boolean))],
    status: form.elements.status.value, author_id: currentAdminUser?.id || null,
    published_at: form.elements.status.value === "published" ? (previous?.published_at || new Date().toISOString()) : null,
    updated_at: new Date().toISOString()
  };
  setMessage($("#article-message"), "در حال ذخیره مقاله…", true);
  const { error } = await client.from("articles").upsert(record, { onConflict: "id" });
  if (error) { setMessage($("#article-message"), error.code === "23505" ? "این پیوند یکتا برای مقاله دیگری استفاده شده است." : `ذخیره انجام نشد: ${error.message}`); return; }
  $("#article-dialog").close(); await loadArticles();
}
function parseCsv(text) {
  const rows = []; let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' && quoted && text[i + 1] === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) { if (char === "\r" && text[i + 1] === "\n") i += 1; row.push(cell); if (row.some((v) => v.trim())) rows.push(row); row = []; cell = ""; }
    else cell += char;
  }
  row.push(cell); if (row.some((v) => v.trim())) rows.push(row);
  if (!rows.length) return [];
  const headers = rows.shift().map((value, i) => (i === 0 ? value.replace(/^\uFEFF/, "") : value).trim());
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] || "").trim()])));
}
function csvEscape(value) { const text = String(value ?? ""); return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; }
function toBoolean(value) { return value === true || String(value).toUpperCase() === "YES" || String(value).toLowerCase() === "true"; }
function formRecord() {
  const record = Object.fromEntries(productFields.map((key) => [key, productForm.elements[key].value.trim()]));
  const previous = allProducts.find((item) => String(item.id) === String(record.id));
  for (const key of ["compound_cid","molecular_formula","molecular_weight","pubchem_sid","image_type"]) {
    record[key] = previous?.[key] || (key === "image_type" ? "supplier_photo" : "");
  }
  record.usage_permission_confirmed = productForm.elements.usage_permission_confirmed.checked;
  record.active = productForm.elements.active.checked;
  const detail = detailFromForm();
  if (detail.enabled || previous?.detail_json?.enabled || detail.name_fa || detail.general) record.detail_json = {...previous?.detail_json, ...detail};
  if (currentImage) { record.image_url = currentImage; record.image_type = "supplier_photo"; }
  record.updated_at = new Date().toISOString();
  if (!record.id) record.id = record.product_number || crypto.randomUUID();
  return record;
}

function renderProducts() { productManager.render(); updateMetrics(); }
async function loadProducts() {
  const rows=[];
  for(let start=0;;start+=1000){
    const {data,error}=await client.from("products").select("*").order("name_en").order("id").range(start,start+999);
    if(error)throw error;
    rows.push(...(data||[])); if(!data||data.length<1000)break;
  }
  allProducts=rows;productManager.refresh();taxonomyEditor.render();updateMetrics();
}
function renderSubcategorySuggestions() {
  const category = productForm.elements.category.value.trim();
  productForm.elements.subcategory.required=Boolean(window.FarmaTaxonomy?.find(category));
  if(window.FarmaTaxonomy?.find(category)) {
    const selected=productForm.elements.subcategory.value;
    const nodes=[];
    const walk=(items,depth=0)=>items.forEach(node=>{if(window.FarmaTaxonomy.visible(node.id)){nodes.push([node,depth]);walk(node.children,depth+1);}});
    walk(window.FarmaTaxonomy.children(category));
    productForm.elements.subcategory.innerHTML='<option value="">انتخاب زیرگروه تا پایین‌ترین سطح</option>'+nodes.map(([node,depth])=>'<option value="'+escapeHtml(node.id)+'">'+escapeHtml('  '.repeat(depth)+node.fa+' · '+node.name)+'</option>').join('');
    if(nodes.some(([node])=>String(node.id)===selected))productForm.elements.subcategory.value=selected;
    return;
  }
  const fa = {"Solvents":"حلال‌ها","Acids":"اسیدها","Buffers & salts":"بافرها و نمک‌ها","Reagents & indicators":"معرف‌ها و شناساگرها","Biochemicals":"مواد بیوشیمیایی","Inorganic chemicals":"مواد شیمیایی معدنی","Other chemicals & reagents":"سایر مواد و معرف‌ها","Lab instruments":"دستگاه‌های آزمایشگاهی","Measuring instruments":"ابزارهای اندازه‌گیری","Laboratory glassware":"شیشه‌آلات آزمایشگاهی","Beakers":"بشرها","Flasks":"بالن‌ها و ارلن‌ها","Pipettes":"پیپت‌ها","Nanoparticles and nanopowders":"نانوذرات و نانوپودرها","Disposables":"ملزومات مصرفی","Personal protective equipment":"تجهیزات حفاظت فردی","Calibration standards":"استانداردهای کالیبراسیون","Reference materials":"مواد مرجع","Microbiology materials":"مواد میکروبیولوژی","Prepared culture media":"محیط کشت آماده"};
  const recommended = {
    Chemicals: ["Solvents","Acids","Buffers & salts","Reagents & indicators","Biochemicals","Inorganic chemicals","Other chemicals & reagents"],
    Equipment: ["Lab instruments","Measuring instruments"],
    Glassware: ["Laboratory glassware","Beakers","Flasks","Pipettes"],
    Nanomaterials: ["Nanoparticles and nanopowders"],
    "Medical supplies": ["Disposables","Personal protective equipment"],
    "Reference standards": ["Calibration standards","Reference materials"],
    "Culture media": ["Microbiology materials","Prepared culture media"]
  };
  const suggestions = [...new Set([...(recommended[category]||[]),...allProducts
    .filter((item) => !category || String(item.category || "").trim() === category)
    .map((item) => String(item.subcategory || "").trim())
    .filter(Boolean)])]
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  $("#subcategory-suggestions").innerHTML = suggestions.map((value) => `<option value="${escapeHtml(value)}" label="${escapeHtml(fa[value] || value)}"></option>`).join("");
  const current=productForm.elements.subcategory.value;
  productForm.elements.subcategory.innerHTML='<option value="">انتخاب زیرگروه</option>'+suggestions.map(value=>'<option value="'+escapeHtml(value)+'">'+escapeHtml(fa[value]||value)+'</option>').join('');
  if(suggestions.includes(current))productForm.elements.subcategory.value=current;
}
function showDashboard(user) {
  currentAdminUser = user; loginView.hidden = true; dashboard.hidden = false; $("#signed-in-email").textContent = user.email || "";
}
function showPasswordReset() {
  loginView.hidden = true; dashboard.hidden = true; passwordResetView.hidden = false;
}
async function checkAdmin(user) {
  const { data, error } = await client.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (error || !data) return false;
  return true;
}

const siteEditor=createSiteEditor(client,{onSettingsChange:()=>productManager.refresh()});
const productManager=createProductManager({client,getProducts:()=>allProducts,getCategories:()=>window.FarmaTaxonomy?.roots.map(node=>({name:String(node.id),fa:node.fa,visible:true}))||categoryDefaults,onReload:loadProducts,onExport:exportProducts});
const taxonomyEditor=createTaxonomyEditor({client,getProducts:()=>allProducts,onSaved:()=>productManager.refresh()});
function initContent(){return siteEditor.load();}
async function loadDashboardData(){
  const results=await Promise.allSettled([initContent(),taxonomyEditor.load(),loadProducts(),loadArticles(),loadMedia()]);
  const failure=results.find(result=>result.status==='rejected');
  if(failure)alert(`خطا در دریافت بخشی از اطلاعات: ${failure.reason?.message || failure.reason}`);
}
function exportProducts(rows=allProducts,filename="farma-lab-kimia-catalog.csv"){
  const content=[csvColumns.join(","),...rows.map(record=>csvColumns.map(key=>csvEscape(key==="active"||key==="usage_permission_confirmed"?(record[key]?"YES":"NO"):key==="detail_json"?JSON.stringify(record.detail_json||{}):record[key])).join(","))].join("\r\n");
  const url=URL.createObjectURL(new Blob(["\uFEFF",content],{type:"text/csv;charset=utf-8"}));
  const anchor=document.createElement("a");anchor.href=url;anchor.download=filename;anchor.click();URL.revokeObjectURL(url);
}
$("#overview-editor-shortcuts").innerHTML=contentGroups.map(group=>'<button type="button" data-editor-shortcut="'+group.id+'"><span><b>'+escapeHtml(group.title)+'</b><small>ویرایش این بخش</small></span><span>←</span></button>').join("");
$("#overview-editor-shortcuts").addEventListener("click",event=>{const button=event.target.closest("[data-editor-shortcut]");if(button){if(button.dataset.editorShortcut==='categories')switchTab('taxonomy');else{switchTab("content");siteEditor.selectGroup(button.dataset.editorShortcut);}}});

if (!client) {
  $("#setup-alert").hidden = false;
  loginForm.querySelectorAll("input,button").forEach((element) => element.disabled = true);
} else {
  const recoveryMode = new URLSearchParams(location.search).get("mode") === "recovery";
  if (recoveryMode) showPasswordReset();
  client.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") showPasswordReset();
    if (!session && !recoveryMode) { dashboard.hidden = true; passwordResetView.hidden = true; loginView.hidden = false; }
  });
  const { data: { session } } = await client.auth.getSession();
  if (recoveryMode) {
    showPasswordReset();
  } else if (session && await checkAdmin(session.user)) {
    showDashboard(session.user);
    await loadDashboardData();
  } else if (session) {
    await client.auth.signOut();
    setMessage(loginMessage, "این حساب دسترسی مدیر ندارد.");
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); if (!client) return;
  setMessage(loginMessage, "در حال ورود…", true);
  const { data, error } = await client.auth.signInWithPassword({ email: loginForm.elements.email.value.trim(), password: loginForm.elements.password.value });
  if (error) { setMessage(loginMessage, "ورود انجام نشد؛ ایمیل و رمز عبور را بررسی کنید."); return; }
  if (!await checkAdmin(data.user)) { await client.auth.signOut(); setMessage(loginMessage, "این حساب در فهرست مدیران مجاز نیست."); return; }
  showDashboard(data.user);
  await loadDashboardData();
});
resetRequestButton.addEventListener("click", async () => {
  if (!client) return;
  const email = loginForm.elements.email.value.trim();
  if (!email) { setMessage(resetRequestMessage, "ابتدا ایمیل مدیر را وارد کنید."); loginForm.elements.email.focus(); return; }
  setMessage(resetRequestMessage, "در حال ارسال پیوند…", true);
  const redirectTo = `${location.origin}/admin.html?mode=recovery`;
  const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) { setMessage(resetRequestMessage, `ارسال پیوند انجام نشد: ${error.message}`); return; }
  setMessage(resetRequestMessage, "اگر این ایمیل در سامانه ثبت شده باشد، پیوند تعیین رمز برای آن ارسال می‌شود.", true);
});
passwordResetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = passwordResetForm.elements.password.value;
  if (password !== passwordResetForm.elements.password_confirmation.value) { setMessage(passwordResetMessage, "رمزهای واردشده یکسان نیستند."); return; }
  setMessage(passwordResetMessage, "در حال ذخیره رمز…", true);
  const { error } = await client.auth.updateUser({ password });
  if (error) { setMessage(passwordResetMessage, `ذخیره رمز انجام نشد: ${error.message}`); return; }
  await client.auth.signOut();
  history.replaceState(null, "", `${location.pathname}`);
  passwordResetView.hidden = true; loginView.hidden = false; passwordResetForm.reset();
  setMessage(loginMessage, "رمز عبور ذخیره شد. اکنون با ایمیل و رمز جدید وارد شوید.", true);
});
$("#signout-button").addEventListener("click", async () => { await client?.auth.signOut(); });
document.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => {
  switchTab(button.dataset.tab);
}));
document.querySelectorAll("[data-go-tab]").forEach((button) => button.addEventListener("click", () => {
  switchTab(button.dataset.goTab);
  if (button.hasAttribute("data-create-article")) openArticle();
  if (button.hasAttribute("data-create-product")) $("#new-product").click();
}));
$("#new-article").addEventListener("click", () => openArticle());
$("#article-form").addEventListener("submit", saveArticle);
$("#article-search").addEventListener("input", renderArticles);
$("#article-status-filter").addEventListener("change", renderArticles);
$("#article-dialog").querySelectorAll("[data-close-article]").forEach((button) => button.addEventListener("click", () => $("#article-dialog").close()));
$("#article-form").elements.title.addEventListener("input", () => {
  const slugField = $("#article-form").elements.slug;
  if (slugField.dataset.manuallyEdited !== "true") slugField.value = slugifyArticle($("#article-form").elements.title.value);
});
$("#article-form").elements.slug.addEventListener("input", (event) => { event.currentTarget.dataset.manuallyEdited = "true"; });
document.querySelectorAll("[data-editor-command]").forEach((button) => button.addEventListener("click", () => {
  const editor = $("#article-body-editor"); editor.focus();
  document.execCommand(button.dataset.editorCommand, false, button.dataset.editorValue || null);
}));
$("#choose-cover").addEventListener("click", async () => {
  choosingCover = true; switchTab("media"); await loadMedia();
  setMessage($("#media-message"), "تصویر شاخص مقاله را از کتابخانه انتخاب کنید.", true);
});
$("#media-upload").addEventListener("change", async (event) => {
  const files = [...(event.target.files || [])]; if (!files.length) return;
  for (const file of files) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
      setMessage($("#media-message"), "فقط تصویر PNG، JPG یا WebP تا حجم ۵ مگابایت پذیرفته می‌شود."); continue;
    }
    const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
    const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`;
    setMessage($("#media-message"), `در حال بارگذاری ${file.name}…`, true);
    const { error } = await client.storage.from("site-media").upload(path, file, { upsert: false, contentType: file.type });
    if (error) { setMessage($("#media-message"), `بارگذاری انجام نشد: ${error.message}`); continue; }
  }
  event.target.value = ""; await loadMedia(); setMessage($("#media-message"), "بارگذاری رسانه انجام شد.", true);
});
$("#media-grid").addEventListener("click", async (event) => {
  const useName = event.target.closest("[data-use-media]")?.dataset.useMedia;
  const deleteName = event.target.closest("[data-delete-media]")?.dataset.deleteMedia;
  if (useName) {
    const url = client.storage.from("site-media").getPublicUrl(useName).data.publicUrl;
    if (choosingCover) {
      $("#article-form").elements.cover_image_url.value = url;
      choosingCover = false; switchTab("articles"); $("#article-dialog").showModal();
      setMessage($("#article-message"), "تصویر شاخص انتخاب شد.", true);
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url); setMessage($("#media-message"), "نشانی تصویر کپی شد.", true);
    } else {
      window.prompt("نشانی رسانه", url);
    }
  }
  if (deleteName && confirm("این تصویر از کتابخانه رسانه حذف شود؟ ممکن است مقاله‌ای از آن استفاده کند.")) {
    const { error } = await client.storage.from("site-media").remove([deleteName]);
    if (error) setMessage($("#media-message"), `حذف انجام نشد: ${error.message}`);
    else { await loadMedia(); setMessage($("#media-message"), "تصویر حذف شد.", true); }
  }
});
$("#article-rows").addEventListener("click", async (event) => {
  const id = event.target.closest("[data-edit-article],[data-toggle-article],[data-archive-article],[data-restore-article]")?.dataset.editArticle
    || event.target.closest("[data-toggle-article]")?.dataset.toggleArticle
    || event.target.closest("[data-archive-article]")?.dataset.archiveArticle
    || event.target.closest("[data-restore-article]")?.dataset.restoreArticle;
  if (!id) return;
  const record = allArticles.find((item) => item.id === id); if (!record) return;
  if (event.target.closest("[data-edit-article]")) { openArticle(record); return; }
  let status = record.status;
  if (event.target.closest("[data-toggle-article]")) status = record.status === "published" ? "draft" : "published";
  if (event.target.closest("[data-archive-article]")) {
    if (!confirm("مقاله به بایگانی منتقل شود؟ هر زمان می‌توانید آن را بازگردانید.")) return;
    status = "archived";
  }
  if (event.target.closest("[data-restore-article]")) status = "draft";
  const { error } = await client.from("articles").update({ status, published_at: status === "published" ? (record.published_at || new Date().toISOString()) : null, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) alert(`وضعیت مقاله تغییر نکرد: ${error.message}`); else await loadArticles();
});

productForm.elements.category.addEventListener("change", () => { productForm.elements.subcategory.value="";renderSubcategorySuggestions(); });
$("#new-product").addEventListener("click", () => {
  productForm.reset(); productManager.options(); productForm.elements.id.value = ""; currentImage = ""; fillDetail(null); setProductPreview(null); $("#product-questions-admin").hidden = true; renderSubcategorySuggestions(); $("#dialog-title").textContent = "محصول جدید"; $("#product-message").textContent = ""; productDialog.showModal();
});
$("#new-product-from-link").addEventListener("click", () => {
  productLinkForm.reset(); setMessage($("#product-link-message"), ""); productLinkDialog.showModal();
});
productLinkDialog.querySelectorAll("[data-close-product-link-dialog]").forEach((button) => button.addEventListener("click", () => productLinkDialog.close("cancel")));
productLinkForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const draft = prepareProductLink(productLinkForm.elements.url.value);
    const duplicate = allProducts.find((item) =>
      (item.source_url && item.source_url.replace(/#.*$/, "") === draft.source_url)
      || (draft.product_number && item.product_number === draft.product_number && item.brand === draft.brand)
    );
    if (duplicate) { setMessage($("#product-link-message"), "این پیوند قبلاً ثبت شده است. محصول موجود را ویرایش کنید."); return; }
    const button = productLinkForm.querySelector('[type="submit"]'); button.disabled = true;
    setMessage($("#product-link-message"), "در حال ساخت پیش‌نویس…", true);
    try {
      const record = {
        id: `sigma-link-${crypto.randomUUID()}`, name_en: `Pending review · Sigma-Aldrich ${draft.product_number}`,
        brand: draft.brand, product_number: draft.product_number, category: "Chemicals",
        source_name: draft.source_name, source_url: draft.source_url,
        active: false, usage_permission_confirmed: false, updated_at: new Date().toISOString()
      };
      const {error} = await client.from("products").insert(record);
      if (error) throw error;
      productLinkDialog.close(); await loadProducts(); productManager.showStatus("hidden");
      $("#product-search").value = draft.product_number; productManager.render();
      setMessage($("#products-message"), "پیش‌نویس ذخیره شد. برای تکمیل اطلاعات، ویرایش را باز کنید.", true);
    } catch (error) { setMessage($("#product-link-message"), `پیش‌نویس ذخیره نشد: ${error.message}`); }
    finally { button.disabled = false; }
  } catch (error) { setMessage($("#product-link-message"), error.message); }
});
productDialog.querySelectorAll("[data-close-product-dialog]").forEach((button) => button.addEventListener("click", () => {
  productForm.reset(); currentImage = ""; productDialog.close("cancel");
}));
productsBody.addEventListener("click", async (event) => {
  if (productManager.busy) return;
  const editId = event.target.closest("[data-edit]")?.dataset.edit;
  const deleteId = event.target.closest("[data-delete]")?.dataset.delete;
  const toggleId = event.target.closest("[data-toggle-active]")?.dataset.toggleActive;
  if (toggleId) {
    const record = allProducts.find((item) => String(item.id) === toggleId); if (!record) return;
    if (!record.active && /^Pending review · Sigma-Aldrich /.test(record.name_en)) { alert("نام موقت پیش‌نویس را پیش از انتشار تغییر دهید."); return; }
    if (!record.active && String(record.id).startsWith("sigma-link-") && !record.detail_json?.enabled) { alert("صفحهٔ تفصیلی محصول را پیش از انتشار تکمیل و فعال کنید."); return; }
    if (!record.active && record.detail_json?.enabled && !detailReadyForPublication(record.detail_json)) { alert("برای انتشار صفحهٔ تفصیلی، نام فارسی محصول را تکمیل کنید."); return; }
    const { error } = await client.from("products").update({ active: !record.active, updated_at: new Date().toISOString() }).eq("id", toggleId);
    if (error) alert(`وضعیت محصول تغییر نکرد: ${error.message}`); else await loadProducts();
    return;
  }
  if (editId) {
    const record = allProducts.find((item) => String(item.id) === editId); if (!record) return;
    productForm.reset(); productManager.options(); productFields.filter(key=>key!=="subcategory").forEach((key) => { productForm.elements[key].value = record[key] || ""; });
    fillDetail(record);
    setProductPreview(record);
    productForm.elements.usage_permission_confirmed.checked = record.usage_permission_confirmed;
    productForm.elements.active.checked = record.active; currentImage = ""; renderSubcategorySuggestions(); productForm.elements.subcategory.value=record.subcategory||""; $("#dialog-title").textContent = "ویرایش محصول"; $("#product-message").textContent = ""; productDialog.showModal();
    if (record.detail_json?.enabled) void loadProductQuestions(String(record.id)); else $("#product-questions-admin").hidden = true;
  }
  if (deleteId) productManager.requestDelete([deleteId]);
});
$("#product-question-rows").addEventListener("click", async (event) => {
  const publish = event.target.closest("[data-publish-question]");
  const archive = event.target.closest("[data-archive-question]");
  if (!publish && !archive) return;
  const id = publish?.dataset.publishQuestion || archive.dataset.archiveQuestion;
  const row = event.target.closest("[data-question-id]");
  const answer = row.querySelector("textarea").value.trim();
  if (publish && !answer) { setMessage($("#product-question-message"), "پاسخ را بنویسید."); return; }
  const {error} = await client.from("product_questions").update({answer:publish?answer:"",status:publish?"published":"archived",updated_at:new Date().toISOString()}).eq("id",id);
  if (error) setMessage($("#product-question-message"), `ثبت پاسخ انجام نشد: ${error.message}`);
  else { setMessage($("#product-question-message"), "پرسش به‌روزرسانی شد.",true); await loadProductQuestions(productForm.elements.id.value); }
});
$("#image-upload").addEventListener("change", async (event) => {
  const file = event.target.files?.[0]; if (!file) return;
  if (file.size > 5 * 1024 * 1024) { setMessage($("#product-message"), "اندازه تصویر باید کمتر از ۵ مگابایت باشد."); event.target.value = ""; return; }
  const id = productForm.elements.id.value || productForm.elements.product_number.value || crypto.randomUUID();
  const extension = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${id.replace(/[^a-zA-Z0-9_-]/g, "-")}/${Date.now()}.${extension}`;
  setMessage($("#product-message"), "در حال بارگذاری تصویر…", true);
  const { error } = await client.storage.from("product-images").upload(path, file, { upsert: true, contentType: file.type });
  if (error) { setMessage($("#product-message"), `بارگذاری تصویر انجام نشد: ${error.message}`); return; }
  currentImage = client.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  productForm.elements.image_url.value = currentImage;
  setMessage($("#product-message"), "تصویر بارگذاری شد.", true);
});
productForm.addEventListener("submit", async (event) => {
  event.preventDefault(); const record = formRecord();
  if(record.active && window.FarmaTaxonomy?.find(record.category) && (!window.FarmaTaxonomy.visible(record.subcategory)||!window.FarmaTaxonomy.belongs(record,record.category))) {
    setMessage($("#product-message"),"برای انتشار، یک زیرگروه قابل نمایش از همین دسته انتخاب کنید.");return;
  }
  if (record.active && /^Pending review · Sigma-Aldrich /.test(record.name_en)) {
    setMessage($("#product-message"), "نام موقت پیش‌نویس را پیش از انتشار با نام واقعی محصول جایگزین کنید."); return;
  }
  if (record.active && String(record.id).startsWith("sigma-link-") && !record.detail_json?.enabled) {
    setMessage($("#product-message"), "صفحهٔ تفصیلی محصول را پیش از انتشار تکمیل و فعال کنید."); return;
  }
  if (record.active && record.detail_json?.enabled && !detailReadyForPublication(record.detail_json)) {
    setMessage($("#product-message"), "برای انتشار صفحهٔ تفصیلی، نام فارسی محصول را تکمیل کنید."); return;
  }
  $("#save-product").disabled=true;setMessage($("#product-message"),"در حال ذخیره محصول…",true);
  try {
    const {error}=await client.from("products").upsert(record,{onConflict:"id"});
    if(error)throw error;
    productDialog.close();await loadProducts();
    setMessage($("#products-message"),"محصول ذخیره شد.",true);
  } catch(error){setMessage($("#product-message"),'ذخیره انجام نشد: '+error.message);}
  finally{$("#save-product").disabled=false;}
});
async function importProductRows(source,images=null) {
  let imported=0,attempted=false;
  await productManager.runExclusive(async()=>{
    try {
      if(!source.length)throw new Error("فایل CSV خالی است.");
      const invalid=source.flatMap((row,i)=>!row.id||!row.name_en||!row.brand?[i+1]:[]);
      if(invalid.length)throw new Error("شناسه، نام انگلیسی و برند را در ردیف‌های داده تکمیل کنید: "+invalid.slice(0,8).join("، "));
      const existingById=new Map(allProducts.map(item=>[String(item.id),item]));
      const seen=new Set();
      const rows=source.map((row,index)=>{
        if(seen.has(row.id))throw new Error("شناسه تکراری در فایل: "+row.id);seen.add(row.id);
        const record=Object.fromEntries(csvColumns.map(key=>[key,row[key]||""]));
        if(record.detail_json){try{record.detail_json=JSON.parse(record.detail_json);if(!record.detail_json||typeof record.detail_json!=='object'||Array.isArray(record.detail_json))throw new Error();}catch{throw new Error("اطلاعات تفصیلی JSON در ردیف داده "+(index+1)+" معتبر نیست.");}}
        else delete record.detail_json;
        const previous=existingById.get(String(row.id));
        Object.assign(record,importPublicationFlags(row.active,row.usage_permission_confirmed,previous,toBoolean));
        record.updated_at=new Date().toISOString();return record;
      });
      const imageJobs=new Map();
      for(const row of rows){
        const path=localImagePath(row.image_url);
        if(path){
          if(!images?.has(path))throw new Error("CSV به تصویر محلی اشاره می‌کند. فایل ZIP حاوی تصاویر یا CSV تصویردار را انتخاب کنید: "+path);
          imageJobs.set(row.image_url,images.get(path));
        } else if(/^data:/i.test(row.image_url)){
          imageJobs.set(row.image_url,embeddedImage(row.image_url));
        }
      }
      const incomplete=rows.find(row=>{
        if(!row.active||!String(row.id).startsWith('sigma-link-'))return false;
        const detail=row.detail_json||allProducts.find(item=>String(item.id)===String(row.id))?.detail_json;
        return /^Pending review · Sigma-Aldrich /.test(row.name_en)||!detailReadyForPublication(detail);
      });
      if(incomplete)throw new Error("پیش‌نویس ناقص سیگما قابل انتشار نیست: "+incomplete.product_number);
      const existing=new Set(allProducts.map(item=>String(item.id))),updates=rows.filter(row=>existing.has(row.id)).length;
      if(!confirm((rows.length-updates).toLocaleString('fa-IR')+" محصول جدید و "+updates.toLocaleString('fa-IR')+" به‌روزرسانی وارد شود؟ "+(imageJobs.size?imageJobs.size.toLocaleString('fa-IR')+" تصویر نیز در فضای ذخیره‌سازی بارگذاری می‌شود. ":"")+"وضعیت انتشار محصولات موجود حفظ می‌شود؛ سایر اطلاعات شناسه‌های موجود به‌روزرسانی می‌شود."))return;
      let imageIndex=0;
      for(const [original,image] of imageJobs){
        const owner=rows.find(row=>row.image_url===original);
        const safeId=String(owner.id).replace(/[^a-z0-9_-]/gi,'-').slice(0,100);
        const extension=image.contentType==='image/jpeg'?'jpg':image.contentType.split('/')[1];
        const filename=original.startsWith('assets/')?original.split('/').pop():'product-image.'+extension;
        const uploadPath='catalog-import/'+safeId+'/'+filename;
        const file=new Blob([image.bytes],{type:image.contentType});
        const {error}=await client.storage.from('product-images').upload(uploadPath,file,{upsert:true,contentType:image.contentType});
        if(error)throw new Error('بارگذاری تصویر محصول '+owner.product_number+' انجام نشد: '+error.message);
        const publicUrl=client.storage.from('product-images').getPublicUrl(uploadPath).data.publicUrl;
        if(!/^https:\/\//.test(publicUrl||''))throw new Error('پیوند عمومی تصویر محصول '+owner.product_number+' دریافت نشد.');
        rows.filter(row=>row.image_url===original).forEach(row=>row.image_url=publicUrl);
        imageIndex+=1;
        setMessage($("#products-message"),imageIndex.toLocaleString('fa-IR')+' از '+imageJobs.size.toLocaleString('fa-IR')+' تصویر بارگذاری شد…',true);
      }
      for(let start=0;start<rows.length;start+=100){
        attempted=true;const batch=rows.slice(start,start+100);
        const {data,error}=await client.from("products").upsert(batch,{onConflict:"id"}).select('id');
        if(error)throw error;
        const returned=new Set((data||[]).map(row=>String(row.id))),verified=batch.filter(row=>returned.has(row.id));imported+=verified.length;
        if(verified.length!==batch.length)throw new Error("تعداد ردیف‌های ثبت‌شده از سرور تأیید نشد؛ فهرست را تازه‌سازی کنید.");
        setMessage($("#products-message"),imported.toLocaleString('fa-IR')+" از "+rows.length.toLocaleString('fa-IR')+" محصول ثبت شد…",true);
      }
      await loadProducts();setMessage($("#products-message"),imported.toLocaleString('fa-IR')+" محصول و "+imageJobs.size.toLocaleString('fa-IR')+" تصویر با موفقیت وارد / به‌روزرسانی شد. برای انتشار، محصولات را انتخاب و گروهی تأیید کنید.",true);
    } catch(error){
      let reloadWarning='';
      if(attempted)try{await loadProducts();}catch{reloadWarning=' دریافت فهرست انجام نشد؛ تازه‌سازی را بزنید.';}
      setMessage($("#products-message"),(imported?imported.toLocaleString('fa-IR')+' محصول ثبت شد. ':'')+'واردسازی کامل نشد: '+error.message+reloadWarning);
    }
  });
}
$("#csv-import").addEventListener("change", async (event) => {
  const input=event.target,file=input.files?.[0];if(!file||productManager.busy)return;
  try {
    if(file.size>20*1024*1024)throw new Error("فایل CSV باید حداکثر ۲۰ مگابایت باشد.");
    await importProductRows(parseCsv(await file.text()));
  } catch(error){setMessage($("#products-message"),"واردسازی انجام نشد: "+error.message);}
  finally{input.value='';}
});
$("#product-archive-import").addEventListener("change", async (event) => {
  const input=event.target,file=input.files?.[0];if(!file||productManager.busy)return;
  try {
    const bundle=await readProductArchive(window.JSZip,file,parseCsv);
    await importProductRows(bundle.rows,bundle.images);
  } catch(error){setMessage($("#products-message"),"واردسازی ZIP انجام نشد: "+error.message);}
  finally{input.value='';}
});
$("#csv-template").addEventListener("click", () => exportProducts([],"farma-lab-kimia-template.csv"));
$("#csv-export").addEventListener("click", () => exportProducts());
