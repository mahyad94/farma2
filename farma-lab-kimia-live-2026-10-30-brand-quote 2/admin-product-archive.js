// Reads the local CSV + image bundle. Only referenced image files are extracted.
const MAX_ARCHIVE = 60 * 1024 * 1024;
const MAX_CSV = 20 * 1024 * 1024;
const MAX_IMAGE = 5 * 1024 * 1024;
const MAX_ENTRIES = 400;

function imageType(bytes) {
  if (bytes.length >= 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71 && bytes[4] === 13 && bytes[5] === 10) return 'image/png';
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg';
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0,4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP') return 'image/webp';
  return '';
}

export function localImagePath(value) {
  const path = String(value || '').trim();
  if (!path || /^https?:\/\//i.test(path) || /^data:image\//i.test(path)) return '';
  if (!/^assets\/products\/[a-z0-9][a-z0-9._/-]*\.(png|jpe?g|webp)$/i.test(path) || path.split('/').includes('..')) {
    throw new Error('مسیر تصویر محلی در CSV معتبر نیست: ' + path);
  }
  return path;
}

export function embeddedImage(value) {
  const text=String(value||'').trim();
  if(!/^data:/i.test(text))return null;
  const match=/^data:(image\/(?:png|jpeg|webp));base64,([a-z0-9+/]+={0,2})$/i.exec(text);
  if(!match)throw new Error('تصویر جاسازی‌شده در CSV معتبر نیست.');
  if(match[2].length>Math.ceil(MAX_IMAGE*4/3)+4)throw new Error('حجم تصویر جاسازی‌شده بیش از ۵ مگابایت است.');
  let binary;
  try{binary=atob(match[2]);}catch{throw new Error('رمزگذاری تصویر جاسازی‌شده معتبر نیست.');}
  const bytes=Uint8Array.from(binary,char=>char.charCodeAt(0));
  if(bytes.length>MAX_IMAGE||imageType(bytes)!==match[1].toLowerCase())throw new Error('فرمت تصویر جاسازی‌شده با دادهٔ فایل مطابقت ندارد.');
  return {bytes,contentType:match[1].toLowerCase()};
}

export function importPublicationFlags(active,confirmed,previous,toBoolean){
  return {
    active:toBoolean(active)||Boolean(previous?.active),
    usage_permission_confirmed:toBoolean(confirmed)||Boolean(previous?.usage_permission_confirmed),
  };
}

export async function readProductArchive(zipApi, file, parseCsv) {
  if (!zipApi?.loadAsync) throw new Error('ابزار خواندن ZIP بارگذاری نشد؛ صفحه را تازه‌سازی کنید.');
  if (file.size > MAX_ARCHIVE) throw new Error('فایل ZIP باید کمتر از ۶۰ مگابایت باشد.');
  const zip = await zipApi.loadAsync(file);
  const entries = Object.values(zip.files).filter(entry => !entry.dir);
  if (entries.length > MAX_ENTRIES) throw new Error('تعداد فایل‌های ZIP بیش از حد مجاز است.');
  const csvFiles = entries.filter(entry => /(^|\/)farma-[^/]*\.csv$/i.test(entry.name));
  if (csvFiles.length !== 1) throw new Error('ZIP باید دقیقاً یک فایل CSV محصول داشته باشد.');
  const csvEntry = csvFiles[0];
  if (csvEntry._data?.uncompressedSize > MAX_CSV) throw new Error('CSV داخل ZIP بیش از ۵ مگابایت است.');
  const csvText = await csvEntry.async('string');
  if (new Blob([csvText]).size > MAX_CSV) throw new Error('CSV داخل ZIP بیش از ۵ مگابایت است.');
  const rows = parseCsv(csvText);
  if (!rows.length) throw new Error('CSV داخل ZIP خالی است.');
  const images = new Map();
  for (const row of rows) {
    const path = localImagePath(row.image_url);
    if (!path || images.has(path)) continue;
    const entry = zip.file(path);
    if (!entry || entry.dir) throw new Error('تصویر ارجاع‌شده در ZIP پیدا نشد: ' + path);
    if (entry._data?.uncompressedSize > MAX_IMAGE) throw new Error('حجم تصویر بیش از ۵ مگابایت است: ' + path);
    const bytes = await entry.async('uint8array');
    if (bytes.length > MAX_IMAGE) throw new Error('حجم تصویر بیش از ۵ مگابایت است: ' + path);
    const contentType = imageType(bytes);
    if (!contentType) throw new Error('فرمت تصویر معتبر نیست: ' + path);
    images.set(path, {bytes,contentType});
  }
  return {rows,images};
}
