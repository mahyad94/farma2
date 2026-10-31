import {renderThemeEditor,validateThemeEditor,setupThemeEditor} from './admin-theme.js?v=taxonomy-20261027-r1';
import {contentGroups,editableSections,categoryDefaults,categoryKeys,brandDefaults,menuDefaults,readList,defaultFaq} from './cms-schema.js?v=taxonomy-20261027-r1';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const defaultOrder=['hero','categories','catalog','brands','faq','selection-guide','about'];
const listSpecs={
  brand_items:{group:'brands',title:'کارت‌های برند',add:'افزودن برند',fields:[['name','نام برند'],['caption','توضیح کوتاه'],['symbol','نماد حرفی'],['image','تصویر برند','image']]},
  faq_items:{group:'faq',title:'پرسش و پاسخ‌ها',add:'افزودن پرسش',fields:[['question','پرسش','textarea'],['answer','پاسخ','textarea']]},
  navigation_items:{group:'menu',title:'پیوندهای منوی اصلی',add:'افزودن پیوند',fields:[['label','عنوان'],['href','مقصد پیوند','link'],['visible','نمایش در منو','checkbox']]}
};

export function createSiteEditor(client,{onSettingsChange=()=>{}}={}) {
  const $=selector=>document.querySelector(selector);
  let saved={},lists={},initial={},active='home',dirty=false,uploadTarget=null;
  const groups=structuredClone(contentGroups.filter(group=>group.id!=='categories'));
  // Repeating content has a dedicated editor; legacy keys remain readable on the site.
  groups.find(g=>g.id==='identity').fields=groups.find(g=>g.id==='identity').fields.filter(f=>!f[0].startsWith('nav_'));
  groups.find(g=>g.id==='brands').fields=groups.find(g=>g.id==='brands').fields.filter(f=>!/^brand_.*_caption$/.test(f[0]));
  groups.find(g=>g.id==='faq').fields=groups.find(g=>g.id==='faq').fields.filter(f=>!/^faq_\d/.test(f[0]));
  function message(text,ok=false){const el=$('#content-message');el.textContent=text;el.classList.toggle('is-success',ok);}
  function field([key,label,fallback,rows=1,spec={}],value,extra='') {
    const id='setting-'+key;
    const attrs=`id="${esc(id)}" ${extra} ${spec.type==='readonly'?'readonly':''}`;
    let control;
    if(spec.type==='checkbox') control=`<input type="checkbox" ${attrs} ${value!==false&&value!=='false'?'checked':''} />`;
    else if(spec.type==='select') control=`<select ${attrs}>${spec.options.map(([v,l])=>`<option value="${esc(v)}" ${String(value)===v?'selected':''}>${esc(l)}</option>`).join('')}</select>`;
    else if(rows>1||spec.type==='textarea') control=`<textarea ${attrs} rows="${rows>1?rows:3}" dir="auto">${esc(value)}</textarea>`;
    else control=`<input ${attrs} type="${['number','color'].includes(spec.type)?spec.type:'text'}" value="${esc(value)}" ${spec.min!==undefined?`min="${spec.min}" max="${spec.max}"`:''} ${['image','link','readonly'].includes(spec.type)?'dir="ltr"':''} />`;
    if(spec.type==='image') control=`<div class="editor-image-control">${control}<button type="button" class="secondary-button" data-upload-target="${esc(id)}">بارگذاری تصویر</button></div><img class="editor-image-preview" src="${esc(imageUrl(value))}" alt="پیش‌نمایش تصویر" ${imageUrl(value)?'':'hidden'} />`;
    return `<label class="content-control" data-setting-label="${esc(label)}"><span>${esc(label)}</span>${control}${spec.type==='link'?'<small class="field-help">نشانی کامل https یا پیوند داخلی مثل catalog.html</small>':''}</label>`;
  }
  function imageUrl(value){try{const u=new URL(value,location.href);return value&&['http:','https:'].includes(u.protocol)?u.href:'';}catch{return '';}}
  function makeLists(){
    lists.brand_items=readList(saved.brand_items,brandDefaults.map((b,i)=>({...b,caption:saved[['brand_sigma_caption','brand_merck_caption','brand_supelco_caption','brand_millipore_caption'][i]]||b.caption})));
    lists.faq_items=readList(saved.faq_items,defaultFaq(saved));
    lists.navigation_items=readList(saved.navigation_items,menuDefaults.map(item=>({...item,label:saved['nav_'+item.key]||item.label})));
  }
  function collect(){
    const values={};
    $('#content-form').querySelectorAll('[data-content-key]').forEach(el=>{values[el.dataset.contentKey]=el.type==='checkbox'?String(el.checked):el.value.trim();});
    for(const [key,list] of Object.entries(lists)) values[key]=JSON.stringify(list);
    values.section_order=JSON.stringify([...$('#section-order-list').querySelectorAll('[data-section-key]')].map(el=>el.dataset.sectionKey).filter(key=>defaultOrder.includes(key)));
    return values;
  }
  function markChanged(){
    const current=collect();dirty=Object.keys(current).some(k=>current[k]!==initial[k]);
    $('#content-save-status').textContent=dirty?'تغییرات ذخیره‌نشده دارید':'همه تغییرات ذخیره شده است';
    $('#content-save-status').classList.toggle('is-dirty',dirty);
    $('#save-content').disabled=!dirty;
    $('#discard-content').disabled=!dirty;
    groups.forEach(group=>{
      const section=$('#editor-group-'+group.id);
      const keys=[...section.querySelectorAll('[data-content-key]')].map(el=>el.dataset.contentKey);
      Object.entries(listSpecs).forEach(([key,spec])=>{if(spec.group===group.id)keys.push(key);});
      if(group.id==='sections')keys.push('section_order');
      $(`[data-edit-section="${group.id}"]`)?.classList.toggle('is-modified',keys.some(k=>current[k]!==initial[k]));
    });
  }
  function renderList(key){
    const spec=listSpecs[key];
    $('#repeater-'+key).innerHTML=lists[key].map((item,index)=>`<article class="repeater-item" data-list-key="${key}" data-list-index="${index}"><div class="repeater-item-head"><b>${esc(item.name||item.question||item.label||'مورد '+(index+1))}</b><button type="button" data-list-up ${index===0?'disabled':''} aria-label="انتقال به بالا">↑</button><button type="button" data-list-down ${index===lists[key].length-1?'disabled':''} aria-label="انتقال به پایین">↓</button><button type="button" data-list-remove>حذف</button></div><div class="content-group-grid">${spec.fields.map(([prop,label,type])=>field([key+'-'+index+'-'+prop,label,'',1,{type}],item[prop]??(type==='checkbox'?true:''),`data-list-prop="${prop}"`)).join('')}</div>${key==='catalog_categories'?'<small>شناسه ثابت برای اتصال محصولات است. حذف دسته، محصولات آن را حذف نمی‌کند.</small>':''}</article>`).join('')||'<p class="editor-help-note">موردی ثبت نشده است. از دکمه افزودن استفاده کنید.</p>';
  }
  function renderSections(){
    const order=readList(saved.section_order,defaultOrder);
    const ordered=[...new Set(['topline','navigation',...order,...defaultOrder,'contact'])].filter(k=>editableSections.some(([id])=>id===k));
    return `<div class="editor-help-note">نمایش هر بخش را کنترل کنید. با فلش‌ها ترتیب بخش‌های صفحه اصلی را تغییر دهید. برداشتن بخش، متن‌های آن را پاک نمی‌کند.</div><div id="section-order-list" class="section-order-list">${ordered.map(key=>{
      const label=editableSections.find(([id])=>id===key)[1],removed=saved['section_'+key+'_removed']==='true';
      return `<div class="section-order-row ${removed?'is-removed':''}" data-section-key="${key}"><label><input type="checkbox" data-content-key="section_${key}_visible" ${saved['section_'+key+'_visible']==='false'?'':'checked'} /><span>${label}<small class="section-removed-label">${removed?'از سایت برداشته شده':'نمایش در سایت'}</small></span></label><input type="hidden" data-content-key="section_${key}_removed" value="${removed}" /><div class="section-order-actions">${defaultOrder.includes(key)?'<button type="button" data-section-up aria-label="انتقال بخش به بالا">↑</button><button type="button" data-section-down aria-label="انتقال بخش به پایین">↓</button>':''}<button type="button" data-remove-section="${key}">${removed?'بازگردانی':'برداشتن بخش'}</button></div></div>`;
    }).join('')}</div>`;
  }
  function render(){
    makeLists();
    $('#content-section-nav').innerHTML=groups.map(group=>`<button type="button" class="editor-section-link" data-edit-section="${group.id}"><span>${group.title}</span><small>←</small></button>`).join('');
    $('#content-fields').innerHTML=groups.map(group=>`<section class="editor-section-card" id="editor-group-${group.id}" hidden><div class="editor-section-heading"><div><h3>${group.title}</h3><p>${group.description}</p></div><a href="${group.preview}" target="_blank" rel="noopener">مشاهده در سایت ↗</a></div><div class="content-group-grid">${group.id==='appearance'?renderThemeEditor(saved,group.fields,field):group.fields.map(f=>field(f,saved[f[0]]??f[2],`data-content-key="${f[0]}"`)).join('')}</div>${Object.entries(listSpecs).filter(([,spec])=>spec.group===group.id).map(([key,spec])=>`<div class="repeater-heading"><b>${spec.title}</b><button type="button" class="secondary-button" data-list-add="${key}">${spec.add} ＋</button></div><div class="editor-repeaters" id="repeater-${key}"></div>`).join('')}${group.id==='sections'?renderSections():''}<div class="editor-group-actions"><button type="button" class="text-button" data-reset-group="${group.id}">بازگشت این بخش به مقادیر پیش‌فرض</button></div></section>`).join('');
    Object.keys(listSpecs).forEach(renderList);
    initial=collect();dirty=false;selectGroup(active);markChanged();
    onSettingsChange();
  }
  function selectGroup(id){
    if(!groups.some(g=>g.id===id))return;active=id;
    if(!$('#editor-group-'+id))return;
    groups.forEach(group=>{
      $('#editor-group-'+group.id).hidden=group.id!==id;
      const b=$(`[data-edit-section="${group.id}"]`);b.classList.toggle('is-active',group.id===id);b.setAttribute('aria-current',group.id===id?'true':'false');
    });
    message('');
  }
  async function load(){
    const {data,error}=await client.from('site_content').select('content_key,content_value');
    if(error){message('دریافت تنظیمات انجام نشد: '+error.message);return;}
    saved=Object.fromEntries((data||[]).map(r=>[r.content_key,r.content_value]));render();
  }
  function validate(){
    validateThemeEditor($('#content-form'),selectGroup);
    for(const el of $('#content-form').querySelectorAll('[data-content-key]')) {
      const key=el.dataset.contentKey,value=el.value.trim();
      if((key.endsWith('_url')||key.endsWith('_href'))&&value&&!imageUrl(value))throw new Error('نشانی پیوند یا تصویر معتبر نیست.');
      if(el.type==='number'&&(!value||!el.checkValidity()))throw new Error('مقدار عددی را در محدوده مشخص‌شده وارد کنید.');
      if(key==='contact_email'&&value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))throw new Error('نشانی ایمیل معتبر وارد کنید.');
      if(key==='contact_whatsapp'&&value&&!/^\+?[\d\s()-]{7,20}$/.test(value))throw new Error('شماره واتساپ را با کد کشور وارد کنید.');
    }
    for(const [key,items] of Object.entries(lists))for(const item of items){
      if(key==='catalog_categories'&&(!item.fa?.trim()||!item.name?.trim()))throw new Error('نام دسته را کامل کنید.');
      if(key==='brand_items'&&!item.name?.trim())throw new Error('نام برند را کامل کنید.');
      if(key==='faq_items'&&(!item.question?.trim()||!item.answer?.trim()))throw new Error('متن پرسش و پاسخ را کامل کنید.');
      if(key==='navigation_items'&&(!item.label?.trim()||!imageUrl(item.href)))throw new Error('عنوان و مقصد پیوند منو را کامل کنید.');
      if(item.image&&!imageUrl(item.image))throw new Error('نشانی تصویر برند معتبر نیست.');
    }
  }
  $('#content-form').addEventListener('input',event=>{
    const row=event.target.closest('[data-list-key]');
    if(row&&event.target.dataset.listProp)lists[row.dataset.listKey][Number(row.dataset.listIndex)][event.target.dataset.listProp]=event.target.type==='checkbox'?event.target.checked:event.target.value;
    const preview=event.target.closest('.content-control')?.querySelector('.editor-image-preview');
    if(preview){const url=imageUrl(event.target.value);preview.src=url;preview.hidden=!url;}
    markChanged();
  });
  $('#content-form').addEventListener('change',markChanged);
  $('#content-form').addEventListener('click',event=>{
    const sectionButton=event.target.closest('[data-edit-section]');if(sectionButton){selectGroup(sectionButton.dataset.editSection);return;}
    const upload=event.target.closest('[data-upload-target]');if(upload){uploadTarget=upload.dataset.uploadTarget;$('#content-image-upload').click();return;}
    const add=event.target.closest('[data-list-add]');
    if(add){const key=add.dataset.listAdd;lists[key].push(key==='catalog_categories'?{name:'Category-'+crypto.randomUUID().slice(0,8),fa:'دسته جدید',note:'',icon:'◈',description:'',visible:true}:key==='brand_items'?{id:'brand-'+crypto.randomUUID().slice(0,8),name:'برند جدید',caption:'',symbol:'',image:''}:key==='faq_items'?{question:'',answer:''}:{key:'custom-'+crypto.randomUUID().slice(0,8),label:'پیوند جدید',href:'index.html',visible:true});renderList(key);markChanged();return;}
    const row=event.target.closest('[data-list-key]');
    if(row){const key=row.dataset.listKey,index=Number(row.dataset.listIndex),items=lists[key];
      if(event.target.closest('[data-list-remove]')){items.splice(index,1);renderList(key);markChanged();}
      const shift=event.target.closest('[data-list-up]')?-1:event.target.closest('[data-list-down]')?1:0;
      if(shift&&items[index+shift]){[items[index],items[index+shift]]=[items[index+shift],items[index]];renderList(key);markChanged();}
    }
    const section=event.target.closest('[data-section-key]');
    if(section){
      const remove=event.target.closest('[data-remove-section]');
      if(remove){const input=section.querySelector('input[type=hidden]');input.value=String(input.value!=='true');section.classList.toggle('is-removed',input.value==='true');remove.textContent=input.value==='true'?'بازگردانی':'برداشتن بخش';section.querySelector('.section-removed-label').textContent=input.value==='true'?'از سایت برداشته شده':'نمایش در سایت';markChanged();}
      const up=event.target.closest('[data-section-up]'),down=event.target.closest('[data-section-down]');
      if(up&&defaultOrder.includes(section.previousElementSibling?.dataset.sectionKey)){section.previousElementSibling.before(section);markChanged();}
      if(down&&defaultOrder.includes(section.nextElementSibling?.dataset.sectionKey)){section.nextElementSibling.after(section);markChanged();}
    }
    const reset=event.target.closest('[data-reset-group]');
    if(reset&&confirm('مقادیر این بخش به پیش‌فرض بازگردد؟ تا پیش از ذخیره می‌توانید تغییرات را لغو کنید.')){
      const group=groups.find(g=>g.id===reset.dataset.resetGroup);
      group.fields.forEach(f=>{const el=$(`[data-content-key="${f[0]}"]`);if(el.type==='checkbox')el.checked=f[2]!==false&&f[2]!=='false';else el.value=f[2];});
      const key=Object.keys(listSpecs).find(k=>listSpecs[k].group===group.id);
      if(key){lists[key]=key==='catalog_categories'?structuredClone(categoryDefaults).map(c=>({...c,visible:true})):key==='brand_items'?structuredClone(brandDefaults):key==='faq_items'?defaultFaq():structuredClone(menuDefaults);renderList(key);}
      if(group.id==='sections'){
        defaultOrder.forEach(key=>{const row=document.querySelector('[data-section-key="'+key+'"]');document.getElementById('section-order-list').insertBefore(row,document.querySelector('[data-section-key="contact"]'));});
        document.querySelectorAll('#section-order-list [data-content-key]').forEach(el=>{if(el.type==='checkbox')el.checked=true;else el.value='false';});
        document.querySelectorAll('.section-order-row').forEach(row=>{row.classList.remove('is-removed');row.querySelector('.section-removed-label').textContent='نمایش در سایت';row.querySelector('[data-remove-section]').textContent='برداشتن بخش';});
      }
      markChanged();
    }
  });
  $('#content-search').addEventListener('input',event=>{
    const q=event.target.value.trim().toLowerCase();
    const found=groups.filter(g=>[g.title,g.description,...g.fields.map(f=>f[1])].join(' ').toLowerCase().includes(q));
    groups.forEach(g=>{$(`[data-edit-section="${g.id}"]`).hidden=!found.includes(g);});
    if(found.length&&!found.some(g=>g.id===active))selectGroup(found[0].id);
  });
  $('#discard-content').addEventListener('click',()=>{if(confirm('تغییرات ذخیره‌نشده کنار گذاشته شود؟'))render();});
  $('#content-form').addEventListener('submit',async event=>{
    event.preventDefault();
    try{validate();}catch(error){message(error.message);return;}
    const values=collect(),changes=Object.entries(values).filter(([key,value])=>initial[key]!==value);
    if(!changes.length){message('تغییری برای ذخیره وجود ندارد.',true);return;}
    $('#save-content').disabled=true;message('در حال ذخیره…',true);
    try{
      const {error}=await client.from('site_content').upsert(changes.map(([content_key,content_value])=>({content_key,content_value,updated_at:new Date().toISOString()})),{onConflict:'content_key'});
      if(error)throw error;
      saved={...saved,...values};initial=values;markChanged();onSettingsChange();message('تغییرات ذخیره شد و با باز کردن دوباره سایت نمایش داده می‌شود.',true);
    }catch(error){message('ذخیره انجام نشد: '+error.message);markChanged();}
  });
  $('#content-image-upload').addEventListener('change',async event=>{
    const file=event.target.files?.[0];if(!file||!uploadTarget)return;
    if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>5242880){message('تصویر JPG، PNG یا WebP تا ۵ مگابایت انتخاب کنید.');return;}
    message('در حال بارگذاری تصویر…',true);
    const path='site-'+Date.now()+'-'+crypto.randomUUID()+'.'+({ 'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[file.type]);
    try{
      const {error}=await client.storage.from('site-media').upload(path,file,{contentType:file.type});if(error)throw error;
      const input=document.getElementById(uploadTarget);input.value=client.storage.from('site-media').getPublicUrl(path).data.publicUrl;input.dispatchEvent(new Event('input',{bubbles:true}));message('تصویر آماده است. برای انتشار، تنظیمات سایت را ذخیره کنید.',true);
    }catch(error){message('بارگذاری انجام نشد: '+error.message);}
    event.target.value='';
  });
  function sendPreview(){const frame=$('#site-preview-frame');frame.contentWindow?.postMessage({type:'farma-cms-preview',values:{...saved,...collect()}},location.origin);}
  $('#preview-content').addEventListener('click',()=>{
    const group=groups.find(g=>g.id===active);const url=new URL(group.preview,location.href);url.searchParams.set('cms-preview','1');
    $('#site-preview-frame').src=url.href;$('#site-preview-dialog').showModal();
  });
  window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===$('#site-preview-frame').contentWindow&&event.data?.type==='farma-cms-ready')sendPreview();});
  $('#close-preview').addEventListener('click',()=>$('#site-preview-dialog').close());
  document.querySelectorAll('[data-preview-width]').forEach(button=>button.addEventListener('click',()=>{$('#site-preview-frame').style.width=button.dataset.previewWidth;}));
  window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
  setupThemeEditor($('#content-form'),{onChange:markChanged,message});
  return {load,selectGroup,get categories(){return lists.catalog_categories;},get values(){return saved;},get dirty(){return dirty;}};
}
