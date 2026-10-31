// Shared by the public site and the admin. Defaults reproduce the reference palette.
export const themeGroups = [
  {id:'foundation',title:'زمینه و رنگ‌های عمومی',description:'زمینه اصلی صفحه از زمینه کارت‌ها و بخش کاتالوگ مستقل است.',colors:[
    ['theme_page_background','زمینه اصلی صفحه (سفید فعلی)','#ffffff','--page-background'],
    ['theme_surface','زمینه کارت‌ها و پنجره‌ها','#ffffff','--surface'],
    ['theme_background','زمینه بخش کاتالوگ و بخش‌های روشن','#f6f8fa','--soft'],
    ['theme_navy','عنوان‌ها و رنگ اصلی برند','#102b4e','--navy'],
    ['theme_text','متن اصلی سایت','#17283c','--ink'],
    ['theme_muted','توضیحات و متن‌های کم‌رنگ','#738294','--muted'],
    ['theme_border','خطوط و حاشیه‌ها','#e1e8ed','--line'],
    ['theme_cyan','رنگ تأکیدی و عنوان‌های کوچک','#45aeb2','--cyan'],
    ['theme_link','پیوندها و حالت فعال','#317c87','--link-color']
  ]},
  {id:'header',title:'سربرگ، منو و جستجو',description:'رنگ بالای سایت، منوها و کادر جستجو.',colors:[
    ['theme_header_background','زمینه سربرگ و منوهای بازشونده','#ffffff','--header-background'],
    ['theme_topline_background','زمینه نوار بالای سایت','#f4f7f9','--topline-background'],
    ['theme_topline_text','متن نوار بالای سایت','#6a7685','--topline-text'],
    ['theme_nav_text','متن منوی اصلی','#40536a','--nav-text'],
    ['theme_input_background','زمینه کادرهای ورود و جستجو','#ffffff','--input-background'],
    ['theme_input_text','متن داخل کادرها','#33465a','--input-text'],
    ['theme_placeholder','متن راهنمای داخل کادرها','#68717b','--placeholder-color'],
    ['theme_input_border','حاشیه کادرهای ورود و جستجو','#bac6d0','--input-border'],
    ['theme_nav_background','زمینه نوار منوی سربرگ','#583a9b','--nav-background'],
    ['theme_purple','زمینه دکمه جستجو','#583a9b','--purple'],
    ['theme_search_text','نماد دکمه جستجو','#ffffff','--search-text'],
    ['theme_logo_icon','نماد آزمایشگاهی لوگو','#79d4ce','--logo-icon']
  ]},
  {id:'hero',title:'بخش معرفی بالای صفحه',description:'سه رنگ طیف زمینه معرفی و رنگ نوشته‌ها و تصویر آزمایشگاهی.',colors:[
    ['theme_hero_start','طیف معرفی: سمت چپ','#0e294a','--hero-start'],
    ['theme_hero_middle','طیف معرفی: میانه','#123456','--hero-middle'],
    ['theme_hero_end','طیف معرفی: سمت راست','#1b4d68','--hero-end'],
    ['theme_hero_title','عنوان بزرگ معرفی','#ffffff','--hero-title'],
    ['theme_hero_text','توضیحات معرفی','#c5d3df','--hero-text'],
    ['theme_hero_accent','عنوان کوچک و نقطه معرفی','#8cdbd3','--hero-accent'],
    ['theme_illustration','رنگ عناصر تصویر آزمایشگاهی','#65c6c2','--illustration-accent'],
    ['theme_hero_outline_background','زمینه دکمه مشاوره در معرفی','#23455f','--hero-outline-background'],
    ['theme_hero_outline_text','متن دکمه مشاوره در معرفی','#ffffff','--hero-outline-text'],
    ['theme_hero_outline_border','حاشیه دکمه مشاوره در معرفی','#7791a7','--hero-outline-border']
  ]},
  {id:'buttons',title:'دکمه‌ها',description:'دکمه اصلی با رنگ فیروزه‌ای تصویر مرجع آغاز می‌شود.',colors:[
    ['theme_primary_background','زمینه دکمه اصلی و مشاهده محصولات','#59bcb8','--primary-background'],
    ['theme_primary_text','متن دکمه اصلی','#0b2b46','--primary-text'],
    ['theme_primary_hover','زمینه دکمه اصلی هنگام اشاره','#79d4cc','--primary-hover'],
    ['theme_secondary_background','زمینه دکمه‌های حاشیه‌دار','#ffffff','--secondary-background'],
    ['theme_secondary_text','متن دکمه‌های حاشیه‌دار','#102b4e','--secondary-text'],
    ['theme_secondary_border','حاشیه دکمه‌های حاشیه‌دار','#d1dce4','--secondary-border'],
    ['theme_quick_add_background','زمینه دکمه افزودن سریع محصول','#102b4e','--quick-add-background'],
    ['theme_quick_add_text','علامت افزودن سریع محصول','#ffffff','--quick-add-text'],
    ['theme_whatsapp_background','زمینه دکمه ارسال با واتساپ','#299f64','--whatsapp-background'],
    ['theme_whatsapp_text','متن دکمه ارسال با واتساپ','#ffffff','--whatsapp-text'],
    ['theme_email_background','زمینه دکمه ارسال با ایمیل','#ffffff','--email-background'],
    ['theme_email_text','متن دکمه ارسال با ایمیل','#375b70','--email-text']
  ]},
  {id:'catalog',title:'محصولات، فیلتر و درخواست',description:'رنگ تصاویر محصولات، مشخصات، دکمه درخواست و پیام‌ها.',colors:[
    ['theme_filter_background','زمینه پنل فیلتر محصولات','#ffffff','--filter-background'],
    ['theme_product_image_start','زمینه تصویر محصول: رنگ اول','#f8fbfc','--product-image-start'],
    ['theme_product_image_end','زمینه تصویر محصول: رنگ دوم','#eff5f6','--product-image-end'],
    ['theme_product_image_circle','دایره پشت تصویر محصول','#e8f2f1','--product-image-circle'],
    ['theme_product_title','نام محصول','#263c53','--product-title'],
    ['theme_product_badge_background','زمینه برچسب برند روی محصول','#ffffff','--product-badge-background'],
    ['theme_product_badge_text','متن برچسب برند روی محصول','#48637c','--product-badge-text'],
    ['theme_quote_button_background','زمینه دکمه افزودن به درخواست','#f2faf9','--quote-button-background'],
    ['theme_quote_button_text','متن دکمه افزودن به درخواست','#276e76','--quote-button-text'],
    ['theme_quote_button_border','حاشیه دکمه افزودن به درخواست','#a9d7d4','--quote-button-border'],
    ['theme_info_background','زمینه یادداشت‌ها و پیام‌های اطلاعاتی','#f0f7f6','--info-background'],
    ['theme_info_text','متن یادداشت‌ها و پیام‌های اطلاعاتی','#667e83','--info-text'],
    ['theme_toast_background','زمینه اعلان کوتاه سایت','#102b4e','--toast-background'],
    ['theme_toast_text','متن اعلان کوتاه سایت','#ffffff','--toast-text']
  ]},
  {id:'category-colors',title:'نمادهای دسته‌بندی',description:'زمینه و رنگ هر یک از پنج نماد دسته‌بندی.',colors:[
    ['theme_category_0_background','مواد شیمیایی: زمینه نماد','#eaf6f3','--category-0-background'],
    ['theme_category_0_text','مواد شیمیایی: رنگ نماد','#287b83','--category-0-text'],
    ['theme_category_1_background','تجهیزات آزمایشگاهی: زمینه نماد','#eef2f8','--category-1-background'],
    ['theme_category_1_text','تجهیزات آزمایشگاهی: رنگ نماد','#36547d','--category-1-text'],
    ['theme_category_2_background','ظروف شیشه‌ای: زمینه نماد','#f0f4f6','--category-2-background'],
    ['theme_category_2_text','ظروف شیشه‌ای: رنگ نماد','#5b8091','--category-2-text'],
    ['theme_category_3_background','نانومواد: زمینه نماد','#f0edf9','--category-3-background'],
    ['theme_category_3_text','نانومواد: رنگ نماد','#7560a9','--category-3-text'],
    ['theme_category_4_background','ملزومات پزشکی: زمینه نماد','#f4f4ef','--category-4-background'],
    ['theme_category_4_text','ملزومات پزشکی: رنگ نماد','#788358','--category-4-text']
  ]},
  {id:'faq-colors',title:'پرسش‌های متداول و برندها',description:'رنگ پاسخ‌ها، نماد بازکردن پرسش و نمادهای حرفی برندها.',colors:[
    ['theme_faq_answer','متن پاسخ پرسش‌ها','#607286','--faq-answer'],
    ['theme_faq_icon_background','زمینه علامت بازکردن پرسش','#eaf6f3','--faq-icon-background'],
    ['theme_faq_icon_text','رنگ علامت بازکردن پرسش','#287e87','--faq-icon-text'],
    ['theme_brand_sigma','نماد حرفی Sigma-Aldrich','#4d9697','--brand-sigma'],
    ['theme_brand_merck','نماد حرفی Merck','#2186a0','--brand-merck'],
    ['theme_brand_supelco','نماد حرفی Supelco','#517bb3','--brand-supelco'],
    ['theme_brand_millipore','نماد حرفی Millipore','#569a47','--brand-millipore']
  ]},
  {id:'footer-colors',title:'درباره ما و پایین صفحه',description:'رنگ زمینه معرفی مجموعه و پابرگ سایت.',colors:[
    ['theme_about_background','زمینه نوار درباره ما','#102b4e','--about-background'],
    ['theme_about_title','عنوان نوار درباره ما','#ffffff','--about-title'],
    ['theme_about_text','توضیحات نوار درباره ما','#bdccda','--about-text'],
    ['theme_about_icon','نماد آزمایشگاهی درباره ما','#78d1c9','--about-icon'],
    ['theme_footer_background','زمینه پابرگ','#f3f6f8','--footer-background'],
    ['theme_footer_heading','عنوان‌های پابرگ','#344a60','--footer-heading'],
    ['theme_footer_text','متن و پیوندهای پابرگ','#7b8996','--footer-text']
  ]}
];

export const themeColors = themeGroups.flatMap(group=>group.colors);
export const referencePalette = Object.fromEntries(themeColors.map(([key,,fallback])=>[key,fallback]));
export const isHexColor = value=>/^#[0-9a-f]{6}$/i.test(String(value||''));
export const themeFields = themeColors.map(([key,label,fallback])=>[key,label,fallback,1,{type:'color'}]);

export function applyTheme(values,root=document.documentElement){
  for(const [key,,fallback,variable] of themeColors)root.style.setProperty(variable,isHexColor(values[key])?values[key]:fallback);
  // Existing base stylesheet variables remain usable by older components.
  root.style.setProperty('--white','var(--surface)');
  root.style.setProperty('--navy-2','color-mix(in srgb, var(--navy) 85%, black)');
}
