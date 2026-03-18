# Validator

Proyek ini menggunakan **Zod** untuk validasi input guna memastikan permintaan terbentuk dengan baik dan mencegah injeksi SQL atau data yang tidak terbentuk lainnya mencapai database.

## Dimana lokasinya

- `src/security/validators.js` mendefinisikan skema.
- Skema ini digunakan dalam middleware `src/security/validateRequest.js`.

## Skema

### `todoIdParamSchema`

Memvalidasi parameter `id` dalam rute seperti `/todos/:id`.

- Harus berupa string yang cocok dengan `/^[0-9]+$/` (bilangan bulat positif).
- Ditransformasi menjadi angka.

Contoh: `"123"` → `123`

### `createTodoSchema`

Memvalidasi body untuk membuat todo (`POST /todos`).

- `title`: string, min 1 karakter, maks 255 karakter.

Contoh: `{ "title": "Beli susu" }`

### `updateTodoSchema`

Memvalidasi body untuk memperbarui todo (`PUT /todos/:id`).

- `title`: string opsional, min 1 karakter, maks 255 karakter.
- `completed`: boolean opsional.

Contoh: `{ "completed": true }`

## Mengapa ini berguna

- Mencegah data tidak valid diproses.
- Mengembalikan `400 Bad Request` dengan detail kesalahan jika validasi gagal.
- Bertindak sebagai garis pertahanan pertama terhadap input berbahaya.

---

### Catatan
Zod menyediakan validasi yang aman tipe. Untuk produksi, pertimbangkan untuk menambahkan validasi yang lebih kompleks (misalnya, sanitasi) jika diperlukan.
