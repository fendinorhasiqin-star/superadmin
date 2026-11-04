// Inti superadmin: Firebase, log aktivitas, autentikasi, helper, dan pembungkus service.
// Dimuat setelah js/config.js.

// ===== Firebase =====
firebase.initializeApp(window.SUPERADMIN_CONFIG.firebase);
const fb = { auth: firebase.auth(), db: firebase.firestore() };

// ============================================================
// Log aktivitas
// ============================================================
// Audit log: catat siapa melakukan apa dan kapan.
// Tahap awal disimpan di localStorage browser. Setelah ada backend,
// kirim ke server agar log tidak bisa dihapus dari browser.

const Log = (() => {
  const KEY = "superadmin_log";
  const MAX = 500;

  function all() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  }

  function add(action, detail) {
    const list = all();
    list.unshift({ time: new Date().toISOString(), action, detail });
    try {
      localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    } catch {}
  }

  function clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {}
  }

  return { all, add, clear };
})();

// ============================================================
// Auth
// ============================================================
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
      case "auth/unauthorized-domain":
        return "Domain halaman ini belum diizinkan di Firebase. Tambahkan di Authentication → Settings → Authorized domains.";
      case "auth/operation-not-allowed":
        return "Metode login Email/Password belum diaktifkan di Firebase Authentication.";
      case "auth/user-disabled":
        return "Akun ini dinonaktifkan di Firebase.";
      case "auth/invalid-api-key":
      case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
        return "API key Firebase tidak valid. Periksa konfigurasi di config.js.";
      case "auth/internal-error":
        return "Terjadi kesalahan di layanan Firebase. Coba lagi sebentar lagi.";
      default:
        return code ? `Login gagal (kode: ${code}). Coba lagi.` : "Login gagal. Coba lagi.";
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

  return { login, logout, ready };
})();

// ============================================================
// Helper
// ============================================================
function escapeHtml(str) {
  return String(str ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

// ============================================================
// Pembungkus dasar untuk bicara ke API sebuah aplikasi.
// Dipakai oleh js/services.js.
// ============================================================
function createService(app) {
  async function request(path, options = {}) {
    if (!app.api) {
      throw new Error(`Aplikasi "${app.name}" belum punya URL API.`);
    }
    const res = await fetch(app.api + path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(`Gagal (${res.status}) ke ${app.name}`);
    return res.json();
  }

  return {
    app,
    // Cek apakah aplikasi bisa dijangkau
    async ping() {
      try {
        await fetch(app.url, { mode: "no-cors" });
        return true;
      } catch {
        return false;
      }
    },
    get: (path) => request(path),
    post: (path, body) =>
      request(path, { method: "POST", body: JSON.stringify(body) }),
  };
}
