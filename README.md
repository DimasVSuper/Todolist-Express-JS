# API Todolist

API Todo sederhana yang aman dan terstruktur menggunakan **Express.js + Prisma + MySQL** dengan fitur keamanan bawaan seperti rate limiting, validasi input, CORS, dan logging.

---

## Quick Start

### Persyaratan
- Node.js v16+
- MySQL 8.0+
- npm atau yarn

### Instalasi

1. Clone repository dan install dependencies:
   ```bash
   git clone <repo-url>
   cd express-todolist
   npm install
   ```

2. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
   Update `DATABASE_URL` dengan kredensial MySQL Anda:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/todolist"
   ```

3. Generate & apply migrasi database:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Jalankan server (mode development):
   ```bash
   npm run dev
   ```

Server akan berjalan di `http://localhost:3000`

---

## Endpoint API

| Method | Path | Deskripsi | Request Body | Response |
|--------|------|-----------|--------------|----------|
| GET | `/` | Health check | — | `{ message: "TodoList API is running" }` |
| GET | `/todos` | Daftar semua todos | — | `Todo[]` |
| POST | `/todos` | Buat todo baru | `{ title: string }` | `Todo` (201) |
| PUT | `/todos/:id` | Update todo | `{ title?: string, completed?: boolean }` | `Todo` |
| DELETE | `/todos/:id` | Hapus todo | — | (204) |

### Contoh Response Todo
```json
{
  "id": 1,
  "title": "Beli kopi",
  "completed": false,
  "createdAt": "2026-03-16T16:20:52.765Z",
  "updatedAt": "2026-03-16T16:20:52.765Z"
}
```

---

## Testing API

### Dengan cURL

#### 1) Health Check
```bash
curl http://localhost:3000
```

#### 2) Buat todo
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Beli kopi"}'
```

#### 3) Daftar todos
```bash
curl http://localhost:3000/todos
```

#### 4) Update todo
```bash
curl -X PUT http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

#### 5) Hapus todo
```bash
curl -X DELETE http://localhost:3000/todos/1
```

### Test Rate Limiting
```bash
for i in {1..30}; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/todos \
    -H "Content-Type: application/json" \
    -d '{"title":"test"}'
done
```
Setelah 20 requests, Anda akan menerima `429 Too Many Requests`.

---

## Fitur Keamanan

Proyek ini dilengkapi dengan beberapa lapisan keamanan:

### 1. Rate Limiting
- **Global:** 100 requests per 15 menit (untuk semua route)
- **POST /todos:** 20 requests per 15 menit (per IP)
- **PUT/DELETE /todos/:id:** 50 requests per 15 menit (per IP)
- Dikonfigurasi via environment variables

### 2. Input Validation
- Menggunakan **Zod** untuk validasi schema
- Mencegah SQL injection dan malformed requests
- Return `400 Bad Request` dengan pesan error detail

### 3. CORS Protection
- Origin dibatasi via `CORS_ORIGINS` env var
- Default: `http://localhost:3000`

### 4. Security Headers
- Menggunakan **Helmet.js** untuk set secure HTTP headers
- Proteksi terhadap XSS, clickjacking, dll.

### 5. Request Logging
- Setiap request dicatat ke `Log/Log.json`
- Format JSON untuk mudah parsing

Lihat [docs/Security/](docs/Security/) untuk detail lengkap.

---

## Struktur Folder

```
express-todolist/
├── index.js                          # Entry point
├── package.json                      # Dependencies & scripts
├── .env                              # Environment variables (git ignored)
├── .env.example                      # Template env variables
├── .gitignore                        # Git ignore patterns
│
├── src/
│   ├── app.js                        # Express app setup + middleware
│   ├── server.js                     # Server startup
│   │
│   ├── controllers/
│   │   └── todoController.js         # Request handlers (list, create, update, delete)
│   │
│   ├── services/
│   │   └── todoService.js            # Business logic & database operations (Prisma)
│   │
│   ├── routes/
│   │   └── todos.js                  # Route definitions + validation + rate limiting
│   │
│   ├── lib/
│   │   └── prisma.js                 # Prisma Client singleton instance
│   │
│   └── security/
│       ├── rateLimiter.js            # Global & per-route rate limiting config
│       ├── validators.js             # Zod schemas untuk validasi request
│       ├── validateRequest.js         # Middleware untuk enforce validation
│       └── logger.js                 # Morgan logging config (JSON to file)
│
├── prisma/
│   ├── schema.prisma                 # Data model & datasource
│   └── migrations/
│       └── 20260316161030_init/      # Migration history
│
├── docs/
│   ├── ARCHITECTURE.md               # Architecture overview & data flow
│   └── Security/
│       ├── README.md                 # Security features summary
│       ├── RateLimiter.md            # Rate limiting detail
│       ├── Logger.md                 # Logging detail
│       ├── Validators.md             # Validation schemas
│       └── ValidateRequest.md        # Validation middleware
│
├── Log/
│   └── Log.json                      # Request logs (JSON lines)
│
└── node_modules/                     # Dependencies (git ignored)
```

