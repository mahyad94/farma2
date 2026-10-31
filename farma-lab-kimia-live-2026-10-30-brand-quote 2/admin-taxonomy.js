/* Manage every level of the approved pyramid without touching product records. */
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy=value=>JSON.parse(JSON.stringify(value));

export function createTaxonomyEditor({client,getProducts=()=>[],onSaved=()=>{}}) {
  const taxonomy=window.FarmaTaxonomy;
  const $=selector=>document.querySelector(selector);
  let draft=copy(taxonomy.tree),selectedId=String(draft[0]?.id||''),dirty=false,busy=false;
  const message=(value,ok=false)=>{const el=$('#taxonomy-message');el.textContent=value;el.classList.toggle('is-success',ok);};
  function locate(id,nodes=draft,parent=null,path=[]) {
    for(const node of nodes) {
      const current=[...path,node];
      if(String(node.id)===String(id))return {node,parent,nodes,path:current};
      const child=locate(id,node.children,node,current);
      if(child)return child;
    }
    return null;
  }
  function all(nodes=draft,out=[]) {for(const node of nodes){out.push(node);all(node.children,out);}return out;}
  function visibleNode(node){const found=locate(node.id);return !!found&&!found.path.some(item=>item.visible===false);}
  function productCount(node){const ids=new Set();const collect=n=>{ids.add(String(n.id));n.children.forEach(collect);};collect(node);return getProducts().filter(product=>ids.has(String(product.subcategory||''))||ids.has(String(product.category||''))).length;}
  function setDirty(){dirty=true;$('#taxonomy-save').disabled=false;$('#taxonomy-discard').disabled=false;$('#taxonomy-state').textContent='تغییرات ذخیره‌نشده';}
  function resetDirty(){dirty=false;$('#taxonomy-save').disabled=true;$('#taxonomy-discard').disabled=true;$('#taxonomy-state').textContent='همه تغییرات ذخیره شده است';}
  function nodeRow(node){const active=String(node.id)===selectedId;
    return '<button type="button" class="taxonomy-admin-row'+(active?' is-active':'')+'" data-taxonomy-select="'+esc(node.id)+'"><span><b>'+esc(node.fa)+'</b><small dir="ltr" lang="en">'+esc(node.name)+'</small></span>'+(visibleNode(node)?'':'<em>پنهان</em>')+'<i>←</i></button>';
  }
  function render(){
    const current=locate(selectedId)||locate(draft[0]?.id);if(!current)return;
    selectedId=String(current.node.id);
    const q=$('#taxonomy-admin-search').value.trim().toLocaleLowerCase();
    const rows=q?all().filter(node=>[node.fa,node.name].some(value=>String(value).toLocaleLowerCase().includes(q))).slice(0,100):current.parent?current.parent.children:draft;
    $('#taxonomy-admin-list').innerHTML=(q?'<p class="taxonomy-list-label">نتایج جستجو · حداکثر ۱۰۰ مورد</p>':'<p class="taxonomy-list-label">دسته‌های این سطح</p>')+rows.map(nodeRow).join('')+(rows.length?'':'<p>دسته‌ای پیدا نشد.</p>');
    $('#taxonomy-path').innerHTML='<button type="button" data-taxonomy-select="'+esc(draft[0].id)+'">همه دسته‌ها</button>'+current.path.map(node=>' <span>›</span> <button type="button" data-taxonomy-select="'+esc(node.id)+'">'+esc(node.fa)+'</button>').join('');
    $('#taxonomy-node-id').textContent=current.node.id;
    $('#taxonomy-name-fa').value=current.node.fa;
    $('#taxonomy-name-en').value=current.node.name;
    $('#taxonomy-visible').checked=current.node.visible!==false;
    $('#taxonomy-visibility-note').textContent=current.path.slice(0,-1).some(node=>node.visible===false)?'یک دسته بالادستی پنهان است؛ این دسته نیز در سایت دیده نمی‌شود.':visibleNode(current.node)?'این دسته در کاتالوگ دیده می‌شود.':'این دسته و زیرگروه‌هایش از کاتالوگ پنهان هستند.';
    $('#taxonomy-current-children').innerHTML=current.node.children.length?current.node.children.map(nodeRow).join(''):'<p class="taxonomy-list-label">این دسته زیرگروهی ندارد؛ می‌توانید به آن زیرگروه بیفزایید.</p>';
    $('#taxonomy-counts').textContent=all().length.toLocaleString('fa-IR')+' دسته · '+current.node.children.length.toLocaleString('fa-IR')+' زیرگروه مستقیم';
    $('#taxonomy-product-count').textContent=productCount(current.node).toLocaleString('fa-IR')+' محصول در این شاخه';
    $('#taxonomy-delete').disabled=draft.length===1&&!current.parent;
  }
  async function load(){
    if(!taxonomy.localMode){const {data,error}=await client.from('site_content').select('content_value').eq('content_key','catalog_taxonomy_v1').maybeSingle();if(error){message('دریافت دسته‌بندی انجام نشد: '+error.message);return;}taxonomy.configure(data?.content_value);}
    else taxonomy.configure();
    draft=copy(taxonomy.tree); selectedId=String(draft[0]?.id||'');resetDirty();render();
    $('#taxonomy-mode-note').textContent=taxonomy.localMode?'تغییرات این نسخه فقط در مرورگر همین دستگاه ذخیره می‌شوند و به سایت زنده منتقل نمی‌شوند.':'تغییرات پس از ذخیره در سایت منتشر می‌شوند.';
  }
  $('#taxonomy-admin-search').addEventListener('input',render);
  $('#taxonomy-panel').addEventListener('click',event=>{
    const target=event.target.closest('[data-taxonomy-select]');
    if(target){selectedId=target.dataset.taxonomySelect;render();return;}
    if(event.target.closest('#taxonomy-add-root')||event.target.closest('#taxonomy-add-child')){
      const root=Boolean(event.target.closest('#taxonomy-add-root'));
      const collection=root?draft:locate(selectedId)?.node.children;
      if(!collection)return;
      if(!root&&locate(selectedId).path.length>=7){message('حداکثر عمق دسته‌بندی ۷ سطح است.');return;}
      const node={id:'custom-'+crypto.randomUUID(),name:'New category',fa:'دسته جدید',source:'',status:'custom',visible:true,children:[]};
      collection.push(node);selectedId=node.id;setDirty();render();$('#taxonomy-name-fa').focus();return;
    }
    if(event.target.closest('#taxonomy-delete')){
      const found=locate(selectedId);if(!found||(draft.length===1&&!found.parent))return;
      const count=productCount(found.node);
      if(count){message('این شاخه '+count.toLocaleString('fa-IR')+' محصول دارد. پیش از حذف، محصولات را به دسته دیگری منتقل یا پنهان کنید.');return;}
      if(!confirm('دسته «'+found.node.fa+'» و همه زیرگروه‌هایش حذف شوند؟ محصولات حذف نمی‌شوند.'))return;
      found.nodes.splice(found.nodes.indexOf(found.node),1);selectedId=String(found.parent?.id||draft[0]?.id||'');setDirty();render();return;
    }
    if(event.target.closest('#taxonomy-discard')){if(!confirm('تغییرات ذخیره‌نشده کنار گذاشته شوند؟'))return;draft=copy(taxonomy.tree);selectedId=String(draft[0]?.id||'');resetDirty();render();message('تغییرات لغو شد.',true);}
  });
  for(const [selector,key] of [['#taxonomy-name-fa','fa'],['#taxonomy-name-en','name']])$(selector).addEventListener('input',event=>{const found=locate(selectedId);if(!found)return;found.node[key]=event.target.value;setDirty();$('#taxonomy-admin-list').querySelector('[data-taxonomy-select="'+CSS.escape(selectedId)+'"] b')?.replaceChildren(document.createTextNode(found.node.fa));});
  $('#taxonomy-visible').addEventListener('change',event=>{const found=locate(selectedId);if(!found)return;found.node.visible=event.target.checked;setDirty();render();});
  $('#taxonomy-save').addEventListener('click',async()=>{
    if(!dirty||busy)return;
    try{
      taxonomy.validate(draft);
      busy=true;$('#taxonomy-save').disabled=true;message('در حال ذخیره…',true);
      await taxonomy.save(draft,client);draft=copy(taxonomy.tree);resetDirty();render();onSaved();message(taxonomy.localMode?'در نسخه محلی ذخیره شد.':'دسته‌بندی‌ها در سایت ذخیره شدند.',true);
    }catch(error){message('ذخیره انجام نشد: '+error.message);$('#taxonomy-save').disabled=false;}
    finally{busy=false;}
  });
  window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
  return {load,render,get dirty(){return dirty;}};
}
