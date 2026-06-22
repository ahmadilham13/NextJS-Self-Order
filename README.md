# Sistem Self-Order F&B 🍔

Proyek portofolio membangun sistem pemesanan makanan mandiri dengan *Realtime Kitchen Display* menggunakan teknologi modern.

## 🚀 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma 7 (dengan Driver Adapter `pg`)
- **TypeScript:** Digunakan di seluruh proyek

## 📝 Dokumentasi Setup Prisma 7 & Supabase (DAY 1)

Berikut adalah panduan langkah demi langkah bagaimana kita mengkonfigurasi Prisma dan Supabase di proyek ini.

### 1. Persiapan Database (Supabase)
1. Buat project baru di [Supabase](https://supabase.com/).
2. Masuk ke **Project Settings -> Database**.
3. Di bagian **Connection String (URI)**, salin URL database.
4. Buat file `.env` di *root* proyek dan tambahkan dua jenis URL (Pooler dan Direct):

```env
# URL Pooler (port 6543) - Digunakan oleh aplikasi untuk koneksi cepat
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# URL Direct (port 5432) - Digunakan HANYA oleh Prisma CLI untuk migrasi tabel
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

### 2. Setup Prisma 7
Karena menggunakan Prisma versi 7, konfigurasi terbagi menjadi dua bagian:

**A. Skema Database (`prisma/schema.prisma`)**
Definisikan tabel di sini tanpa memasukkan URL koneksi.
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  // URL TIDAK ditaruh di sini pada Prisma 7
}

model Menu {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Int
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**B. Konfigurasi CLI (`prisma.config.ts`)**
File ini mengatur koneksi khusus untuk keperluan perintah di terminal (seperti `db push` atau `seed`).
```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DIRECT_URL"], // WAJIB menunjuk ke DIRECT_URL untuk migrasi
  },
});
```

### 3. Migrasi & Seeding Data
Setelah skema dibuat, sinkronkan ke Supabase dan isi dengan data dummy:

```bash
# Mengirim struktur tabel ke Supabase
npx prisma db push

# Men-generate Prisma Client untuk TypeScript
npx prisma generate

# Memasukkan data awal (Menu F&B)
npx prisma db seed
```

### 4. Koneksi Aplikasi ke Database (`src/lib/prisma.ts`)
Aplikasi Next.js menggunakan *Adapter PG* untuk terkoneksi lewat *Connection Pooler* agar aman di lingkungan Serverless/Hot-reload.

```typescript
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => new PrismaClient({ adapter });

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
```

## 🏃‍♂️ Cara Menjalankan Proyek Lokal
Jalankan server *development*:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.
