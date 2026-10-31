import {changeProductBatch} from './admin-product-batch.js?v=bulk-images-20261028';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const canonicalBrand=value=>/^sigma(?:[\s-]*aldrich)?$/i.test(value||'')?'Sigma-Aldrich':String(value||'').trim();
const archivedSources=new Set(['Daya Exir','Mina Tajhiz']);

export function publicationProblems(items){
  return items.filter(item=>archivedSources.has(item.source_name) ||
    /^Pending review · Sigma-Aldrich /.test(item.name_en||'') ||
    String(item.id).startsWith('sigma-link-') && !item.detail_json?.enabled ||
    item.detail_json?.enabled && !String(item.detail_json.name_fa||'').trim() ||
    /^assets\/products\//i.test(item.image_url||''));
}

export function createProductManager({client,getProducts,getCategories,onReload,onExport}){
  const $=selector=>document.querySelector(selector);
  let page=1,status='visible',selected=new Set(),visibleRows=[],filtered=[],busy=false,deletePlan=[];
  const searchText=value=>String(value||'').toLowerCase().replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[\u200c\s]+/g,' ').trim();
  const fa=n=>n.toLocaleString('fa-IR');
  const categoryLabel=id=>window.FarmaTaxonomy?.find(id)?.fa||getCategories().find(c=>c.name===id)?.fa||id||'بدون دسته';
  const subcategoryLabel=id=>window.FarmaTaxonomy?.find(id)?.fa||id||'—';
  const categoryShown=item=>window.FarmaTaxonomy?.find(item.category)
    ? window.FarmaTaxonomy.visible(item.category) && window.FarmaTaxonomy.visible(item.subcategory||item.category) && window.FarmaTaxonomy.belongs(item,item.category)
    : getCategories().some(c=>c.name===item.category&&c.visible!==false);
  const state=item=>archivedSources.has(item.source_name)?'archived':!item.active?'hidden':!item.usage_permission_confirmed?'pending':!categoryShown(item)?'category-hidden':'visible';
  const stateName={visible:'در سایت',hidden:'پنهان',pending:'نیاز به تأیید',archived:'بایگانی منبع','category-hidden':'دسته پنهان'};
  function optionFill(id,values,first){const el=$(id),current=el.value;el.innerHTML='<option value="">'+first+'</option>'+values.map(([value,label])=>`<option value="${esc(value)}">${esc(label)}</option>`).join('');if(values.some(([v])=>v===current))el.value=current;}
  function options(){
    const items=getProducts();
    const categories=[...new Set([...getCategories().map(c=>c.name),...items.map(i=>i.category).filter(Boolean)])];
    optionFill('#product-category-filter',categories.map(id=>[id,categoryLabel(id)+(getCategories().some(c=>c.name===id)?'':' · دسته ثبت‌شده')]),'همه دسته‌ها');
    optionFill('#product-brand-filter',[...new Set(items.map(i=>canonicalBrand(i.brand)).filter(Boolean))].sort().map(v=>[v,v]),'همه برندها');
    subcategories();
    const categoryInput=$('#product-form').elements.category,current=categoryInput.value;
    categoryInput.innerHTML='<option value="">انتخاب دسته</option>'+categories.map(id=>`<option value="${esc(id)}">${esc(categoryLabel(id)+(getCategories().some(c=>c.name===id)?'':' · دسته ثبت‌شده'))}</option>`).join('');categoryInput.value=current;
    $('#product-brand-suggestions').innerHTML=[...new Set(items.map(i=>i.brand).filter(Boolean))].sort().map(value=>`<option value="${esc(value)}"></option>`).join('');
  }
  function subcategories(){const category=$('#product-category-filter').value;optionFill('#product-subcategory-filter',[...new Set(getProducts().filter(i=>!category||i.category===category).map(i=>i.subcategory).filter(Boolean))].sort().map(v=>[v,subcategoryLabel(v)]),'همه زیر دسته‌ها');}
  const selectedProducts=()=>getProducts().filter(item=>selected.has(String(item.id)));
  function message(text,success=false){const el=$('#products-message');el.textContent=text;el.classList.toggle('is-success',success);el.classList.toggle('is-error',!success&&Boolean(text));}
  function selection(){
    $('#product-bulk-toolbar').hidden=!selected.size;
    $('#product-selection-count').textContent=fa(selected.size)+' محصول انتخاب شده';
    const inFilter=filtered.filter(item=>selected.has(String(item.id))).length,outside=selected.size-inFilter;
    $('#product-selection-scope').textContent=outside?fa(outside)+' مورد از انتخاب‌ها خارج از فیلتر فعلی است؛ عملیات روی همه انتخاب‌ها انجام می‌شود.':'انتخاب‌ها با جابه‌جایی بین صفحه‌ها حفظ می‌شوند.';
    const master=$('#select-page-products');master.checked=!!visibleRows.length&&visibleRows.every(i=>selected.has(String(i.id)));master.indeterminate=visibleRows.some(i=>selected.has(String(i.id)))&&!master.checked;master.disabled=busy||!visibleRows.length;
    $('#select-filtered-products').disabled=busy||!filtered.length||filtered.every(i=>selected.has(String(i.id)));
    $('#select-filtered-products').textContent='انتخاب همه '+fa(filtered.length)+' نتیجه';
  }
  const controlSelector='#products-panel button,#products-panel input,#products-panel select,[data-create-product]';
  let previousControls=[];
  function lock(value){
    busy=value;$('#products-panel').setAttribute('aria-busy',String(value));
    if(value){previousControls=[...document.querySelectorAll(controlSelector)].map(el=>[el,el.disabled]);previousControls.forEach(([el])=>el.disabled=true);}
    else{previousControls.forEach(([el,disabled])=>{if(el.isConnected)el.disabled=disabled;});previousControls=[];selection();}
    $('#confirm-product-delete').disabled=value||!$('#confirm-delete-check').checked;
    $('#cancel-product-delete').disabled=value;$('#download-delete-selection').disabled=value;
    $('#cancel-product-publish').disabled=value;
    $('#confirm-product-publish').disabled=value||!$('#confirm-product-usage').checked;
  }
  async function run(mode,ids,active,confirmUsage=false){
    if(busy||!ids.length)return;
    lock(true);message('در حال '+(mode==='delete'?'حذف':'به‌روزرسانی')+' محصولات…',true);
    const result=await changeProductBatch(client,ids,{mode,active,confirmUsage,onProgress:(done,total)=>message(fa(done)+' از '+fa(total)+' محصول تأیید شد…',true)});
    result.done.forEach(id=>selected.delete(id));
    let refreshError='';
    try{await onReload();}catch(error){refreshError=' دریافت دوباره فهرست انجام نشد؛ دکمه تازه‌سازی را بزنید.';}
    finally{lock(false);}
    const action=mode==='delete'?'حذف شد':'به‌روزرسانی شد';
    message((result.done.length?fa(result.done.length)+' محصول '+action+'. ':'')+(result.error?'عملیات کامل نشد: '+(result.error.message||String(result.error))+' انتخاب‌های انجام‌نشده حفظ شدند.':!result.done.length?'هیچ محصولی تغییر نکرد.':'')+refreshError,!result.error&&!refreshError);
    return result;
  }
  function requestDelete(ids){
    if(busy)return;
    const wanted=new Set(ids.map(String));
    deletePlan=getProducts().filter(item=>wanted.has(String(item.id)));
    if(!deletePlan.length)return;
    $('#delete-product-count').textContent=fa(deletePlan.length);
    $('#delete-product-list').innerHTML=deletePlan.slice(0,6).map(item=>'<li><b dir="auto">'+esc(item.detail_json?.name_fa||item.name_fa||item.name_en)+'</b><small dir="ltr">'+esc(item.product_number||item.id)+'</small></li>').join('')+(deletePlan.length>6?'<li class="delete-more">و '+fa(deletePlan.length-6)+' محصول دیگر</li>':'');
    $('#confirm-delete-check').checked=false;$('#confirm-product-delete').disabled=true;
    $('#product-delete-dialog').showModal();
  }
  function render(){
    const items=getProducts(),q=searchText($('#product-search').value),category=$('#product-category-filter').value,subcategory=$('#product-subcategory-filter').value,brand=$('#product-brand-filter').value;
    const ids=new Set(items.map(i=>String(i.id)));selected=new Set([...selected].filter(id=>ids.has(id)));
    filtered=items.filter(item=>(!status||state(item)===status||(status==='hidden'&&state(item)==='category-hidden'))&&(!category||item.category===category)&&(!subcategory||item.subcategory===subcategory)&&(!brand||canonicalBrand(item.brand)===brand)&&[item.name_en,item.name_fa,item.detail_json?.name_fa,item.product_number,item.cas_number,item.brand,item.subcategory,item.source_name].some(v=>searchText(v).includes(q)));
    const sort=$('#product-order').value;
    filtered.sort((a,b)=>sort==='updated'?String(b.updated_at||'').localeCompare(String(a.updated_at||'')):sort==='category'?categoryLabel(a.category).localeCompare(categoryLabel(b.category),'fa')||String(a.name_en||'').localeCompare(String(b.name_en||''),'en'):String(a.name_en||'').localeCompare(String(b.name_en||''),'en',{sensitivity:'base'})*(sort==='name-desc'?-1:1));
    const size=Number($('#product-page-size').value),totalPages=Math.max(1,Math.ceil(filtered.length/size));page=Math.min(page,totalPages);
    visibleRows=filtered.slice((page-1)*size,page*size);
    $('#product-count').textContent=fa(filtered.length)+' نتیجه از '+fa(items.length)+' محصول';
    $('#product-status-tabs').innerHTML=[['','همه'],['visible','در سایت'],['hidden','پنهان'],['pending','نیاز به تأیید'],['archived','بایگانی منبع']].map(([key,label])=>`<button type="button" data-product-status="${key}" class="${status===key?'is-active':''}" aria-pressed="${status===key}">${label}<b>${fa(key?items.filter(i=>state(i)===key||(key==='hidden'&&state(i)==='category-hidden')).length:items.length)}</b></button>`).join('');
    $('#empty-products').hidden=!!filtered.length;
    $('#product-rows').innerHTML=visibleRows.map(item=>{
      const id=String(item.id),visibility=state(item);let image='';try{const url=new URL(item.image_url,location.href);if(['https:','http:'].includes(url.protocol))image=url.href;}catch{}
      const href=item.detail_json?.enabled?`product.html?id=${encodeURIComponent(id)}`:`catalog.html?product=${encodeURIComponent(id)}`;
      return `<tr class="${selected.has(id)?'is-selected':''}"><td><input type="checkbox" data-select-product="${esc(id)}" ${selected.has(id)?'checked':''} aria-label="انتخاب ${esc(item.name_en)}" /></td><td><div class="product-cell">${image?`<img class="product-thumb" src="${esc(image)}" loading="lazy" alt="" />`:'<span class="product-thumb product-thumb-placeholder" aria-hidden="true">⚗</span>'}<div class="product-cell-copy" dir="auto"><button type="button" class="product-title-button" data-edit="${esc(id)}" title="${esc(item.name_en)}">${esc(item.detail_json?.name_fa||item.name_fa||item.name_en)}</button>${(item.detail_json?.name_fa||item.name_fa)?'<span class="product-name-en" lang="en">'+esc(item.name_en)+'</span>':''}<small>${item.product_number?'Catalog: '+esc(item.product_number):'CAS: '+esc(item.cas_number||'—')}${item.product_number&&item.cas_number?' · CAS: '+esc(item.cas_number):''}</small></div></div></td><td class="product-meta-cell">${esc(categoryLabel(item.category))}<small dir="auto">${esc(subcategoryLabel(item.subcategory))}</small></td><td dir="auto">${esc(item.brand||'—')}</td><td><span class="status-pill ${visibility==='visible'?'':visibility==='pending'?'pending':visibility==='archived'?'archived':'off'}">${stateName[visibility]}</span></td><td><div class="row-actions"><button type="button" data-edit="${esc(id)}">ویرایش</button><button type="button" data-toggle-active="${esc(id)}">${item.active?'پنهان':'نمایش'}</button><button type="button" class="delete" data-delete="${esc(id)}">حذف</button>${visibility==='visible'?`<a class="article-open-link" href="${href}" target="_blank" rel="noopener">مشاهده ↗</a>`:''}</div></td></tr>`;
    }).join('');
    $('#product-page-info').textContent='صفحه '+fa(page)+' از '+fa(totalPages)+(filtered.length?' · '+fa((page-1)*size+1)+'–'+fa(Math.min(page*size,filtered.length)):'');
    $('#product-prev').disabled=page===1;$('#product-next').disabled=page>=totalPages;selection();
    $('#product-rows').querySelectorAll('img').forEach(image=>image.addEventListener('error',()=>{image.hidden=true;},{once:true}));
  }
  function resetPage(){page=1;render();}
  $('#product-search').addEventListener('input',resetPage);
  ['#product-category-filter','#product-subcategory-filter','#product-brand-filter','#product-order','#product-page-size'].forEach(id=>$(id).addEventListener('change',()=>{if(id==='#product-category-filter'){$('#product-subcategory-filter').value='';subcategories();}resetPage();}));
  $('#product-status-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-product-status]');if(b){status=b.dataset.productStatus;resetPage();}});
  $('#product-prev').addEventListener('click',()=>{page=Math.max(1,page-1);render();});$('#product-next').addEventListener('click',()=>{page+=1;render();});
  $('#product-rows').addEventListener('change',e=>{if(!e.target.matches('[data-select-product]'))return;const id=e.target.dataset.selectProduct;e.target.checked?selected.add(id):selected.delete(id);e.target.closest('tr').classList.toggle('is-selected',e.target.checked);selection();});
  $('#select-page-products').addEventListener('change',event=>{visibleRows.forEach(item=>event.target.checked?selected.add(String(item.id)):selected.delete(String(item.id)));render();});
  $('#clear-product-selection').addEventListener('click',()=>{selected.clear();render();});
  $('#reset-product-filters').addEventListener('click',()=>{status='';$('#product-search').value='';['#product-category-filter','#product-subcategory-filter','#product-brand-filter'].forEach(id=>$(id).value='');subcategories();resetPage();});
  $('#export-filtered').addEventListener('click',()=>onExport(filtered));
  $('#select-filtered-products').addEventListener('click',()=>{if(busy)return;filtered.forEach(item=>selected.add(String(item.id)));render();});
  $('#export-selected-products').addEventListener('click',()=>onExport(selectedProducts()));
  $('#delete-selected-products').addEventListener('click',()=>requestDelete([...selected]));
  const publishDialog=$('#product-publish-dialog');
  $('#publish-selected-products').addEventListener('click',()=>{
    if(busy||!selected.size)return;
    const items=selectedProducts(),invalid=publicationProblems(items);
    if(invalid.length){
      message(fa(invalid.length)+' محصول آماده انتشار نیست: نام فارسی یا صفحهٔ تفصیلی ناقص است، تصویر محلی هنوز بارگذاری نشده یا منبع بایگانی شده است.');
      return;
    }
    $('#publish-product-count').textContent=fa(items.length);
    $('#product-publish-summary').textContent=fa(items.filter(item=>!item.active).length)+' پیش‌نویس منتشر و استفاده از متن و تصویر همهٔ انتخاب‌ها تأیید می‌شود.';
    $('#confirm-product-usage').checked=false;
    $('#confirm-product-publish').disabled=true;
    publishDialog.showModal();
  });
  $('#confirm-product-usage').addEventListener('change',event=>{$('#confirm-product-publish').disabled=busy||!event.target.checked;});
  $('#cancel-product-publish').addEventListener('click',()=>{if(!busy)publishDialog.close();});
  publishDialog.addEventListener('cancel',event=>{if(busy)event.preventDefault();});
  $('#confirm-product-publish').addEventListener('click',async()=>{
    if(busy||!$('#confirm-product-usage').checked)return;
    const ids=[...selected];
    try{await run('visibility',ids,true,true);}finally{publishDialog.close();}
  });
  $('#confirm-delete-check').addEventListener('change',()=>{$('#confirm-product-delete').disabled=busy||!$('#confirm-delete-check').checked;});
  $('#cancel-product-delete').addEventListener('click',()=>{if(!busy)$('#product-delete-dialog').close();});
  $('#download-delete-selection').addEventListener('click',()=>onExport(deletePlan));
  $('#product-delete-dialog').addEventListener('cancel',event=>{if(busy)event.preventDefault();});
  $('#product-delete-dialog').addEventListener('close',()=>{deletePlan=[];});
  $('#confirm-product-delete').addEventListener('click',async()=>{
    if(busy||!$('#confirm-delete-check').checked)return;
    const ids=deletePlan.map(item=>String(item.id));
    try{await run('delete',ids);}finally{$('#product-delete-dialog').close();}
  });
  $('#refresh-products').addEventListener('click',async()=>{
    if(busy)return;lock(true);
    try{await onReload();message('فهرست محصولات به‌روز شد.',true);}catch(error){message('دریافت فهرست انجام نشد: '+error.message);}finally{lock(false);}
  });
  window.addEventListener('beforeunload',event=>{if(busy){event.preventDefault();event.returnValue='';}});
  document.querySelectorAll('[data-bulk-active]').forEach(button=>button.addEventListener('click',async()=>{
    if(busy||!selected.size)return;
    const active=button.dataset.bulkActive==='true';
    if(active && publicationProblems(selectedProducts()).length){message('برخی از محصولات برای انتشار آماده نیستند.');return;}
    const ids=[...selected];
    if(!confirm((active?'نمایش':'پنهان کردن')+' '+fa(ids.length)+' محصول انتخاب‌شده انجام شود؟'))return;
    await run('visibility',ids,active);
  }));
  return {render,options,requestDelete,get busy(){return busy;},async runExclusive(action){if(busy)return;lock(true);try{return await action();}finally{lock(false);}},showStatus(value){status=value;page=1;render();},refresh(){options();render();},get filtered(){return filtered;}};
}
