# Dokumentasi Keamanan

Layanan ini menyertakan beberapa langkah keamanan untuk melindungi API dari penyalahgunaan.

## 1) Pembatasan tingkat (Rate limiting)

Diimplementasikan via `express-rate-limit`.

- Pembatasan tingkat global (berlaku untuk semua route): dikonfigurasi oleh env vars:
  - `RATE_LIMIT_WINDOW_MS`
  - `RATE_LIMIT_MAX`

- Batas spesifik route (misalnya, endpoint mutasi `/todos`): dikonfigurasi oleh env vars:
  - `RATE_LIMIT_CREATE_TODO_WINDOW_MS`
  - `RATE_LIMIT_CREATE_TODO_MAX`
  - `RATE_LIMIT_MUTATION_WINDOW_MS`
  - `RATE_LIMIT_MUTATION_MAX`

### Cara kerja
Request yang melebihi batas tingkat menerima: `429 Too Many Requests`.

## 2) Validasi request (sanitasi input)

Validasi ditangani oleh **Zod** di `src/security/validators.js`.

- Body/params request yang tidak valid mengembalikan `400 Bad Request`.
- Mencegah request rusak mencapai database.

## 3) CORS

CORS dikunci menggunakan middleware `cors()` dengan origin yang diizinkan:
- Dikonfigurasi via variabel lingkungan `CORS_ORIGINS`.
- Default ke `http://localhost:3000`.

## 4) Header keamanan HTTP

`helmet()` digunakan untuk mengatur header HTTP aman (CSP, perlindungan XSS, dll.).

## 5) Logging

Request dicatat ke: `Log/Log.json`.

Setiap baris log berisi:
- timestamp
- IP remote
- method + URL
- kode status
- waktu respons

---

## Tips

- Untuk test pembatasan tingkat, hit endpoint berulang hingga menerima `429`.
- Untuk mencegah log membengkak, pertimbangkan menambah rotasi log atau filtering (tidak diimplementasikan di sini).
