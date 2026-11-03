// Cara superadmin "bicara" ke Aplikasi Kasir.
// Tambahkan fungsi khusus kasir di sini kalau kasir sudah punya API,
// misalnya: laporan penjualan, daftar produk, daftar user.

(function () {
  const app = window.SUPERADMIN_CONFIG.apps.find((a) => a.id === "kasir");
  if (!app) return;

  const service = createService(app);

  // Contoh (aktifkan setelah kasir punya API):
  // service.laporanHariIni = () => service.get("/laporan/hari-ini");
  // service.daftarProduk   = () => service.get("/produk");

  window.Services = window.Services || {};
  window.Services.kasir = service;
})();
