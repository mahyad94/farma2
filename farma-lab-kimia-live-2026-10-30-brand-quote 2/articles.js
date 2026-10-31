const client = await (window.farmaSupabaseReady || Promise.resolve(null));
const $ = (selector) => document.querySelector(selector);
const SEO_ROOT = window.FarmaSeo?.origin || "https://farma-lab-kimia-test.pages.dev/";
function setMeta(name, content, property = false) {
  const selector = property ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
  let element = document.head.querySelector(selector);
  if (!element) { element = document.createElement("meta"); element.setAttribute(property ? "property" : "name", name); document.head.append(element); }
  element.content = content;
}
function setCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) { element = document.createElement("link"); element.rel = "canonical"; document.head.append(element); }
  element.href = url;
}
function setRobots(content) { setMeta("robots", content); }
function setSchema(data, id = "article-schema") {
  let element = document.getElementById(id);
  if (!element) { element = document.createElement("script"); element.id = id; element.type = "application/ld+json"; document.head.append(element); }
  element.textContent = JSON.stringify(data);
}
function setArticleBreadcrumbs(article) {
  const nav = $("#article-breadcrumbs");
  nav.innerHTML = '<a href="index.html">صفحه اصلی</a><span aria-hidden="true">›</span><a href="articles.html">مقاله‌ها</a>' +
    (article ? '<span aria-hidden="true">›</span><span aria-current="page">' + escapeHtml(article.title) + '</span>' : '');
  setSchema({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: SEO_ROOT },
    { "@type": "ListItem", position: 2, name: "مقاله‌ها", item: SEO_ROOT + "articles.html" },
    ...(article ? [{ "@type": "ListItem", position: 3, name: article.title }] : [])
  ] }, "breadcrumb-schema");
}
function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char])); }
function cleanArticleHtml(input) {
  const parsed = new DOMParser().parseFromString(String(input || ""), "text/html");
  const allowed = new Set(["P","BR","H2","H3","H4","UL","OL","LI","STRONG","B","EM","I","BLOCKQUOTE","A"]);
  const blocked = new Set(["SCRIPT","STYLE","IFRAME","OBJECT","SVG","MATH","FORM","INPUT","BUTTON"]);
  const copy = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent || "");
    if (node.nodeType !== Node.ELEMENT_NODE) return document.createDocumentFragment();
    const tag = node.tagName; if (blocked.has(tag)) return document.createDocumentFragment();
    const output = allowed.has(tag) ? document.createElement(tag.toLowerCase()) : document.createDocumentFragment();
    if (tag === "A" && output.nodeType === Node.ELEMENT_NODE) {
      try { const url = new URL(node.getAttribute("href") || "", location.origin); if (["https:","http:","mailto:"].includes(url.protocol)) { output.setAttribute("href", url.href); if (url.protocol !== "mailto:") { output.setAttribute("target", "_blank"); output.setAttribute("rel", "noopener noreferrer"); } } } catch {}
    }
    for (const child of node.childNodes) output.append(copy(child)); return output;
  };
  const clean = document.createDocumentFragment(); for (const child of parsed.body.childNodes) clean.append(copy(child));
  const holder = document.createElement("div"); holder.append(clean); return holder.innerHTML;
}
const safeImage = (value) => { try { const url = new URL(value); return ["https:","http:"].includes(url.protocol) ? url.href : ""; } catch { return ""; } };
function displayDate(value) { return value ? new Date(value).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" }) : ""; }
function renderCards(rows) {
  $("#article-results-count").textContent = `${rows.length.toLocaleString("fa-IR")} مقاله`;
  $("#public-article-empty").hidden = rows.length > 0;
  $("#public-article-grid").innerHTML = rows.map((article) => {
    const image = safeImage(article.cover_image_url);
    return `<a class="public-article-card" href="articles.html?slug=${encodeURIComponent(article.slug)}">${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(article.title)}" loading="lazy" />` : `<div class="article-card-placeholder" aria-hidden="true">⚗</div>`}<div class="public-article-card-copy"><div class="public-article-meta"><span>${escapeHtml(article.category || "مقاله")}</span><time>${displayDate(article.published_at || article.created_at)}</time></div><h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.excerpt || "برای خواندن ادامه این مقاله وارد شوید.")}</p><b>ادامه مقاله ←</b></div></a>`;
  }).join("");
}
async function start() {
  await (window.farmaSiteContentReady || Promise.resolve());
  if (!client) { $("#public-article-empty").hidden = false; setRobots("noindex,follow"); return; }
  const slug = new URLSearchParams(location.search).get("slug");
  const query = client.from("articles").select("id,title,slug,excerpt,body_html,cover_image_url,category,tags,status,published_at,created_at").eq("status", "published").order("published_at", { ascending: false });
  if (slug) {
    const { data, error } = await client.from("articles").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
    if (error || !data) { $("#articles-heading").textContent = "مقاله پیدا نشد"; $("#articles-lead").textContent = "این مقاله در دسترس نیست یا هنوز منتشر نشده است."; $("#article-list-view").hidden = true; $("#back-to-articles").hidden = false; document.title = "مقاله پیدا نشد | فارما لب کیمیا"; setMeta("description", "این مقاله در دسترس نیست یا هنوز منتشر نشده است."); setCanonical(SEO_ROOT + "articles.html"); setRobots("noindex,follow"); return; }
    $("#article-list-view").hidden = true; $("#public-article").hidden = false; $("#back-to-articles").hidden = false;
    $("#articles-heading").hidden = true; $("#articles-lead").hidden = true;
    $("#public-article-title").textContent = data.title;
    $("#public-article-category").textContent = data.category || "مقاله تخصصی";
    $("#public-article-date").textContent = displayDate(data.published_at || data.created_at);
    $("#public-article-excerpt").textContent = data.excerpt || ""; $("#public-article-excerpt").hidden = !data.excerpt;
    $("#public-article-body").innerHTML = cleanArticleHtml(data.body_html);
    const image = safeImage(data.cover_image_url); if (image) { $("#public-article-cover").src = image; $("#public-article-cover").alt = data.title; $("#public-article-cover").hidden = false; }
    $("#public-article-tags").innerHTML = (data.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    document.title = data.title + " | Farma Lab Kimia";
    const description = (data.excerpt || data.title).slice(0, 300);
    const canonical = SEO_ROOT + "articles.html?slug=" + encodeURIComponent(data.slug);
    setMeta("description", description); setMeta("og:type", "article", true); setMeta("og:title", document.title, true); setMeta("og:description", description, true); setMeta("og:url", canonical, true);
    if (image) setMeta("og:image", image, true);
    setMeta("twitter:title",document.title); setMeta("twitter:description",description);
    setCanonical(canonical); setRobots("index,follow"); setArticleBreadcrumbs(data);
    setSchema({
      "@context": "https://schema.org", "@type": "Article", headline: data.title, description,
      inLanguage: "fa-IR", mainEntityOfPage: canonical, publisher: { "@type": "Organization", name: "Farma Lab Kimia", url: SEO_ROOT },
      ...(image ? { image: [image] } : {}),
      ...(data.published_at ? { datePublished: data.published_at } : {}),
      ...(data.created_at ? { dateCreated: data.created_at } : {})
    });
    $("#share-article").addEventListener("click", async () => {
      const shareData = { title: data.title, url: location.href };
      try { if (navigator.share) await navigator.share(shareData); else { await navigator.clipboard.writeText(location.href); $("#share-article").textContent = "پیوند کپی شد"; } } catch {}
    });
    return;
  }
  const { data, error } = await query;
  if (error) { $("#articles-lead").textContent = "فهرست مقاله‌ها در حال آماده‌سازی است."; setRobots("noindex,follow"); return; }
  const rows = data || []; renderCards(rows);
  setCanonical(SEO_ROOT + "articles.html"); setMeta("og:url", SEO_ROOT + "articles.html", true); setArticleBreadcrumbs(null);
  setRobots(rows.length ? "index,follow" : "noindex,follow");
  $("#public-article-search").addEventListener("input", (event) => {
    const q = event.target.value.trim().toLocaleLowerCase();
    renderCards(rows.filter((article) => [article.title,article.excerpt,article.category,...(article.tags || [])].some((value) => String(value || "").toLocaleLowerCase().includes(q))));
  });
}
start();
