// TEMPLATE untuk aplikasi baru.
// 1. Salin file ini, ganti namanya jadi nama-aplikasi.js
// 2. Ganti "id-aplikasi" dengan id yang sama di js/config.js
// 3. Tambahkan <script> file ini di halaman yang memakainya
//    (pages/apps.html dan index.html bagian dashboard)

(function () {
  const app = window.SUPERADMIN_CONFIG.apps.find((a) => a.id === "id-aplikasi");
  if (!app) return;

  const service = createService(app);

  // Tambahkan fungsi khusus aplikasi ini di sini

  window.Services = window.Services || {};
  window.Services["id-aplikasi"] = service;
})();
