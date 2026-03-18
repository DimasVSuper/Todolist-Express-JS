# Logger

Proyek ini mencatat **setiap request HTTP** ke dalam file di `Log/Log.json`.

## Dimana lokasinya

- `src/security/logger.js` mengkonfigurasi middleware `morgan` yang menulis baris JSON.
- File log dibuat otomatis jika belum ada.

## Format log

Setiap baris di `Log/Log.json` adalah objek JSON yang berisi:

- `time`: timestamp ISO
- `remoteAddr`: IP klien
- `method`: metode HTTP
- `url`: path request
- `status`: kode status respons HTTP
- `responseTime`: waktu respons dalam ms
- `length`: panjang konten respons

Contoh:

```json
{"time":"2026-03-16T16:20:52.765Z","remoteAddr":"::1","method":"POST","url":"/todos","status":201,"responseTime":23.508,"length":"119"}
```

## Mengapa ini berguna

- Melacak siapa yang mengakses API dan kapan.
- Pasangkan dengan rate limiting untuk melihat dimana penyalahgunaan terjadi.
- Dapat digunakan untuk membangun analitik dasar atau jejak debugging.

---

### Catatan
Ini adalah logger berbasis file sederhana. Untuk produksi, pertimbangkan solusi rotasi log (misalnya, `winston` dengan `winston-daily-rotate-file`) atau mengirim log ke layanan eksternal.
