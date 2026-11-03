// Autentikasi superadmin (tahap awal, tanpa backend).
// PERINGATAN: pengecekan di sisi browser hanya menghalangi orang awam.
// Setelah ada backend, ganti isi login() agar memanggil API server.

const Auth = (() => {
  const KEY = "superadmin_session";

  function login(username, password) {
    const cfg = window.SUPERADMIN_CONFIG.admin;
    if (username === cfg.username && password === cfg.password) {
      sessionStorage.setItem(
        KEY,
        JSON.stringify({ user: username, at: new Date().toISOString() })
      );
      Log.add("login", "Superadmin masuk");
      return true;
    }
    Log.add("login_gagal", `Percobaan login gagal (${username || "kosong"})`);
    return false;
  }

  function logout() {
    Log.add("logout", "Superadmin keluar");
    sessionStorage.removeItem(KEY);
  }

  function session() {
    try {
      return JSON.parse(sessionStorage.getItem(KEY));
    } catch {
      return null;
    }
  }

  // Panggil di setiap halaman yang butuh login.
  // rootPath: "" untuk index.html, "../" untuk halaman di folder pages/
  function requireLogin(rootPath = "") {
    if (!session()) {
      window.location.href = rootPath + "index.html";
    }
  }

  return { login, logout, session, requireLogin };
})();
