// Public controls shared with the admin editor. No import/API calls or product writes.
export const searchPlaceholder = 'نام محصول، شماره کاتالوگ یا شماره کاس';
const oldSearchText = /^Type in Product Names, Product Numbers, or CAS Numbers(?: to see suggestions\.)?$/i;
export function applyExperience(values = {}) {
  const root = document.documentElement;
  const number = (key, fallback, min, max) => {
    const raw = values[key];
    const value = raw === undefined || raw === '' ? fallback : Number(raw);
    return Math.min(max, Math.max(min, Number.isFinite(value) ? value : fallback));
  };
  const color = (key, fallback) => /^#[0-9a-f]{6}$/i.test(values[key] || '') ? values[key] : fallback;
  root.style.setProperty('--peek-width', number('peek_width', 320, 240, 440) + 'px');
  root.style.setProperty('--peek-opacity', number('peek_opacity', 73, 35, 100) / 100);
  root.style.setProperty('--peek-blur', number('peek_blur', 4, 0, 16) + 'px');
  root.style.setProperty('--peek-duration', number('peek_duration', 460, 0, 900) + 'ms');
  root.style.setProperty('--peek-background', color('peek_background', '#ffffff'));
  root.style.setProperty('--peek-header', color('peek_header', '#143c55'));
  root.style.setProperty('--peek-text', color('peek_text', '#16354e'));
  root.dataset.peekImage = String(values.peek_show_image !== 'false');
  root.dataset.peekEnglish = String(values.peek_show_english !== 'false');
  for (const input of document.querySelectorAll('.searchbar input[type="search"],.header-search input[type="search"]')) {
    const supplied = values.search_placeholder;
    input.placeholder = !supplied || oldSearchText.test(supplied.trim()) || supplied === 'نام محصول، شماره کاتالوگ یا CAS' ? searchPlaceholder : supplied;
    const sync = () => {
      input.dir = input.value ? 'auto' : /[\u0600-\u06ff]/.test(input.placeholder) ? 'rtl' : 'ltr';
      input.style.textAlign = input.dir === 'ltr' ? 'left' : 'right';
      if (input.value) input.style.textAlign = 'start';
    };
    input._farmaSyncSearch = sync;
    if (!input.dataset.searchDirectionBound) {
      input.dataset.searchDirectionBound = 'true';
      input.addEventListener('input', () => input._farmaSyncSearch());
    }
    sync();
  }
  for (const el of document.querySelectorAll('[data-page-section]')) {
    el.hidden = values[el.dataset.pageSection + '_visible'] === 'false';
  }
  for (const link of document.querySelectorAll('[data-page-link]')) {
    const value = values[link.dataset.pageLink];
    if (value === undefined) continue;
    try {
      const url = new URL(value, location.href);
      if (['https:', 'http:', 'file:', 'mailto:', 'tel:'].includes(url.protocol) &&
          (url.protocol !== 'file:' || location.protocol === 'file:')) link.href = url.href;
    } catch {}
  }
  const page = document.body.dataset.infoPage;
  if (page) {
    const title = values[page + '_seo_title'], description = values[page + '_seo_description'];
    if (title) document.title = title;
    for (const [selector, value] of [
      ['meta[property="og:title"],meta[name="twitter:title"]', title],
      ['meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]', description]
    ]) if (value) document.querySelectorAll(selector).forEach(el => { el.content = value; });
    const schema = document.querySelector('#page-schema');
    if (schema && (title || description)) {
      try {
        const data = JSON.parse(schema.textContent);
        for (const node of data['@graph'] || []) if (['AboutPage', 'ContactPage'].includes(node['@type'])) {
          if (title) node.name = title;
          if (description) node.description = description;
        }
        schema.textContent = JSON.stringify(data);
      } catch {}
    }
  }
}

export const previewGroup = {
  id:'product-preview',title:'پیش‌نمایش با اشاره ماوس',description:'نمایش، اندازه، شفافیت، رنگ‌ها و اطلاعات پنجره روی محصول.',preview:'catalog.html',fields:[
    ['peek_enabled','نمایش پنجره با اشاره ماوس','true',1,{type:'checkbox'}],
    ['peek_width','عرض پنجره (پیکسل)','320',1,{type:'number',min:240,max:440}],
    ['peek_opacity','پوشانندگی زمینه (درصد؛ کمتر = شفاف‌تر)','73',1,{type:'number',min:35,max:100}],
    ['peek_blur','محو شدن پشت پنجره (پیکسل)','4',1,{type:'number',min:0,max:16}],
    ['peek_duration','زمان انیمیشن (میلی‌ثانیه؛ صفر = بدون انیمیشن)','460',1,{type:'number',min:0,max:900}],
    ['peek_background','رنگ زمینه پنجره','#ffffff',1,{type:'color'}],
    ['peek_header','رنگ نوار بالای پنجره','#143c55',1,{type:'color'}],
    ['peek_text','رنگ نوشته‌های پنجره','#16354e',1,{type:'color'}],
    ...[['image','تصویر محصول'],['english','نام انگلیسی'],['brand','برند'],['category','دسته‌بندی'],['number','شماره کاتالوگ'],['cas','شماره CAS']].map(([key,label])=>['peek_show_'+key,'نمایش '+label,'true',1,{type:'checkbox'}]),
    ['peek_title','عنوان نوار بالا','مشخصات برای استعلام',1],
    ['peek_fields_title','عنوان مشخصات','اطلاعات کلیدی',1],
    ['peek_note','یادداشت پایین پنجره','قیمت، موجودی و زمان تحویل پس از بررسی درخواست اعلام می‌شود.',2],
    ['peek_details_label','متن دکمه جزئیات','مشاهده جزئیات',1]
  ]
};
