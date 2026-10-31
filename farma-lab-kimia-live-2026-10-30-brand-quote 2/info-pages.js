(() => {
  let channels = { whatsapp: "", email: "" };
  const nav = document.querySelector("#nav");
  const toggle = document.querySelector("#menu-toggle");
  function closeMenu() {
    nav.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    window.FarmaNavigation?.closeAll();
  }
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
    if (!open) window.FarmaNavigation?.closeAll();
  });
  nav.addEventListener("click", event => { if (event.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
  function refresh() {
    let count = 0;
    try { count = new Map(JSON.parse(localStorage.getItem("farma-lab-kimia-quote-v1") || "[]")).size; } catch {}
    document.querySelector("#quote-count").textContent = String(count);
    const settings = window.FARMA_SITE_CONTENT || {};
    const whatsapp = String(settings.contact_whatsapp || "").replace(/\D/g, "");
    const email = String(settings.contact_email || "").trim();
    const validWhatsApp = /^\d{8,15}$/.test(whatsapp);
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    channels = { whatsapp: validWhatsApp ? whatsapp : "", email: validEmail ? email : "" };
    const waButton = document.querySelector("#inquiry-whatsapp");
    const emailButton = document.querySelector("#inquiry-email");
    if (waButton) waButton.hidden = !validWhatsApp;
    if (emailButton) emailButton.hidden = !validEmail;
    const waLink = document.querySelector("#contact-whatsapp");
    const emailLink = document.querySelector("#contact-email");
    if (waLink) {
      waLink.hidden = !validWhatsApp;
      if (validWhatsApp) {
        waLink.href = "https://wa.me/" + whatsapp;
        document.querySelector("#contact-whatsapp-value").textContent = "+" + whatsapp;
      }
    }
    if (emailLink) {
      emailLink.hidden = !validEmail;
      if (validEmail) {
        emailLink.href = "mailto:" + email;
        document.querySelector("#contact-email-value").textContent = email;
      }
    }
    const notice = document.querySelector("#contact-unavailable");
    if (notice) notice.hidden = validWhatsApp || validEmail;
    try {
      const categories = JSON.parse(settings.catalog_categories || "null");
      if (Array.isArray(categories)) window.FarmaNavigation?.setCatalog({categories:categories.filter(item=>item?.name && item.visible!==false)});
    } catch {}
  }
  const form = document.querySelector("#inquiry-form");
  if (form) {
    const status = document.querySelector("#inquiry-status");
    const preview = document.querySelector("#inquiry-preview");
    const previewText = document.querySelector("#inquiry-preview-text");
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const value = selector => form.querySelector(selector).value.trim();
      const lines = ["سلام، برای محصول زیر درخواست استعلام قیمت و شرایط تأمین دارم:", "", "محصول / موضوع: " + value("#inquiry-topic")];
      const name = value("#inquiry-name");
      const quantity = value("#inquiry-quantity");
      const code = value("#inquiry-code");
      const brand = value("#inquiry-brand");
      const message = value("#inquiry-message");
      if (code) lines.push("شماره کاتالوگ / CAS: " + code);
      if (brand) lines.push("برند مورد نظر: " + brand);
      if (quantity) lines.push("مقدار مورد نیاز: " + quantity);
      if (name) lines.push("نام / سازمان: " + name);
      if (message) lines.push("", "توضیحات:", message);
      lines.push("", "لطفاً اطلاعات محصول و شرایط تأمین را اعلام کنید.");
      const text = lines.join("\n");
      previewText.value = text;
      preview.hidden = false;
      const channel = event.submitter?.value || "copy";
      if (channel === "whatsapp" && channels.whatsapp) {
        window.open("https://wa.me/" + channels.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
        status.textContent = "متن آماده شد. برای ارسال، پیام را در واتساپ بررسی و تأیید کنید.";
      } else if (channel === "email" && channels.email) {
        location.href = "mailto:" + channels.email + "?subject=" + encodeURIComponent("استعلام محصول | Farma Lab Kimia") + "&body=" + encodeURIComponent(text);
        status.textContent = "متن آماده شد. ارسال درخواست را در برنامه ایمیل تکمیل کنید.";
      } else {
        let copied = false;
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            copied = true;
          }
        } catch {}
        if (!copied) {
          previewText.focus();
          previewText.select();
          try { copied = document.execCommand("copy"); } catch {}
        }
        status.textContent = copied
          ? "متن درخواست کپی شد؛ می‌توانید آن را در پیام‌رسان یا ایمیل خود ارسال کنید."
          : "متن درخواست آماده است. از کادر زیر آن را انتخاب و کپی کنید.";
      }
    });
  }
  window.addEventListener("farma-settings-applied", refresh);
  window.addEventListener("storage", refresh);
  refresh();
})();
