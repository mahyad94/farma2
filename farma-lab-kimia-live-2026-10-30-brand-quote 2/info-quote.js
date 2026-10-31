// The request list stays on the current information page and shares the catalog's storage.
(() => {
const $=selector=>document.querySelector(selector);
const quoteKey='farma-lab-kimia-quote-v1';
const contact={whatsapp:'',email:''};let toastTimer;
let locked=false,scrollY=0,bodyStyle;
function lockBackground(open) {
  if(open&&!locked){
    scrollY=window.scrollY;bodyStyle={position:document.body.style.position,top:document.body.style.top,width:document.body.style.width};
    Object.assign(document.body.style,{position:'fixed',top:-scrollY+'px',width:'100%'});locked=true;
  }else if(!open&&locked){Object.assign(document.body.style,bodyStyle);locked=false;window.scrollTo({top:scrollY,behavior:'instant'});}
}
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
  document.body.classList.toggle("drawer-open",open);
  if (open) { document.querySelector("#nav").classList.remove("nav-open"); document.querySelector("#menu-toggle").setAttribute("aria-expanded","false"); window.FarmaNavigation?.closeAll(); renderQuote(); }
  lockBackground(open);
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
});
for(const [selector,message] of [["#send-whatsapp","اطلاعات واتساپ هنوز در سایت ثبت نشده است"],["#send-email","نشانی ایمیل هنوز در سایت ثبت نشده است"]]) {
  $(selector).addEventListener("click",event=>{ if(event.currentTarget.dataset.placeholder==="true") { event.preventDefault(); showQuoteToast(message); } });
}
$("#copy-request").addEventListener("click",async()=>{
  const copied=await window.FarmaQuoteWorkspace.copyText(quoteMessage(readQuote(),$("#quote-note").value));
  showQuoteToast(copied ? "متن درخواست کپی شد" : "متن آماده است؛ آن را از کادر درخواست کپی کنید");
});

document.addEventListener('click',event=>{
  const trigger=event.target.closest('#quote-open,a[href*="quote=1"]');
  if(!trigger)return;event.preventDefault();toggleQuote(true);
});
$('#browse-products').addEventListener('click',()=>{location.href='catalog.html';});
document.addEventListener('keydown',event=>{if(event.key==='Escape')toggleQuote(false);});
window.addEventListener('storage',event=>{if(event.key===quoteKey)renderQuote();});
function settings(){const values=window.FARMA_SITE_CONTENT||{};contact.whatsapp=values.contact_whatsapp||'';contact.email=values.contact_email||'';updateQuoteLinks();}
window.addEventListener('farma-settings-applied',settings);
renderQuote();settings();
})();
