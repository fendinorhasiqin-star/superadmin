// Membuat sidebar yang sama di semua halaman.
// Pakai: <aside id="sidebar" data-active="apps"></aside>
// rootPath: "" untuk index.html, "../" untuk halaman di pages/

function renderSidebar(rootPath, pagesPath) {
  const el = document.getElementById("sidebar");
  if (!el) return;
  const active = el.dataset.active;

  const links = [
    { key: "dashboard", label: "Dashboard", href: rootPath + "index.html" },
    { key: "apps", label: "Aplikasi", href: pagesPath + "apps.html" },
    { key: "puyuhku", label: "Data Puyuhku", href: pagesPath + "puyuhku.html" },
    { key: "log", label: "Log Aktivitas", href: pagesPath + "log.html" },
  ];

  el.innerHTML =
    `<h1>Superadmin</h1>` +
    links
      .map(
        (l) =>
          `<a href="${l.href}" class="${l.key === active ? "active" : ""}">${l.label}</a>`
      )
      .join("") +
    `<a class="logout" id="btn-logout">Keluar</a>`;

  document.getElementById("btn-logout").addEventListener("click", async () => {
    await Auth.logout();
    window.location.href = rootPath + "index.html";
  });
}

function escapeHtml(str) {
  return String(str ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}
