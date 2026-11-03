# Superadmin

Dashboard untuk mengelola beberapa aplikasi dari satu tempat.
Dibuat dengan HTML, CSS, dan JavaScript biasa (tanpa framework, tanpa build).

## Struktur

```
superadmin/
├── index.html            # login + dashboard
├── pages/
│   ├── apps.html         # daftar aplikasi + cek status
│   └── log.html          # log aktivitas
├── js/
│   ├── config.example.js # contoh konfigurasi (salin jadi config.js)
│   ├── config.js         # konfigurasi asli (tidak di-commit)
│   ├── auth.js           # login & sesi
│   ├── log.js            # audit log
│   ├── layout.js         # sidebar bersama
│   └── services/
│       ├── base.js       # pembungkus fetch dasar
│       ├── kasir.js      # service aplikasi kasir
│       └── _template.js  # template untuk aplikasi baru
├── css/style.css
├── docs/apps.md          # catatan daftar aplikasi
└── .gitignore
```

## Cara menjalankan

1. Salin `js/config.example.js` menjadi `js/config.js`.
2. Isi username, password, dan daftar aplikasi di `config.js`.
3. Buka `index.html` di browser (atau pakai Live Server di VS Code).

## Menambah aplikasi baru

Satu aplikasi = satu file di `js/services/`. Langkah lengkap ada di `docs/apps.md`.

## Penting: soal keamanan

Versi awal ini **belum punya backend**, jadi:

- Login hanya pengecekan di browser. Itu cuma penghalang tampilan, bukan keamanan sungguhan.
- Password ada di `config.js` yang terbaca oleh siapa pun yang bisa membuka halaman ini.
- Audit log disimpan di browser (localStorage) dan bisa dihapus.

Kalau superadmin akan di-online-kan atau mengendalikan data penting
(misalnya data penjualan kasir), pindahkan login dan log ke server
(contoh: Supabase atau Firebase Auth) sebelum dipakai sungguhan.
Hanya `js/auth.js` dan `js/log.js` yang perlu diganti, halaman lain tidak berubah.

## Langkah berikutnya

- [ ] Isi URL asli aplikasi kasir di `config.js`
- [ ] Tentukan tempat data bersama (Supabase/Firebase) kalau mau kontrol jarak jauh
- [ ] Tambah aplikasi lain lewat `_template.js`
