# Daftar Aplikasi

Catat setiap aplikasi yang dikelola superadmin di sini, supaya tidak lupa.

| Id | Nama | URL | Data | Stack | Catatan |
|----|------|-----|------|-------|---------|
| kasir | Aplikasi Kasir | (isi) | belum ada | HTML (home.html) | Data masih lokal |
| puyuhku | Puyuhku | (isi) | Firebase Firestore (project bisnis-puyuh) | Web + Firebase Auth | Superadmin hanya baca; data di `users/{uid}/...` |

## Cara menambah aplikasi baru

1. Tambah objek baru di `js/config.js` (bagian `apps`).
2. Salin `js/services/_template.js` menjadi `js/services/nama-app.js`, sesuaikan id-nya.
3. Tambah satu baris `<script>` untuk file itu di `pages/apps.html`.
4. Catat aplikasinya di tabel di atas.

## Aturan akses Firebase (Firestore Rules)

Superadmin boleh MEMBACA `users/**` hanya jika akunnya terdaftar sebagai dokumen
`admins/{uid}` di Firestore. Dokumen `admins` hanya bisa dibuat lewat Firebase Console.
Salinan rules yang dipakai ada di `docs/firestore.rules`.
