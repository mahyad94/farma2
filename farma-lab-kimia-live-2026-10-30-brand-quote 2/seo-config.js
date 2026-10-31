// Canonical publication address; local file paths and tracking parameters never enter SEO URLs.
(() => {
  const origin = "https://farma-lab-kimia-test.pages.dev/";
  const pageUrl = path => new URL(path || "", origin).href;
  window.FarmaSeo = Object.freeze({ origin, pageUrl });
  const file = location.pathname.split("/").pop() || "index.html";
  const routes = new Set(["index.html","catalog.html","product.html","articles.html","about.html","contact.html"]);
  if (!routes.has(file)) return;
  const input = new URLSearchParams(location.search), query = new URLSearchParams();
  const keys = file === "product.html" ? ["id"] : file === "catalog.html" ? ["category","subcategory","page"] : file === "articles.html" ? ["slug"] : [];
  for (const key of keys) if (input.get(key)?.trim()) query.set(key, input.get(key).trim());
  if(query.has("page")) { const page=Number(query.get("page")); if(Number.isInteger(page)&&page>1&&page<=10000) query.set("page",page); else query.delete("page"); }
  const canonical = pageUrl((file === "index.html" ? "" : file) + (query.toString() ? "?" + query : ""));
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.append(link); }
  link.href = canonical;
  function meta(key, value, property = false) {
    const selector = 'meta[' + (property ? "property" : "name") + '="' + key + '"]';
    let element = document.head.querySelector(selector);
    if (!element) { element = document.createElement("meta"); element.setAttribute(property ? "property" : "name", key); document.head.append(element); }
    element.content = value;
  }
  meta("og:url", canonical, true);
  if (input.get("preview") === "1" || input.get("cms-preview") === "1" ||
      (file === "product.html" && !query.has("id")) ||
      (file === "catalog.html" && (input.get("q")?.trim() || input.has("brand") || ["name-asc","name-desc"].includes(input.get("sort"))))) {
    meta("robots", "noindex,follow");
  }
})();
