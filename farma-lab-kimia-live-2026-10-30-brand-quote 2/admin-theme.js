import {themeGroups,referencePalette,isHexColor} from './theme-config.js?v=products-20261027';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderThemeEditor(values,fields,renderField){
  return `<div class="theme-colors-editor"><div class="theme-reference-card"><div><b>رنگ‌های تصویر مرجع</b><p>سرمه‌ای تیره، فیروزه‌ای، بنفش و زمینه سفید. بازگردانی فقط رنگ‌ها را تغییر می‌دهد و تا ذخیره در سایت منتشر نمی‌شود.</p><div class="theme-reference-swatches" aria-label="رنگ‌های مرجع"><span style="background:#102b4e"></span><span style="background:#59bcb8"></span><span style="background:#583a9b"></span><span style="background:#ffffff"></span></div></div><button type="button" class="secondary-button" id="restore-reference-colors">بازگشت به رنگ‌های مرجع</button></div><p class="editor-help-note">برای تغییر زمینه سفید سایت، «زمینه اصلی صفحه» را انتخاب کنید. رنگ کارت‌ها و سربرگ مستقل است. روی مربع رنگ بزنید یا کد HEX را وارد کنید؛ سپس پیش‌نمایش را ببینید و ذخیره کنید.</p>${themeGroups.map((section,index)=>`<details class="theme-color-group" ${index===0?'open':''}><summary><span>${esc(section.title)}</span><small>${section.colors.length} رنگ</small></summary><p>${esc(section.description)}</p><div class="theme-color-grid">${section.colors.map(([key,label,fallback])=>{
    const value=isHexColor(values[key])?values[key]:fallback;
    return `<label class="theme-color-field"><span>${esc(label)}</span><div class="theme-color-input"><input type="color" id="setting-${key}" data-content-key="${key}" value="${value}" aria-label="${esc(label)}" /><input type="text" class="theme-hex-input" data-color-hex="${key}" value="${value.toUpperCase()}" maxlength="7" dir="ltr" autocomplete="off" spellcheck="false" aria-label="${esc(label)} — کد رنگ" /></div></label>`;
  }).join('')}</div></details>`).join('')}<details class="theme-color-group"><summary><span>اندازه‌ها</span><small>۲ تنظیم</small></summary><div class="content-group-grid">${fields.filter(f=>f[4]?.type!=='color').map(f=>renderField(f,values[f[0]]??f[2],`data-content-key="${f[0]}"`)).join('')}</div></details></div>`;
}

export function validateThemeEditor(form,selectSection){
  const invalid=[...form.querySelectorAll('[data-color-hex]')].find(el=>!isHexColor(el.value));
  if(invalid){selectSection('appearance');invalid.closest('details').open=true;invalid.focus();throw new Error('کد رنگ باید شش رقم داشته باشد؛ مانند #102B4E.');}
}

export function setupThemeEditor(form,{onChange,message}){
  function sync(){
    form.querySelectorAll('[data-color-hex]').forEach(hex=>{const color=form.querySelector('[data-content-key="'+hex.dataset.colorHex+'"]');if(color){hex.value=color.value.toUpperCase();hex.classList.remove('is-invalid');hex.removeAttribute('aria-invalid');}});
  }
  form.addEventListener('input',event=>{
    const hex=event.target.closest('[data-color-hex]');
    if(hex){const valid=isHexColor(hex.value);hex.classList.toggle('is-invalid',!valid);hex.setAttribute('aria-invalid',String(!valid));if(valid){const color=form.querySelector('[data-content-key="'+hex.dataset.colorHex+'"]');color.value=hex.value;color.dispatchEvent(new Event('input',{bubbles:true}));}return;}
    if(event.target.type==='color')sync();
  });
  form.addEventListener('click',event=>{
    if(event.target.closest('#restore-reference-colors')){
      let changed=false;
      for(const [key,value] of Object.entries(referencePalette)){const color=form.querySelector('[data-content-key="'+key+'"]');if(color.value.toLowerCase()!==value)changed=true;color.value=value;}
      sync();onChange();message(changed?'رنگ‌های مرجع آماده است؛ برای انتشار، ذخیره در سایت را بزنید.':'رنگ‌ها هم‌اکنون مطابق تصویر مرجع است.',true);
    }
    if(event.target.closest('[data-reset-group="appearance"]'))sync();
  });
}
