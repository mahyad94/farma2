import {applyTheme} from './theme-config.js?v=taxonomy-20261027-r1';
import {readList,brandDefaults,menuDefaults,defaultFaq} from './cms-schema.js?v=taxonomy-20261027-r1';
import {applyExperience} from './site-experience.js';
const values={};
window.FARMA_SITE_CONTENT=values;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function safeUrl(value){if(!String(value||'').trim())return '';try{const url=new URL(value,location.href);return ['https:','http:','mailto:','tel:'].includes(url.protocol)?url.href:'';}catch{return '';}}
function meta(name,value,property=false){if(!value)return;let el=document.head.querySelector('meta['+(property?'property':'name')+'="'+name+'"]');if(!el){el=document.createElement('meta');el.setAttribute(property?'property':'name',name);document.head.append(el);}el.content=value;}
function openAboutAndContactInNewTabs(){
 document.querySelectorAll('a[href]').forEach(link=>{
  const rawHref=link.getAttribute('href');
  if(rawHref?.startsWith('#')&&!['#about','#contact'].includes(rawHref))return;
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
function applyContent(){
 if(values.navigation_items!==undefined)readList(values.navigation_items,menuDefaults).forEach(item=>{values['nav_'+item.key]=item.label||'';});
 document.querySelectorAll('[data-site-content]').forEach(el=>{const value=values[el.dataset.siteContent];if(value!==undefined)el.textContent=value;});
 document.querySelectorAll('[data-site-placeholder]').forEach(el=>{const value=values[el.dataset.sitePlaceholder];if(value!==undefined)el.placeholder=value;});
 document.querySelectorAll('[data-site-link]').forEach(el=>{const value=values[el.dataset.siteLink];if(value!==undefined&&safeUrl(value))el.href=safeUrl(value);});
 const root=document.documentElement;
 applyTheme(values,root);
 if(values.theme_radius!==undefined&&Number(values.theme_radius)>=0&&Number(values.theme_radius)<=32)root.style.setProperty('--radius',Number(values.theme_radius)+'px');
 if(Number(values.theme_font_size)>=14&&Number(values.theme_font_size)<=20)document.body.style.fontSize=Number(values.theme_font_size)+'px';
 if(values.logo_url!==undefined)document.querySelectorAll('.brand-mark').forEach(mark=>{
  if(!mark.dataset.originalMark)mark.dataset.originalMark=mark.innerHTML;
  const url=safeUrl(values.logo_url);mark.innerHTML=url?'<img class="custom-site-logo" src="'+esc(url)+'" alt="'+esc(values.logo_alt||values.brand_name||'Farma Lab Kimia')+'" />':mark.dataset.originalMark;
  mark.classList.toggle('has-custom-logo',!!url);
 });
 document.querySelectorAll('.hero-visual').forEach(visual=>{
  if(!visual.dataset.originalVisual)visual.dataset.originalVisual=visual.innerHTML;
  const url=safeUrl(values.hero_image_url);visual.classList.toggle('has-custom-hero',!!url);
  visual.innerHTML=url?'<img class="custom-hero-image" src="'+esc(url)+'" alt="'+esc(values.hero_image_alt||'')+'" />':visual.dataset.originalVisual;
 });
 if(values.faq_items!==undefined)document.querySelectorAll('.faq-grid').forEach(list=>{
  list.innerHTML=readList(values.faq_items,defaultFaq(values)).map(item=>'<details class="faq-item"><summary><span dir="auto">'+esc(item.question)+'</span><span aria-hidden="true">＋</span></summary><div class="faq-answer"><p dir="auto">'+esc(item.answer)+'</p></div></details>').join('');
 });
 const brands=readList(values.brand_items,brandDefaults.map((b,i)=>({...b,caption:values[['brand_sigma_caption','brand_merck_caption','brand_supelco_caption','brand_millipore_caption'][i]]||b.caption})));
 document.querySelectorAll('.brand-tiles').forEach(list=>{list.innerHTML=brands.map(brand=>'<a class="brand-tile" id="'+esc(brand.id)+'" href="catalog.html?brand='+encodeURIComponent(brand.name)+'" aria-label="مشاهده محصولات '+esc(brand.name)+'">'+(safeUrl(brand.image)?'<img class="custom-brand-image" src="'+esc(safeUrl(brand.image))+'" alt="'+esc(brand.name)+'" loading="lazy" />':'<span class="brand-symbol">'+esc(brand.symbol||brand.name?.slice(0,1))+'</span>')+'<b dir="auto">'+esc(brand.name)+'</b><small dir="auto">'+esc(brand.caption)+'</small></a>').join('');});
 if(values.navigation_items!==undefined){
  const items=readList(values.navigation_items,menuDefaults).filter(item=>item.key!=='categories');
  document.querySelectorAll('[data-site-menu]').forEach(nav=>{
   const allowed=new Set(items.map(item=>'nav_'+item.key));
   nav.querySelectorAll(':scope > a,:scope > .nav-item').forEach(node=>{const link=node.matches('a')?node:node.querySelector('.nav-parent-link');if(link?.dataset.siteContent&&!allowed.has(link.dataset.siteContent))node.hidden=true;});
   items.forEach(item=>{
    let link=[...nav.querySelectorAll('a[data-site-content]')].find(el=>el.dataset.siteContent==='nav_'+item.key);
    if(!link){link=document.createElement('a');link.dataset.siteContent='nav_'+item.key;nav.append(link);}
    link.textContent=item.label||'';if(safeUrl(item.href))link.href=safeUrl(item.href);
    const node=link.closest('.nav-item')||link;node.hidden=item.visible===false;nav.append(node);
   });
  });
 }
 const main=document.querySelector('main');
 if(main&&values.section_order)readList(values.section_order,[]).forEach(key=>{const section=[...main.children].find(el=>el.dataset.siteSection===key);if(section)main.append(section);});
 document.querySelectorAll('[data-site-section]').forEach(el=>{el.hidden=values['section_'+el.dataset.siteSection+'_visible']==='false'||values['section_'+el.dataset.siteSection+'_removed']==='true';});
 const homepage=!document.body.classList.contains('catalog-page')&&!document.body.classList.contains('articles-page')&&!document.body.classList.contains('info-page');
 if(homepage){if(values.seo_title){document.title=values.seo_title;meta('og:title',values.seo_title,true);meta('twitter:title',values.seo_title);}if(values.seo_description){meta('description',values.seo_description);meta('og:description',values.seo_description,true);meta('twitter:description',values.seo_description);}}
 meta('og:site_name',values.brand_name,true);meta('og:image',safeUrl(values.social_image_url),true);meta('theme-color',values.theme_navy);
 if(document.body.classList.contains('articles-page')&&!new URLSearchParams(location.search).has('slug')){
  if(values.articles_title){document.title=values.articles_title+' | '+(values.brand_name||'Farma Lab Kimia');meta('og:title',document.title,true);}
  if(values.articles_description){meta('description',values.articles_description);meta('og:description',values.articles_description,true);}
 }
 document.querySelectorAll('[data-site-content]').forEach(el=>{const value=values[el.dataset.siteContent];if(value!==undefined)el.textContent=value;});
 applyExperience(values);
 window.FarmaTaxonomy?.configure(values.catalog_taxonomy_v1);
 openAboutAndContactInNewTabs();
 window.FarmaNavigation?.setSettings?.({brands});
 window.dispatchEvent(new CustomEvent('farma-settings-applied'));
}
window.farmaSiteContentReady=(async()=>{
 if(window.FarmaLocalLinkTest?.previewFromLocation()){applyContent();return values;}
 const client=await(window.farmaSupabaseReady||Promise.resolve(null));
 if(client){const {data,error}=await client.from('site_content').select('content_key,content_value');if(!error)for(const item of data||[])values[item.content_key]=item.content_value;}
 applyContent();return values;
})();
if(new URLSearchParams(location.search).get('cms-preview')==='1'&&window.parent!==window){
 window.addEventListener('message',async event=>{
  if(event.origin!==location.origin||event.source!==window.parent||event.data?.type!=='farma-cms-preview')return;
  await window.farmaSiteContentReady;const draft=event.data.values;if(!draft||typeof draft!=='object'||Array.isArray(draft))return;
  for(const [key,value] of Object.entries(draft))if(typeof value==='string')values[key]=value;
  applyContent();
 });
 window.farmaSiteContentReady.then(()=>window.parent.postMessage({type:'farma-cms-ready'},location.origin));
}
