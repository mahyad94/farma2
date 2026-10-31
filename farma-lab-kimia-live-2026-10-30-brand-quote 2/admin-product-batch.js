// Uses the signed-in admin client and existing RLS. Never reports unverified rows as changed.
export async function changeProductBatch(client, identifiers, {mode, active, confirmUsage=false, onProgress=()=>{}}) {
  if (!['delete','visibility'].includes(mode)) throw new Error('Unknown product operation');
  if (confirmUsage && (mode!=='visibility' || active!==true)) throw new Error('Invalid publication request');
  const ids=[...new Set(identifiers.map(String))].filter(Boolean),done=[];
  let error=null;
  for(let offset=0;offset<ids.length;offset+=100){
    const chunk=ids.slice(offset,offset+100);
    try {
      const table=client.from('products');
      const changes={active,updated_at:new Date().toISOString()};
      if(confirmUsage)changes.usage_permission_confirmed=true;
      const query=mode==='delete'?table.delete():table.update(changes);
      const result=await query.in('id',chunk).select(mode==='delete'?'id':'id,active,usage_permission_confirmed');
      if(result.error) throw result.error;
      if(!Array.isArray(result.data)) throw new Error('پاسخ تأییدشده‌ای از سرور دریافت نشد. فهرست را دوباره دریافت کنید.');
      const returned=new Map(result.data.map(row=>[String(row.id),row]));
      const verified=chunk.filter(id=>{
        const row=returned.get(id);
        return row && (mode==='delete' || row.active===active && (!confirmUsage || row.usage_permission_confirmed===true));
      });done.push(...verified);
      onProgress(done.length,ids.length);
      if(verified.length!==chunk.length)throw new Error('همه ردیف‌ها تأیید نشدند؛ ممکن است محصول حذف شده باشد یا دسترسی کافی نباشد.');
    } catch(cause){error=cause;break;}
  }
  const completed=new Set(done);
  return {done,remaining:ids.filter(id=>!completed.has(id)),error};
}
