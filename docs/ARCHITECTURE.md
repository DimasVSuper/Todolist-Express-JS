# Gambaran Arsitektur

Proyek ini disusun untuk kejelasan, pemisahan tanggung jawab, dan kemudahan ekstensi.

## 🧱 Lapisan

### 1) **Titik Masuk**
- `index.js` mem-boot aplikasi dengan memuat `.env` dan memulai server.

### 2) **Server / Aplikasi**
- `src/server.js`: memuat variabel lingkungan dan memulai Express.
- `src/app.js`: mengonfigurasi middleware Express (CORS, Helmet, logging, rate-limiting) dan memasang rute.

### 3) **Routing**
- `src/routes/todos.js`: mendefinisikan jalur rute dan melampirkan middleware (validasi, rate limiting).

### 4) **Controller**
- `src/controllers/todoController.js`: menangani logika permintaan/respons dan memanggil layanan.

### 5) **Layanan**
- `src/services/todoService.js`: berisi logika akses bisnis/data menggunakan Prisma.

### 6) **Database (Prisma)**
- `prisma/schema.prisma`: model data dan sumber data.
- `prisma/migrations/`: riwayat migrasi yang dihasilkan otomatis.

### 7) **Keamanan / Middleware**
- `src/security/rateLimiter.js`: rate limiting global + per-rute.
- `src/security/validators.js`: skema zod untuk validasi permintaan.
- `src/security/validateRequest.js`: middleware untuk menegakkan validasi skema.
- `src/security/logger.js`: logging permintaan (JSON ke `Log/Log.json`).

---

## 🔁 Alur Data (Contoh: Buat Todo)

1. Permintaan mencapai `src/routes/todos.js`.
2. Middleware validasi memeriksa badan permintaan.
3. Rate limiter memeriksa tingkat permintaan.
4. Controller (`createTodo`) memanggil layanan (`createTodoService`).
5. Layanan menulis ke database melalui Prisma.
6. Respons dikembalikan ke klien.

---

## 🧩 Memperluas Arsitektur

Untuk menambahkan fitur baru (misalnya, `users`, `comments`):
1. Tambahkan model Prisma
2. Buat layanan + controller + rute
3. Tambahkan validasi + aturan keamanan apa pun
4. Kaitkan ke `src/app.js` (daftarkan rute baru)
