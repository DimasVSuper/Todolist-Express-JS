# ValidateRequest

Ini adalah fungsi middleware yang menegakkan validasi schema Zod pada request masuk.

## Dimana lokasinya

- `src/security/validateRequest.js` mengekspor fungsi `validateRequest`.
- Digunakan di `src/routes/todos.js` untuk memvalidasi body dan params request.

## Cara kerja

Fungsi `validateRequest(schema, source = "body")`:

1. Mengambil schema Zod dan sumber (`"body"` atau `"params"`).
2. Mengurai input menggunakan schema.
3. Jika valid, mengganti input asli dengan data yang diurai (ditransformasi).
4. Jika tidak valid, mengembalikan `400 Bad Request` dengan detail error.

## Contoh penggunaan

Di routes:

```javascript
// Validasi body untuk POST /todos
router.post("/", validateRequest(createTodoSchema), createTodo);

// Validasi params untuk PUT /todos/:id
router.put("/:id", validateRequest(todoIdParamSchema, "params"), updateTodo);
```

## Mengapa ini berguna

- Memastikan hanya data valid yang mencapai controllers/services.
- Mencegah SQL injection dengan memvalidasi/mentransformasi input awal.
- Memberikan pesan error yang jelas untuk request tidak valid.

---

### Catatan
Middleware ini menghentikan alur request pada kegagalan validasi. Pasangkan dengan rate limiting dan logging untuk perlindungan penuh.
