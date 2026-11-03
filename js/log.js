// Audit log: catat siapa melakukan apa dan kapan.
// Tahap awal disimpan di localStorage browser. Setelah ada backend,
// kirim ke server agar log tidak bisa dihapus dari browser.

const Log = (() => {
  const KEY = "superadmin_log";
  const MAX = 500;

  function all() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  }

  function add(action, detail) {
    const list = all();
    list.unshift({ time: new Date().toISOString(), action, detail });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  return { all, add, clear };
})();