---

## Konfigurasi Environment Variables

Update `.env` dengan pengaturan Anda:

```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/db_todolist"

# CORS
CORS_ORIGINS="http://localhost:3000"  # Comma-separated origins

# Rate Limiting Global
RATE_LIMIT_WINDOW_MS=900000           # 15 menit (ms)
RATE_LIMIT_MAX=100                    # Max requests per window

# Rate Limiting - POST /todos
RATE_LIMIT_CREATE_TODO_WINDOW_MS=900000
RATE_LIMIT_CREATE_TODO_MAX=20

# Rate Limiting - PUT/DELETE /todos/:id
RATE_LIMIT_MUTATION_WINDOW_MS=900000
RATE_LIMIT_MUTATION_MAX=50

# Optional
PORT=3000
```

---

## Dependencies

### Runtime Dependencies

| Package | Version | NPM | Deskripsi |
|---------|---------|-----|-----------|
| [express](https://www.npmjs.com/package/express) | ^5.2.1 | https://www.npmjs.com/package/express | Web framework untuk Node.js |
| [@prisma/client](https://www.npmjs.com/package/@prisma/client) | ^6.19.2 | https://www.npmjs.com/package/@prisma/client | ORM untuk database operations |
| [cors](https://www.npmjs.com/package/cors) | ^2.8.6 | https://www.npmjs.com/package/cors | CORS middleware |
| [helmet](https://www.npmjs.com/package/helmet) | ^8.1.0 | https://www.npmjs.com/package/helmet | Secure HTTP headers |
| [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) | ^8.3.1 | https://www.npmjs.com/package/express-rate-limit | Rate limiting middleware |
| [zod](https://www.npmjs.com/package/zod) | ^4.3.6 | https://www.npmjs.com/package/zod | Schema validation |
| [morgan](https://www.npmjs.com/package/morgan) | ^1.10.1 | https://www.npmjs.com/package/morgan | HTTP request logging |
| [dotenv](https://www.npmjs.com/package/dotenv) | ^17.3.1 | https://www.npmjs.com/package/dotenv | Environment variables management |

### Development Dependencies

| Package | Version | NPM | Deskripsi |
|---------|---------|-----|-----------|
| [nodemon](https://www.npmjs.com/package/nodemon) | ^3.1.14 | https://www.npmjs.com/package/nodemon | Auto-reload development server |
| [prisma](https://www.npmjs.com/package/prisma) | ^6.19.2 | https://www.npmjs.com/package/prisma | Prisma CLI untuk migrations |

---

## Available Scripts

```bash
# Development - Hot reload dengan nodemon
npm run dev

# Production - Run server
npm start

# Prisma Commands
npm run prisma migrate dev        # Create & apply migrations
npm run prisma studio            # Open Prisma Studio UI
npm run prisma generate          # Generate Prisma Client
```

---

## Dokumentasi Lengkap

- [**Architecture Overview**](docs/ARCHITECTURE.md) - Struktur aplikasi & alur data
- [**Security Documentation**](docs/Security/README.md) - Penjelasan fitur keamanan
  - [Rate Limiting](docs/Security/RateLimiter.md)
  - [Request Validation](docs/Security/Validators.md)
  - [Logging](docs/Security/Logger.md)

---

## Links Penting

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Zod Documentation](https://zod.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## License

ISC

---

## 💡 Tips untuk Development

- Gunakan Prisma Studio untuk visualisasi data: `npm run prisma studio`
- Check rate limiting behavior di logs: `tail -f Log/Log.json`
- Validasi schema dengan Zod sebelum mencapai database
- Extend architecture dengan menambah model Prisma & services baru

Happy coding! 


