(() => {
  const records = () => (window.FARMA_CATALOG_IMPORTS || []).filter(p => p.active === true);
  const find = id => records().find(p => p.id === id) || null;
  window.FarmaProductPackages = {records, find, preview: () => null, previewFile: async () => null};
})();
