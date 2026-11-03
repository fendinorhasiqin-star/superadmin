# Superadmin

Dashboard untuk mengelola beberapa aplikasi dari satu tempat.
Dibuat dengan HTML, CSS, dan JavaScript biasa (tanpa framework, tanpa build).
Login memakai Firebase Auth, data puyuhku dibaca dari Firestore.

## Struktur

```
superadmin/
├── index.html            # login + dashboard
├── pages/
│   ├── apps.html         # daftar aplikasi + cek status
│   ├── puyuhku.html      # data puyuhku (Firestore, hanya baca)
│   └── log.html          # log aktivitas
├── js/
│   ├── config.js         # konfigurasi Firebase + daftar aplikasi
│   ├── firebase.js       # menyalakan Firebase
│   ├── auth.js           # login Firebase + cek admin
│   ├── log.js            # log aktivitas (di browser)
│   ├── layout.js         # sidebar bersama
│   └── services/
│       ├── base.js       # pembungkus dasar
│       ├── kasir.js      # service aplikasi kasir
│       ├── puyuhku.js    # service puyuhku (Firestore)
│       └── _template.js  # template untuk aplikasi baru
├── css/style.css
├── docs/
│   ├── apps.md           # catatan daftar aplikasi
│   └── firestore.rules   # salinan Firestore Rules
└── .gitignore
```

## Cara menjalankan

Buka lewat server lokal, jangan klik dua kali file HTML-nya
(Firebase Auth tidak jalan dari `file://`).
Di VS Code: klik kanan `index.html`, lalu **Open with Live Server**.
Login dengan akun superadmin yang dibuat di Firebase Authentication.

## Menjadikan sebuah akun superadmin

1. Buat user di Firebase Console, lalu **Authentication**, lalu **Users**.
2. Di **Firestore Database**, buat dokumen di koleksi `admins` dengan Document ID = UID user itu.

Akun yang tidak punya dokumen `admins/{uid}` ditolak, walaupun emailnya benar.

## Menambah aplikasi baru

Satu aplikasi = satu file di `js/services/`. Langkah lengkap ada di `docs/apps.md`.

## Soal keamanan

- Tidak ada password di kode. Kunci Firebase di `config.js` memang publik;
  data dijaga oleh Firestore Rules (`docs/firestore.rules`).
- Superadmin saat ini hanya bisa **membaca** data user. Jangan menambah izin tulis
  tanpa dipikirkan.
- Jangan pernah menyimpan service account key atau private key Firebase di repo.
- Log aktivitas masih disimpan di browser (localStorage), jadi bisa dihapus.
  Kalau perlu log yang kuat, simpan ke Firestore lewat server.

## Langkah berikutnya

- [ ] Isi URL asli puyuhku dan kasir di `js/config.js`
- [ ] Lihat data `users` dan `expenses` di halaman Data Puyuhku
- [ ] Tambah ringkasan (total pengeluaran, jumlah user)
