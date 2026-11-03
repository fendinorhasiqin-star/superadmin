// Menyalakan Firebase (Auth + Firestore) memakai konfigurasi di config.js.
// Dimuat setelah script Firebase SDK dan config.js.

firebase.initializeApp(window.SUPERADMIN_CONFIG.firebase);

const fb = {
  auth: firebase.auth(),
  db: firebase.firestore(),
};
