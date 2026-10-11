# TaskMate
TaskMate adalah aplikasi pengelolaan tugas mahasiswa yang membantu pengguna mencatat tugas kuliah, mengatur tenggat waktu, dan memantau penyelesaian tugas dalam satu aplikasi.
Fitur Utama
- Menambahkan tugas kuliah.
- Menampilkan daftar tugas.
- Menandai tugas yang sudah selesai atau belum selesai.
- Menghapus tugas.
- Login pengguna.
- Menyimpan data tugas menggunakan Firebase Cloud Firestore.

Teknologi yang Digunakan
Frontend
- React Native
- Expo
- TypeScript
Backend dan Database
- Firebase Authentication
- Firebase Cloud Firestore
Struktur Proyek
- `TaskMateMobile/` — kode aplikasi mobile.
- `TaskMateBackend/` — kode backend Express.js.
- `README.md` — dokumentasi proyek.

Cara Menjalankan Aplikasi
Aplikasi Mobile
1. Pastikan Node.js sudah terpasang.
2. Buka terminal di folder `TaskMateMobile`.
3. Jalankan perintah:
   `npm install`
4. Jalankan aplikasi dengan perintah:
   `npx expo start`
Backend
1. Buka terminal di folder `TaskMateBackend`.
2. Jalankan perintah:

   `npm install`

3. Jalankan server:

   `node server.js`

Catatan:Konfigurasi koneksi frontend dan backend perlu disesuaikan dengan lingkungan yang digunakan. Jangan membagikan kredensial atau informasi rahasia di repositori publik.
Status Proyek

Proyek ini dikembangkan sebagai bagian dari pembelajaran Mobile Programming.
