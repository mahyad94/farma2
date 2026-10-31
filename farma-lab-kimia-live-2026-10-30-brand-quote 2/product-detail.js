import {applyTheme} from './theme-config.js?v=split-header-colors-20261023';
import {categoryDefaults,categoryKeys,brandDefaults,menuDefaults,readList} from './cms-schema.js?v=live-20261030';

import {applyExperience} from './site-experience.js';
const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
const productId = params.get("id") || "";
const adminPreview = params.get("preview") === "1";
const SEO_ORIGIN = window.FarmaSeo?.origin || "https://farma-lab-kimia-test.pages.dev/";
const quoteKey = "farma-lab-kimia-quote-v1";
const contact = {whatsapp:"",email:""};
let client = null;
let product = null;
let toastTimer;

function readQuote() {
  try { return new Map(JSON.parse(localStorage.getItem(quoteKey) || "[]")); }
  catch { return new Map(); }
}
function saveQuote(entries) {
  try { localStorage.setItem(quoteKey,JSON.stringify([...entries])); } catch {}
  $("#quote-count").textContent = String(entries.size);
}
function showQuoteToast(message) {
  const toast=$("#quote-toast"); toast.textContent=message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2300);
}
function quoteMessage(entries,note) {
  const oneLine=value=>String(value??"").replace(/\s+/g," ").trim();
  const items=[...entries.values()].map(({product:item,qty,packPreference})=>{
    const name=oneLine(item.nameFa ? `${item.nameFa} (${item.name})` : item.name);
    const number=oneLine(item.number),cas=oneLine(item.cas);
    const lines=[`• نام محصول: ${name}`];
    if(item.pubchem&&number&&number!=="—") lines.push(`شناسه پاب‌کم: ${number}`);
    else if(number&&!['Request by CAS','On request','—',name,cas].includes(number)) lines.push(`شماره کاتالوگ: ${number}`);
    if(cas&&cas!=="—") lines.push(`شماره کاس: ${cas}`);
    lines.push(`مقدار درخواستی: ${oneLine(qty)||"مشخص نشده"}`);
    if(oneLine(packPreference)) lines.push(`بسته‌بندی دلخواه: ${oneLine(packPreference)}`);
    if(item.sigmaUrl) lines.push(`پیوند بررسی محصول: ${item.sigmaUrl}`);
    return lines.join("\n");
  }).join("\n\n");
  const extra=note.trim()?`\n\nتوضیحات تکمیلی:\n${note.trim()}`:"";
  return `سلام، برای ${entries.size===1?"محصول زیر":"محصولات زیر"} درخواست استعلام قیمت و شرایط تأمین دارم:\n\n${items}${extra}\n\nاطلاعات درخواستی: قیمت، بسته‌بندی، امکان تأمین عمده یا نمونه و زمان تقریبی تحویل.`;
}
function updateQuoteLinks(entries=readQuote()) {
  const message=quoteMessage(entries,$("#quote-note").value);
  const whatsapp=contact.whatsapp.replace(/\D/g,"");
  const wa=$("#send-whatsapp"),email=$("#send-email");
  wa.href=whatsapp?`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`:"#";
  email.href=contact.email?`mailto:${contact.email}?subject=${encodeURIComponent("درخواست استعلام قیمت | Farma Lab Kimia")}&body=${encodeURIComponent(message)}`:"#";
  for(const [link,enabled] of [[wa,Boolean(whatsapp)],[email,Boolean(contact.email)]]) {
    link.dataset.placeholder=String(!enabled);
    link.setAttribute("aria-disabled",String(!enabled));
    link.classList.toggle("is-disabled",!enabled);
  }
}
function renderQuote() {
  const entries = readQuote();
  $("#quote-count").textContent = String(entries.size);
  $("#quote-empty").hidden=entries.size>0;
  $("#quote-send").hidden=entries.size===0;
  const list=$("#quote-items"); list.replaceChildren();
  let index=0;
  for (const {product:item,qty,packPreference} of entries.values()) {
    if (!item) continue;
    const row=document.createElement("div"); row.className="quote-item";
    const art=document.createElement("div"); art.className="quote-item-art";
    const image=safeProductImage(item.imageUrl);
    if(image) { const img=document.createElement("img"); img.src=image; img.alt=""; art.append(img); }
    else art.textContent="◈";
    const info=document.createElement("div"); info.className="quote-item-info";
    const name=document.createElement("b"); name.textContent=item.nameFa||item.name||"محصول"; name.dir="auto";
    const meta=document.createElement("small"); meta.className="quote-item-meta";
    const brand=document.createElement("span"); brand.dir="ltr"; brand.textContent=item.brand||""; meta.append(brand);
    for(const [label,value] of [[item.pubchem?"شناسه پاب‌کم":"شماره کاتالوگ",item.number],["شماره کاس",item.cas]]) {
      if(!value||["—","On request","Request by CAS"].includes(value)) continue;
      const line=document.createElement("span"),identifier=document.createElement("bdi"); identifier.dir="ltr"; identifier.textContent=value; line.append(document.createTextNode(label+" "),identifier); meta.append(line);
    }
    const source=safeUrl(item.sigmaUrl||item.sourceUrl);
    if(source) { const link=document.createElement("a"); link.href=source; link.target="_blank"; link.rel="noopener noreferrer"; link.textContent="مشاهده مرجع محصول ↗"; meta.append(link); }
    const inputs=document.createElement("div"); inputs.className="quote-inputs";
    for(const [labelText,value,key,placeholder] of [["مقدار موردنیاز",qty,"qtyInput","مثلاً ۵۰۰ گرم یا ۲ بسته"],["بسته‌بندی دلخواه (اختیاری)",packPreference,"packageInput","مثلاً بطری ۲۵۰ میلی‌لیتری"]]) {
      const label=document.createElement("label"); label.className="quote-quantity-label"; label.htmlFor=`quote-${key}-${index}`; label.textContent=labelText;
      const input=document.createElement("input"); input.type="text"; input.dir="auto"; input.value=value||""; input.id=label.htmlFor; input.placeholder=placeholder; input.dataset[key]=String(item.id);
      const field=document.createElement("div"); field.className="quote-field"; field.append(label,input); inputs.append(field);
    }
    const remove=document.createElement("button"); remove.type="button"; remove.className="remove-item"; remove.dataset.remove=String(item.id); remove.textContent="حذف"; remove.setAttribute("aria-label","حذف "+(item.nameFa||item.name||"محصول")+" از فهرست درخواست");
    info.append(name);
    if(item.nameFa && item.name) { const english=document.createElement("small"); english.className="quote-item-en"; english.lang="en"; english.dir="ltr"; english.textContent=item.name; info.append(english); }
    info.append(meta,inputs,remove); row.append(art,info); list.append(row); index++;
  }
  updateQuoteLinks(entries);
}
function toggleQuote(open) {
  $("#quote-overlay").hidden = !open;
  $("#quote-drawer").setAttribute("aria-hidden",String(!open));
  $("#quote-drawer").classList.toggle("open",open);
  $("#quote-open").setAttribute("aria-expanded",String(open));
  document.body.classList.toggle("quote-open",open);
  if (open) { toggleMenu(false); renderQuote(); }
}
function toggleMenu(open) {
  $("#nav").classList.toggle("nav-open",open);
  $("#menu-toggle").setAttribute("aria-expanded",String(open));
  $("#menu-toggle").setAttribute("aria-label",open ? "بستن منو" : "بازکردن منو");
  if(!open) window.FarmaNavigation?.closeAll();
}

