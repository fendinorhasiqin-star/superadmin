// Salin file ini menjadi js/config.js lalu isi sesuai kebutuhan.
// js/config.js sudah masuk .gitignore, jadi tidak ikut ter-commit.

window.SUPERADMIN_CONFIG = {
  // Akun superadmin sementara (tahap awal, tanpa backend).
  // GANTI username & password ini sebelum dipakai.
  // Catatan: ini hanya penghalang tampilan. Untuk keamanan sungguhan,
  // login harus diverifikasi oleh server (lihat README).
  admin: {
    username: "superadmin",
    password: "123456",
  },

  // Daftar aplikasi yang dikelola. Tambah satu objek per aplikasi.
  apps: [
    {
      id: "kasir",
      name: "Aplikasi Kasir",
      description: "Aplikasi kasir (POS) untuk penjualan harian.",
      url: "https://contoh.com/kasir/home.html",
      // URL API aplikasi (kosongkan jika belum punya backend)
      api: "",
    },
  ],
};
