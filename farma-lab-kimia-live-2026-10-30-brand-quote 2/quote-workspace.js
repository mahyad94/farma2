(() => {
  const drawer = document.querySelector("#quote-drawer");
  if (!drawer) return;
  const list = document.querySelector("#quote-items");
  const summary = document.querySelector("#quote-summary");
  const noteWrap = document.querySelector("#quote-note-wrap");
  const actions = drawer.querySelector(".quote-actions");
  const feedback = document.querySelector("#quote-feedback");
  let returnFocus = null;
  let wasOpen = false;

  function syncSummary() {
    const rows = list.querySelectorAll(".quote-item");
    const count = rows.length;
    const filled = [...list.querySelectorAll("[data-qty-input]")].filter(input => input.value.trim()).length;
    summary.hidden = count === 0;
    noteWrap.hidden = count === 0;
    summary.querySelector("[data-quote-total]").textContent = count.toLocaleString("fa-IR");
    summary.querySelector("[data-quote-ready]").textContent = filled === count && count
      ? "مقادیر وارد شده‌اند"
      : filled ? "مقدار " + filled.toLocaleString("fa-IR") + " از " + count.toLocaleString("fa-IR") + " محصول مشخص است"
      : "مقدار مورد نیاز را مشخص کنید";
    summary.classList.toggle("is-complete", count > 0 && filled === count);
    if (!count) {
      feedback.textContent = "";
      document.querySelector("#quote-copy-fallback").hidden = true;
    }
  }
  function syncChannels() {
    let count = 0;
    for (const id of ["#send-whatsapp", "#send-email"]) {
      const link = drawer.querySelector(id);
      const enabled = link.getAttribute("aria-disabled") === "false";
      link.hidden = !enabled;
      if (enabled) count++;
    }
    actions.dataset.channels = String(count);
    document.querySelector("#quote-channel-hint").hidden = count > 0;
  }
  function syncOpenState() {
    const open = drawer.getAttribute("aria-hidden") === "false";
    drawer.toggleAttribute("inert", !open);
    if (open && !wasOpen) {
      returnFocus = document.activeElement;
      drawer.querySelector("#quote-close").focus({ preventScroll: true });
      const trigger = document.querySelector("#quote-open");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
    } else if (!open && wasOpen) {
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
      const trigger = document.querySelector("#quote-open");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    }
    wasOpen = open;
  }
  new MutationObserver(syncSummary).observe(list, { childList: true });
  const channelObserver = new MutationObserver(syncChannels);
  for (const id of ["#send-whatsapp", "#send-email"]) channelObserver.observe(drawer.querySelector(id), { attributes: true, attributeFilter: ["aria-disabled"] });
  new MutationObserver(syncOpenState).observe(drawer, { attributes: true, attributeFilter: ["aria-hidden"] });
  list.addEventListener("input", syncSummary);
  list.addEventListener("error", event => {
    if (event.target instanceof HTMLImageElement) {
      const art = event.target.closest(".quote-item-art");
      if (art) art.textContent = "◈";
    }
  }, true);
  drawer.addEventListener("keydown", event => {
    if (event.key !== "Tab" || drawer.getAttribute("aria-hidden") !== "false") return;
    const focusable = [...drawer.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),summary')].filter(el => !el.closest("[hidden]") && el.getClientRects().length > 0);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  window.FarmaQuoteWorkspace = {
    async copyText(text) {
      const field = document.querySelector("#quote-prepared-message");
      const fallback = document.querySelector("#quote-copy-fallback");
      field.value = text;
      let copied = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          copied = true;
        }
      } catch {}
      if (!copied) {
        fallback.hidden = false;
        field.focus({ preventScroll: false });
        field.select();
        try { copied = document.execCommand("copy"); } catch {}
      }
      feedback.textContent = copied ? "متن درخواست کپی شد. آماده ارسال است." : "متن آماده است؛ آن را از کادر مشخص‌شده انتخاب و کپی کنید.";
      return copied;
    }
  };
  syncSummary();
  syncChannels();
  syncOpenState();
})();
