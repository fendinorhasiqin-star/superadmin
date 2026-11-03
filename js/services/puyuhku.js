// Cara superadmin "bicara" ke aplikasi Puyuhku (Firebase Firestore).
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

    // Kalau suatu saat dokumen users/{uid} ada (profil), ikut ditampilkan
    const usersSnap = await fb.db.collection("users").limit(100).get();
    usersSnap.forEach((d) => Object.assign(ensure(d.id), d.data()));

    for (const name of names) {
      const snap = await fb.db.collectionGroup(name).limit(500).get();
      snap.forEach((d) => {
        const userDoc = d.ref.parent.parent; // users/{uid}
        if (!userDoc || userDoc.parent.id !== "users") return;
        ensure(userDoc.id)[name] += 1;
      });
    }
    return Object.values(found);
  };

  // Isi subkoleksi milik satu user, misalnya users/{uid}/expenses (maksimal 200)
  service.listSub = async (uid, name, max = 200) => {
    const snap = await fb.db
      .collection("users")
      .doc(uid)
      .collection(name)
      .limit(max)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

  window.Services = window.Services || {};
  window.Services.puyuhku = service;
})();
