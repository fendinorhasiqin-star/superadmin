// Konfigurasi superadmin.
// File ini TIDAK berisi password, jadi aman di-commit.
// Kunci Firebase memang bersifat publik (terbaca di setiap aplikasi web);
// yang menjaga data tetap aman adalah Firestore Rules di Firebase Console.

window.SUPERADMIN_CONFIG = {
  // Project Firebase yang dipakai superadmin (sama dengan puyuhku)
  firebase: {
    apiKey: "AIzaSyAEL9Av_OrHW1zt-0REnZoymXM-Qeg5zfQ",
    authDomain: "bisnis-puyuh.firebaseapp.com",
    projectId: "bisnis-puyuh",
    storageBucket: "bisnis-puyuh.firebasestorage.app",
    messagingSenderId: "226784274230",
    appId: "1:226784274230:web:2474888a57facb56117597",
    measurementId: "G-CZ694MG0DX",
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
    {
      id: "puyuhku",
      name: "Puyuhku",
      description: "Aplikasi bisnis puyuh (Firebase Auth + Firestore).",
      // Isi dengan alamat aplikasi puyuhku kalau sudah online
      url: "https://fendinorhasiqin-star.github.io/bisnispuyuh",
      firebase: true,
      // Subkoleksi di bawah users/{uid} (nama sesuai aplikasi.html PuyuhKu).
      // Kalau menambah di sini, tambahkan juga aturannya di firestore.rules
      // (termasuk aturan collection group untuk membaca lintas pengguna).
      subcollections: ["expenses", "sales", "incomes", "production", "damaged", "deaths"],
      // Subkoleksi yang dipindai untuk menemukan daftar pengguna (lebih hemat read).
      // "meta" berisi users/{uid}/meta/settings: email, tanggal daftar, dan nama peternakan.
      discover: ["meta", "sales", "expenses", "production"],
    },
  ],
};
