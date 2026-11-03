// Cara superadmin "bicara" ke aplikasi Puyuhku (Firebase Firestore).
// Semua fungsi di sini HANYA MEMBACA data. Izin baca diatur oleh Firestore Rules
// (akun superadmin terdaftar di koleksi `admins`).

(function () {
  const app = window.SUPERADMIN_CONFIG.apps.find((a) => a.id === "puyuhku");
  if (!app) return;

  const service = createService(app);

  // Daftar dokumen di koleksi `users` (maksimal 100)
  service.listUsers = async () => {
    const snap = await fb.db.collection("users").limit(100).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