function safeUrl(value) {
  try { const url = new URL(String(value || "")); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; }
  catch { return ""; }
}
function safeProductImage(value) {
  if (/^assets\/products\/[a-z0-9][\w-]*\.(?:png|jpe?g|webp|svg)$/i.test(String(value || ""))) {
    return new URL(value, location.href).href;
  }
  return safeUrl(value);
}
function setProductText(element, value) {
  const text = String(value || "");
  element.replaceChildren();
  // Determine paragraph direction from letters, not the leading digits in a chemical name.
  const rtl = /[\u0590-\u05ff\u0620-\u063f\u0641-\u064a\u066e-\u06d3\u06fa-\u06ff]/.test(text);
  element.dir = rtl ? "rtl" : "ltr";
  if (!rtl) { element.textContent = text; return; }
  const runs = /[\x20-\x7e\u00b0-\u00b5\u2013\u2014\u2070-\u209f]+/g;
  let start = 0;
  for (const match of text.matchAll(runs)) {
    if (!/[A-Za-z0-9]/.test(match[0])) continue;
    element.append(document.createTextNode(text.slice(start, match.index)));
    const leading = match[0].match(/^\s*/)[0], trailing = match[0].match(/\s*$/)[0];
    element.append(document.createTextNode(leading));
    const latin = document.createElement("bdi"); latin.dir = "ltr"; latin.className = "latin";
    latin.textContent = match[0].trim(); element.append(latin, document.createTextNode(trailing));
    start = match.index + match[0].length;
  }
  element.append(document.createTextNode(text.slice(start)));
}
function putText(selector, value) { setProductText($(selector), value); }
function showSection(selector, visible) { $(selector).hidden = !visible; }
function makePair(parent, cssClass, tag, label, value) {
  const row = document.createElement("div"); row.className = cssClass;
  const heading = document.createElement(tag); setProductText(heading, label);
  const body = document.createElement(tag === "dt" ? "dd" : "p"); setProductText(body, value);
  row.append(heading, body); parent.append(row);
}
function renderPairs(selector, items, cssClass) {
  const target = $(selector); target.replaceChildren();
  for (const item of Array.isArray(items) ? items : []) {
    if (!item || (!item.label && !item.value)) continue;
    makePair(target, cssClass, "dt", item.label, item.value);
  }
}
function renderSafety(items) {
  const target = $("#safety-list"); target.replaceChildren();
  for (const item of Array.isArray(items) ? items : []) {
    if (!item?.value) continue;
    makePair(target, "safety-item", "h3", item.label, item.value);
  }
}
function renderFacts(record) {
  const facts = [["شماره محصول",record.product_number],["شماره CAS",record.cas_number],["عیار",record.grade_purity]].filter(([,value]) => value);
  const target = $("#hero-facts"); target.replaceChildren();
  for (const [label,value] of facts) {
    const fact = document.createElement("div"); fact.className = "fact";
    const name = document.createElement("span"); name.textContent = label;
    const number = document.createElement("bdi"); number.className = "latin"; number.textContent = value;
    fact.append(name,number); target.append(fact);
  }
}
function renderProduct(record) {
  const detail = record.detail_json || {};
  const persianName = detail.name_fa || record.name_fa || "";
  const title = persianName || record.name_en;
  const alreadyRequested = readQuote().has(String(record.id));
  $("#request-button").textContent = alreadyRequested ? "حذف از فهرست درخواست −" : "افزودن به فهرست درخواست";
  $("#request-button").setAttribute("aria-pressed", String(alreadyRequested));
  const fullTitle = `${title}${persianName ? ` (${record.name_en})` : ""} | ${record.brand || "فارما لب کیمیا"} | فارما لب کیمیا`;
  const general = detail.general || record.description_fa || record.description_en || "";
  const description = String(general || `${title}؛ مشخصات محصول در فارما لب کیمیا.`).replace(/\s+/g," ").slice(0,200);
  const canonical = new URL(`product.html?id=${encodeURIComponent(record.id)}`, SEO_ORIGIN).href;
  document.title = fullTitle;
  document.querySelector('meta[name="description"]').content = description;
  for (const [key,value] of [["og:title",fullTitle],["og:description",description],["og:url",canonical]]) {
    let meta = document.querySelector(`meta[property="${key}"]`);
    if (!meta) { meta=document.createElement("meta"); meta.setAttribute("property",key); document.head.append(meta); }
    meta.content=value;
  }
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) { canonicalLink=document.createElement("link"); canonicalLink.rel="canonical"; document.head.append(canonicalLink); }
  canonicalLink.href=canonical;
  let robots = document.querySelector('meta[name="robots"]');
  if (!robots) { robots=document.createElement("meta"); robots.name="robots"; document.head.append(robots); }
  const publicDetail = !adminPreview && !record.link_preview && record.active === true && record.usage_permission_confirmed === true && detail.enabled === true;
  robots.content=publicDetail ? "index,follow" : "noindex,follow";
  const setMeta=(key,value,property=false)=>{
    let element=document.head.querySelector(`meta[${property?"property":"name"}="${key}"]`);
    if(!element) { element=document.createElement("meta"); element.setAttribute(property?"property":"name",key); document.head.append(element); }
    element.content=value;
  };
  for(const [key,value] of [["og:type","website"],["og:locale","fa_IR"],["og:site_name","Farma Lab Kimia"]]) setMeta(key,value,true);
  setMeta("twitter:card","summary"); setMeta("twitter:title",fullTitle); setMeta("twitter:description",description);
  const productImage=safeProductImage(record.image_url);
  if(productImage && record.image_type!=="illustrative_image") { setMeta("og:image",productImage,true); setMeta("twitter:image",productImage); }
  const putSchema=(id,value)=>{
    let element=document.getElementById(id);
    if(!element) { element=document.createElement("script"); element.id=id; element.type="application/ld+json"; document.head.append(element); }
    element.textContent=JSON.stringify(value);
  };
  document.getElementById("product-schema")?.remove();
  if(publicDetail) putSchema("product-schema",{"@context":"https://schema.org","@type":"Product",name:title,description,url:canonical,
    ...(persianName ? {alternateName:record.name_en} : {}),
    ...(record.brand ? {brand:{"@type":"Brand",name:record.brand}} : {}),
    ...(record.product_number && !["Request by CAS","On request","—"].includes(record.product_number) ? {sku:record.product_number,mpn:record.product_number} : {}),
    ...(productImage && record.image_type!=="illustrative_image" ? {image:[productImage]} : {}),
    ...(record.cas_number && record.cas_number!=="—" ? {identifier:{"@type":"PropertyValue",propertyID:"CAS Number",value:record.cas_number}} : {})});
  const categoryId = record.subcategory || record.group || record.category;
  const categoryPath = window.FarmaTaxonomy?.path(categoryId) || [];
  putSchema("breadcrumb-schema",{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[
    {"@type":"ListItem",position:1,name:"صفحه اصلی",item:SEO_ORIGIN},
    {"@type":"ListItem",position:2,name:"کاتالوگ محصولات",item:new URL("catalog.html",SEO_ORIGIN).href},
    ...categoryPath.map((node,index) => ({"@type":"ListItem",position:index+3,name:node.fa,item:new URL('catalog.html?category='+encodeURIComponent(window.FarmaTaxonomy.root(node.id))+(node.id===window.FarmaTaxonomy.root(node.id)?'':'&subcategory='+encodeURIComponent(node.id)),SEO_ORIGIN).href})),
    {"@type":"ListItem",position:categoryPath.length+3,name:title,item:canonical}
  ]});
  const crumbs = document.querySelector('.crumbs');
  crumbs.querySelectorAll('.crumb-category,.crumb-category-separator').forEach(node => node.remove());
  const path = categoryPath;
  const currentCrumb = $("#crumb-product");
  for (const node of path) {
    const link = document.createElement('a');
    const rootId = window.FarmaTaxonomy.root(node.id);
    const query = new URLSearchParams({category: rootId});
    if (node.id !== rootId) query.set('subcategory', node.id);
    link.href = 'catalog.html?' + query;
    link.textContent = node.fa;
    link.className = 'crumb-category';
    crumbs.insertBefore(link, currentCrumb);
    const separator = document.createElement('span');
    separator.className = 'crumb-category-separator';
    separator.setAttribute('aria-hidden', 'true');
    separator.textContent = '›';
    crumbs.insertBefore(separator, currentCrumb);
  }
  putText("#crumb-product",title); putText("#product-title",title);
  putText("#product-english",persianName ? record.name_en : "");
  $("#product-english").hidden = !persianName;
  putText("#product-kicker",`${record.brand || "Sigma-Aldrich"}${record.grade_purity ? ` · ${record.grade_purity}` : ""}`);
  $("#draft-badge").textContent = record.package_preview ? "پیش‌نمایش محصول · هنوز در کاتالوگ ثبت نشده" : record.link_preview ? "پیش‌نمایش اطلاعات کارت · مشخصات تأیید نشده" : "پیش‌نمایش مدیر · منتشر نشده";
  $("#draft-badge").hidden = !record.link_preview && Boolean(record.active && record.usage_permission_confirmed);
  $("#question-form").hidden = !(client && !record.link_preview && record.active && record.usage_permission_confirmed);
  const source = safeUrl(record.source_url);
  $("#source-link").href = source || "#"; $("#source-link").hidden = !source;
  $("#source-link").textContent = "مشاهده صفحه مرجع محصول ↗";
  const sdsLink = $("#sds-link");
  const sdsUrl = safeUrl(detail.sds_url);
  sdsLink.hidden = !sdsUrl;
  if (sdsUrl) sdsLink.href = sdsUrl;
  const image = safeProductImage(record.image_url);
  if (image) { const element = document.createElement("img"); element.src = image; element.alt = title; element.width=320; element.height=320; element.decoding="async"; $("#product-image").append(element); }
  const synonymBox = document.getElementById("product-synonyms");
  if (synonymBox) {
    synonymBox.replaceChildren();
    const names = Array.isArray(detail.synonyms) ? detail.synonyms.filter(x => typeof x === "string" && x.trim()) : [];
    synonymBox.hidden = !names.length;
    if (names.length) {
      synonymBox.append(document.createTextNode("نام‌های دیگر: "));
      names.forEach((name, index) => {
        if(index) synonymBox.append(document.createTextNode("؛ "));
        const text = document.createElement("span"); setProductText(text, name); synonymBox.append(text);
      });
    }
  }
  renderFacts(record);
  const formula = (detail.about || []).find((item) => /فرمول/.test(item.label || ""));
  if (formula?.value) { putText("#product-formula",`فرمول شیمیایی: ${formula.value}`); $("#product-formula").hidden = false; }
  const about = detail.about?.length ? detail.about : [["برند",record.brand],["دسته‌بندی",window.FarmaTaxonomy?.label(record.subcategory||record.category)||record.category],["شماره کاتالوگ",record.product_number],["شماره کاس",record.cas_number]].filter(([,value]) => value && value !== "—").map(([label,value]) => ({label,value}));
  renderPairs("#about-list",about,"about-item"); showSection("#about-section",Boolean(about.length));
  putText("#general-text",general); showSection("#general-section",Boolean(general));
  const applications = $("#applications-list"); applications.replaceChildren();
  for (const item of detail.applications || []) { const li = document.createElement("li"); setProductText(li, item); applications.append(li); }
  showSection("#applications-section",Boolean(detail.applications?.length));
  renderSafety(detail.safety); putText("#sds-note",detail.sds_note);
  showSection("#safety-section",Boolean(detail.safety?.length || detail.sds_note));
  const properties = detail.properties?.length ? detail.properties : [["فرمول مولکولی",record.molecular_formula],["جرم مولکولی",record.molecular_weight],["درجه خلوص",record.grade_purity],["بسته‌بندی",record.pack_size]].filter(([,value]) => value && value !== "—" && value !== "Not listed").map(([label,value]) => ({label,value}));
  renderPairs("#properties-list",properties,"property"); showSection("#properties-section",Boolean(properties.length));
  $("#page-status").hidden = true; $("#product-content").hidden = false;
}
function addToQuote() {
  if (!product) return;
  const entries = readQuote();
  if (entries.has(String(product.id))) {
    entries.delete(String(product.id)); saveQuote(entries); renderQuote();
    $("#request-button").textContent = "افزودن به فهرست درخواست";
    $("#request-button").setAttribute("aria-pressed", "false");
    return;
  }
  const previous=entries.get(String(product.id));
  entries.set(String(product.id), { product: {
    id:String(product.id), name:product.name_en, nameFa:product.detail_json?.name_fa || product.name_fa || "", brand:product.brand,
    number:product.product_number || "On request", cas:product.cas_number || "—",
    sourceUrl:product.source_url, imageUrl:product.image_url || "", imageType:product.image_type || "supplier_photo",
    category:product.category || "Chemicals", group:product.subcategory || product.category || "Chemicals",
    grade:product.grade_purity || "", pack:product.pack_size || "", art:"flask"
  }, qty:previous?.qty || "",packPreference:previous?.packPreference || "" });
  saveQuote(entries);
  renderQuote();
  $("#request-button").textContent = "حذف از فهرست درخواست −";
  $("#request-button").setAttribute("aria-pressed","true");
}
function renderQuestions(rows) {
  const box = $("#question-list"); box.replaceChildren();
  if (!rows.length) { const empty = document.createElement("p"); empty.className="question-empty"; empty.textContent="هنوز پرسشی ثبت نشده است."; box.append(empty); return; }
  for (const item of rows) {
    const block = document.createElement("div"); block.className="question-item";
    const question = document.createElement("strong"); question.textContent=item.question;
    const answer = document.createElement("p"); answer.textContent=item.answer || "";
    block.append(question,answer); box.append(block);
  }
}
async function loadQuestions() {
  const {data,error}=await client.from("product_questions").select("question,answer").eq("product_id",productId).eq("status","published").order("created_at",{ascending:false}).limit(20);
  if (!error) renderQuestions(data || []);
}
function parseCsv(text) {
  const rows=[]; let row=[], cell="", quoted=false;
  for (let i=0;i<text.length;i+=1) {
    const char=text[i];
    if (char==='"' && quoted && text[i+1]==='"') { cell+='"'; i+=1; }
    else if (char==='"') quoted=!quoted;
    else if (char===',' && !quoted) { row.push(cell); cell=""; }
    else if ((char==='\n' || char==='\r') && !quoted) {
      if (char==='\r' && text[i+1]==='\n') i+=1;
      row.push(cell); if (row.some(value=>value.trim())) rows.push(row);
      row=[]; cell="";
    } else cell+=char;
  }
  row.push(cell); if (row.some(value=>value.trim())) rows.push(row);
  const headers=(rows.shift() || []).map((value,index)=>(index ? value : value.replace(/^\uFEFF/,"")).trim());
  return rows.map(values=>Object.fromEntries(headers.map((key,index)=>[key,(values[index] || "").trim()])));
}
let catalogRowsPromise;
function loadCatalogRows() {
  if(!catalogRowsPromise) catalogRowsPromise=fetch("catalog.csv",{cache:"no-store"})
    .then(response=>response.ok ? response.text() : "")
    .then(parseCsv).catch(()=>[]);
  return catalogRowsPromise;
}
function openAboutAndContactInNewTabs(){
 document.querySelectorAll('a[href]').forEach(link=>{
  if(link.getAttribute('aria-disabled')==='true'||['footer-whatsapp','footer-email','send-whatsapp','send-email'].includes(link.id))return;
  const key=link.dataset.siteContent;
  let page=key==='nav_about'||key==='footer_about_link'?'about':key==='nav_contact'?'contact':'';
  if(!page){
   try{
    const url=new URL(link.getAttribute('href'),location.href);
    if(url.origin===location.origin&&url.pathname.slice(0,url.pathname.lastIndexOf('/')+1)===location.pathname.slice(0,location.pathname.lastIndexOf('/')+1)){
     if(['#about','#contact'].includes(url.hash))page=url.hash.slice(1);
     else if(/\/(about|contact)\.html$/.test(url.pathname))page=url.pathname.match(/\/(about|contact)\.html$/)[1];
    }
   }catch{}
  }
  if(page){link.href=page+'.html';link.target='_blank';link.rel='noopener noreferrer';}
 });
}
function syncProductNavigation(settings={}) {
  const nav=$("#nav");
  const items=readList(settings.navigation_items,menuDefaults).filter(item=>item.key!=='categories');
  const allowed=new Set(items.map(item=>"nav_"+item.key));
  nav.querySelectorAll(":scope > a,:scope > .nav-item").forEach(node=>{
    const link=node.matches("a") ? node : node.querySelector(".nav-parent-link");
    if(link?.dataset.siteContent && !allowed.has(link.dataset.siteContent)) node.hidden=true;
  });
  for(const item of items) {
    const link=[...nav.querySelectorAll("a[data-site-content]")].find(element=>element.dataset.siteContent==="nav_"+item.key);
    if(!link) continue;
    link.textContent=item.label||link.textContent;
    if(item.href) link.href=item.href.startsWith("#") ? "index.html"+item.href : item.href;
    const node=link.closest(".nav-item")||link;
    node.hidden=item.visible===false;
    nav.append(node);
  }
  openAboutAndContactInNewTabs();
  window.FarmaTaxonomy?.configure(settings.catalog_taxonomy_v1);
  const categories=window.FarmaTaxonomy ? window.FarmaTaxonomy.roots.map(node=>({name:String(node.id),fa:node.fa,en:node.name,note:node.name,icon:'◈'})) : readList(settings.catalog_categories,categoryDefaults)
    .filter(item=>item?.name&&item.visible!==false)
    .map(item=>{
      const key=categoryKeys[item.name];
      return {...item,fa:settings.catalog_categories===undefined&&key ? settings["category_"+key+"_name"]||item.fa : item.fa,
        note:settings.catalog_categories===undefined&&key ? settings["category_"+key+"_note"]||item.note : item.note};
    });
  window.FarmaNavigation?.setSettings({brands:readList(settings.brand_items,brandDefaults)});
  const fallbackGroups=window.FarmaTaxonomy ? {} : {Chemicals:["Acids","Biochemicals","Buffers & salts","Inorganic chemicals","Solvents","Source catalog listings"],Nanomaterials:["Nanoparticles and nanopowders"]};
  const fallbackProducts=Object.entries(fallbackGroups).flatMap(([category,groups])=>groups.map(group=>({category,group})));
  window.FarmaNavigation?.setCatalog(window.FarmaTaxonomy ? {categories} : {categories,products:fallbackProducts});
  loadCatalogRows().then(rows=>{
    if(!rows.length || window.FarmaNavigation?.catalogKnown) return;
    const products=rows.filter(row=>row.active==="YES"&&row.usage_permission_confirmed==="YES"&&row.category&&row.subcategory)
      .map(row=>({category:row.category,group:row.subcategory}));
    window.FarmaNavigation?.setCatalog({categories,products});
  });
}
async function loadLocalCatalogProduct(id) {
  try {
    const row=(await loadCatalogRows()).find(item=>item.id===id && item.active==="YES" && item.usage_permission_confirmed==="YES");
    return row ? {...row,active:true,usage_permission_confirmed:true,detail_json:null} : null;
  } catch { return null; }
}
function loadLinkedPreviewProduct(id) {
  const name=params.get("name")?.trim();
  if (!name) return null;
  const isPubchem=/^pubchem-sid-\d+$/.test(id);
  const sid=isPubchem ? id.slice("pubchem-sid-".length) : "";
  const cid=params.get("cid")?.trim() || "";
  return {id,name_en:name,name_fa:params.get("fa") || "",brand:params.get("brand") || "",product_number:params.get("number") || sid,cas_number:params.get("cas") || "",category:params.get("category") || "",grade_purity:"با مشاور فروش تأیید شود",description_fa:isPubchem ? "این رکورد از پایگاه PubChem نمایش داده شده است؛ هویت، درجه خلوص، بسته‌بندی و امکان تأمین پیش از سفارش تأیید می‌شود." : "مشخصات تکمیلی، موجودی، بسته‌بندی و شرایط تأمین این محصول پس از بررسی درخواست اعلام می‌شود.",source_url:isPubchem ? `https://pubchem.ncbi.nlm.nih.gov/substance/${sid}` : safeUrl(params.get("source")),image_url:isPubchem && /^\d+$/.test(cid)?`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=300x300`:"",active:true,usage_permission_confirmed:true,detail_json:null,link_preview:true};
}
function productUnavailable(message) {
  putText("#page-status",message);
  document.title="محصول در دسترس نیست | فارما لب کیمیا";
  let robots=document.head.querySelector('meta[name="robots"]');
  if(!robots) { robots=document.createElement("meta"); robots.name="robots"; document.head.append(robots); }
  robots.content="noindex,follow";
  document.getElementById("product-schema")?.remove();
}
async function initialize() {
  renderQuote();
  syncProductNavigation();
  if (!productId) { productUnavailable("شناسهٔ محصول در پیوند مشخص نشده است."); return; }
  applyTheme({});
  applyExperience({});
  let filePreview = null;
  try { filePreview = await window.FarmaProductPackages?.previewFile(productId); }
  catch { productUnavailable("فایل پیش‌نمایش محصول در دسترس نیست یا با این محصول مطابقت ندارد."); return; }
  const localOnlyPreview = filePreview || window.FarmaProductPackages?.preview(productId) || window.FarmaLocalLinkTest?.previewFromLocation(productId) || null;
  const importedProduct = window.FarmaProductPackages?.find(productId) || null;
  client = localOnlyPreview ? null : await (window.farmaSupabaseReady || Promise.resolve(null));
  if (client) {
    try {
      const {data,error}=await client.from("site_content").select("content_key,content_value");
      if (error) throw error;
      const settings=Object.fromEntries((data||[]).map(row=>[row.content_key,row.content_value]));
      applyTheme(settings);
      syncProductNavigation(settings);
      document.querySelectorAll("[data-site-content]").forEach(element => {
        const value=settings[element.dataset.siteContent];
        if(value!==undefined) element.textContent=value;
      });
      document.querySelectorAll("[data-site-placeholder]").forEach(element => {
        const value=settings[element.dataset.sitePlaceholder];
        if(value!==undefined) element.placeholder=value;
      });
      const logo=safeUrl(settings.logo_url);
      if(logo) {
        const image=document.createElement("img"); image.src=logo; image.alt="";
        const mark=$(".site-header .brand-mark");
        mark.replaceChildren(image); mark.classList.add("has-custom-logo");
      }
      contact.whatsapp=settings.contact_whatsapp||"";
      contact.email=settings.contact_email||"";
      applyExperience(settings);
      updateQuoteLinks();
    } catch { /* Keep the shared default palette when settings are unavailable. */ }
  }
  if (adminPreview) {
    if (!client) { putText("#page-status","دریافت پیش‌نمایش محصول ممکن نیست."); return; }
    const {data:{session}}=await client.auth.getSession();
    if (!session) { putText("#page-status","برای پیش‌نمایش محصول منتشرنشده، ابتدا وارد پنل مدیریت شوید."); return; }
    const {data:admin}=await client.from("admin_users").select("user_id").eq("user_id",session.user.id).maybeSingle();
    if (!admin) { putText("#page-status","این حساب دسترسی پیش‌نمایش ندارد."); return; }
  }
  let data=localOnlyPreview || importedProduct;
  if (client && !data) {
    try {
      const query=client.from("products").select("*").eq("id",productId);
      if (!adminPreview) query.eq("active",true).eq("usage_permission_confirmed",true);
      const result=await query.maybeSingle();
      if (!result.error) data=result.data;
    } catch { /* The local catalog remains available when the remote service cannot be reached. */ }
  }
  if (!data && !adminPreview) data=await loadLocalCatalogProduct(productId);
  if (!data && !adminPreview) data=loadLinkedPreviewProduct(productId);
  if (!data) { productUnavailable("این محصول در کاتالوگ فعال پیدا نشد."); return; }
  product=data; renderProduct(data);
  if (client && !data.link_preview && data.active && data.usage_permission_confirmed) await loadQuestions();
}
$("#request-button").addEventListener("click",addToQuote);
$("#quote-open").addEventListener("click",() => toggleQuote($("#quote-drawer").getAttribute("aria-hidden") === "true"));
$("#quote-close").addEventListener("click",() => toggleQuote(false));
$("#quote-overlay").addEventListener("click",() => toggleQuote(false));
$("#quote-note").addEventListener("input",() => updateQuoteLinks());
$("#quote-items").addEventListener("input",event=>{
  const field=event.target.closest("[data-qty-input],[data-package-input]");
  if(!field) return;
  const key=field.dataset.qtyInput||field.dataset.packageInput;
  const entries=readQuote(),entry=entries.get(key);
  if(!entry) return;
  if(field.dataset.qtyInput) entry.qty=field.value.trim();
  else entry.packPreference=field.value.trim();
  saveQuote(entries); updateQuoteLinks(entries);
});
$("#quote-items").addEventListener("click",event=>{
  const remove=event.target.closest("[data-remove]");
  if(!remove) return;
  const entries=readQuote(); entries.delete(remove.dataset.remove); saveQuote(entries); renderQuote();
  if(product && String(product.id)===remove.dataset.remove) { $("#request-button").textContent="افزودن به فهرست درخواست"; $("#request-button").setAttribute("aria-pressed","false"); }
});
for(const [selector,message] of [["#send-whatsapp","اطلاعات واتساپ هنوز در سایت ثبت نشده است"],["#send-email","نشانی ایمیل هنوز در سایت ثبت نشده است"]]) {
  $(selector).addEventListener("click",event=>{ if(event.currentTarget.dataset.placeholder==="true") { event.preventDefault(); showQuoteToast(message); } });
}
$("#copy-request").addEventListener("click",async()=>{
  const copied=await window.FarmaQuoteWorkspace.copyText(quoteMessage(readQuote(),$("#quote-note").value));
  showQuoteToast(copied ? "متن درخواست کپی شد" : "متن آماده است؛ آن را از کادر درخواست کپی کنید");
});
$("#menu-toggle").addEventListener("click",() => toggleMenu(!$("#nav").classList.contains("nav-open")));
$("#nav").addEventListener("click",(event) => { if (event.target.closest("a")) toggleMenu(false); });
document.addEventListener("keydown",(event) => { if (event.key === "Escape") { toggleQuote(false); toggleMenu(false); } });
window.addEventListener("storage",(event) => { if (event.key === quoteKey) renderQuote(); });
$("#question-form").addEventListener("submit",async (event)=>{
  event.preventDefault(); if (!product || !client) return;
  const input=$("#question-input"),question=input.value.trim(); if(question.length<10) return;
  const button=event.currentTarget.querySelector("button"); button.disabled=true;
  const {error}=await client.from("product_questions").insert({product_id:productId,question});
  putText("#question-message",error ? "ثبت پرسش ممکن نشد؛ لطفاً دوباره تلاش کنید." : "پرسش ثبت شد و پس از بررسی نمایش داده می‌شود.");
  if (!error) input.value=""; button.disabled=false;
});
initialize();
