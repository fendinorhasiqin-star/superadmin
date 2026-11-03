// Pembungkus dasar untuk bicara ke API sebuah aplikasi.
// Setiap file di js/services/ memakai ini.

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
