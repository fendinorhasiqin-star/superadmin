// Autentikasi superadmin memakai Firebase Auth.
// Akun dianggap superadmin hanya jika ada dokumen admins/{uid} di Firestore
// (dokumen itu hanya bisa dibuat lewat Firebase Console, lihat Firestore Rules).

const Auth = (() => {
  let readyPromise = null;

  async function isAdmin(user) {
    try {
      const snap = await fb.db.collection("admins").doc(user.uid).get();
      return snap.exists;
    } catch {
      return false;
    }
  }

  function pesan(code) {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Email atau password salah.";
      case "auth/invalid-email":
        return "Format email tidak valid.";
      case "auth/too-many-requests":
        return "Terlalu banyak percobaan. Coba lagi beberapa menit lagi.";
      case "auth/network-request-failed":
        return "Tidak ada koneksi internet.";
      case "auth/operation-not-supported-in-this-environment":
        return "Buka lewat http (Live Server) atau alamat online, bukan klik dua kali file HTML.";
      default:
        return "Login gagal. Coba lagi.";
    }
  }

  // Menunggu Firebase selesai memeriksa status login.
  // Hasil: user superadmin, atau null kalau belum login / bukan admin.
  function ready() {
    if (!readyPromise) {
      readyPromise = new Promise((resolve) => {
        const stop = fb.auth.onAuthStateChanged(async (user) => {
          stop();
          if (user && (await isAdmin(user))) {
            resolve(user);
          } else {
            if (user) await fb.auth.signOut();
            resolve(null);
          }
        });
      });
    }
    return readyPromise;
  }

  async function login(email, password) {
    try {
      const cred = await fb.auth.signInWithEmailAndPassword(email, password);
      if (!(await isAdmin(cred.user))) {
        await fb.auth.signOut();
        Log.add("login_ditolak", `Akun bukan superadmin (${email})`);
        return { ok: false, message: "Akun ini bukan superadmin." };
      }
      Log.add("login", `Superadmin masuk (${email})`);
      return { ok: true, user: cred.user };
    } catch (e) {
      Log.add("login_gagal", `Percobaan login gagal (${email || "kosong"})`);
      return { ok: false, message: pesan(e.code) };
    }
  }

  async function logout() {
    Log.add("logout", "Superadmin keluar");
    await fb.auth.signOut();
  }

  // Panggil di setiap halaman yang butuh login.
  // rootPath: "" untuk index.html, "../" untuk halaman di folder pages/
  // Hasil: user superadmin, atau null (dan halaman dialihkan ke login).
  async function requireLogin(rootPath = "") {
    const user = await ready();
    if (!user) window.location.href = rootPath + "index.html";
    return user;
  }

  return { login, logout, ready, requireLogin };
})();
