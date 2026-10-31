// Only derive facts present in a Sigma-Aldrich URL. Product content is reviewed separately.
export function prepareProductLink(input) {
  let url;
  try { url = new URL(String(input || "").trim()); }
  catch { throw new Error("پیوند محصول معتبر نیست."); }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("فقط پیوند عمومی http یا https قابل قبول است.");
  }
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  if (!hostname || hostname === "localhost" || hostname.endsWith(".local")) {
    throw new Error("نشانی یک صفحهٔ عمومی محصول را وارد کنید.");
  }
  url.protocol = "https:";
  url.hash = "";
  url.search = "";
  const sigma = hostname === "sigmaaldrich.com" || hostname.endsWith(".sigmaaldrich.com");
  const sigmaProduct = sigma ? url.pathname.match(/^\/[a-z]{2}\/en\/product\/[^/]+\/([^/]+)\/?$/i) : null;
  if (!sigmaProduct) throw new Error("فعلاً فقط پیوند صفحهٔ محصول Sigma-Aldrich پذیرفته می‌شود.");
  return {
    source_url: url.href,
    source_name: "Sigma-Aldrich",
    brand: "Sigma-Aldrich",
    product_number: decodeURIComponent(sigmaProduct[1])
  };
}
