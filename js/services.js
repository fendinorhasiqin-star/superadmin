// Service aplikasi: cara superadmin "bicara" ke tiap aplikasi.
// Dimuat setelah js/core.js.

window.Services = window.Services || {};

// ===== Aplikasi Kasir =====
// Tambahkan fungsi khusus kasir di sini kalau kasir sudah punya API,
// misalnya: laporan penjualan, daftar produk, daftar user.
(function () {
  const app = window.SUPERADMIN_CONFIG.apps.find((a) => a.id === "kasir");
  if (!app) return;

  const service = createService(app);

  // Contoh (aktifkan setelah kasir punya API):
  // service.laporanHariIni = () => service.get("/laporan/hari-ini");
  // service.daftarProduk   = () => service.get("/produk");

  window.Services.kasir = service;
})();

// ===== Puyuhku (Firebase Firestore) =====
// Semua fungsi di sini HANYA MEMBACA data. Izin baca diatur oleh Firestore Rules
// (akun superadmin terdaftar di koleksi `admins`).
(function () {
  const app = window.SUPERADMIN_CONFIG.apps.find((a) => a.id === "puyuhku");
  if (!app) return;

  const service = createService(app);
  const names = app.subcollections || [];

  // Daftar pengguna. Dokumen users/{uid} di puyuhku tidak ada (hanya subkoleksi),
  // jadi daftar dibuat dari semua dokumen di subkoleksi (collection group query),
  // dikelompokkan per uid, beserta jumlah datanya.
  // Catatan: tiap dokumen yang terbaca dihitung sebagai 1 read Firestore (maks 500 per subkoleksi).
  service.listUsers = async () => {
    const found = {};
    const ensure = (uid) => {
      if (!found[uid]) {
        found[uid] = { id: uid };
        names.forEach((n) => (found[uid][n] = 0));
      }
      return found[uid];
    };

    // Kalau suatu saat dokumen users/{uid} ada (profil), ikut ditampilkan.
    // Dibungkus try/catch supaya daftar tetap jalan walau aturan baca koleksi users belum ada.
    try {
      const usersSnap = await fb.db.collection("users").limit(100).get();
      usersSnap.forEach((d) => Object.assign(ensure(d.id), d.data()));
    } catch (e) {
      if (e.code !== "permission-denied") throw e;
    }

    for (const name of (app.discover || names)) {
      const snap = await fb.db.collectionGroup(name).limit(500).get();
      snap.forEach((d) => {
        const userDoc = d.ref.parent.parent; // users/{uid}
        if (!userDoc || userDoc.parent.id !== "users") return;
        const u = ensure(userDoc.id);
        if (name === "meta") {
          // users/{uid}/meta/settings = profil yang disimpan aplikasi PuyuhKu
          if (d.id === "settings") {
            const st = d.data() || {};
            if (st.ownerEmail) u.email = st.ownerEmail;
            if (st.ownerCreatedAt) u.createdAt = st.ownerCreatedAt;
            if (st.farmName) u.farmName = st.farmName;
          }
          return;
        }
        u[name] = (u[name] || 0) + 1;
      });
    }
    return Object.values(found);
  };

  // Isi subkoleksi milik satu user, misalnya users/{uid}/expenses (maksimal 2000)
  service.listSub = async (uid, name, max = 2000) => {
    const snap = await fb.db
      .collection("users")
      .doc(uid)
      .collection(name)
      .limit(max)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

  window.Services.puyuhku = service;
})();
