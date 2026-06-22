# AGENT KNOWLEDGE BASE (AGENTS.md)

File ini digunakan sebagai pengingat (memori) bagi AI Agent mengenai konteks, aturan, dan progres proyek ini.

## 📌 Informasi Proyek
- **Nama Proyek:** Sistem Self-Order F&B dengan Realtime Kitchen Display
- **Pendekatan Belajar:** "Micro-Steps / Step-by-Step" (AI hanya boleh memberikan satu langkah pada satu waktu, jelaskan konsep, berikan kode, dan tunggu konfirmasi).

## 🛠️ Tech Stack & Konvensi
1. **Framework:** Next.js 15 (App Router)
2. **Styling:** Tailwind CSS v4
3. **Database:** Supabase (PostgreSQL)
4. **ORM:** Prisma 7
   - *Penting (Prisma 7):* File `schema.prisma` tidak boleh memiliki `url` di blok datasource.
   - *Penting (CLI):* Konfigurasi URL migrasi dan seeding berada di `prisma.config.ts` (menggunakan `DIRECT_URL` port 5432).
   - *Penting (Aplikasi):* Koneksi Next.js menggunakan `@prisma/adapter-pg` di `src/lib/prisma.ts` (menggunakan `DATABASE_URL` port 6543 / pooler).
5. **State Management:** React Context API (untuk keranjang belanja).

## 📅 Silabus & Progres

### [x] DAY 1 — Foundation & Project Setup
- [x] Setup Next.js 15 & Tailwind CSS
- [x] Setup Prisma 7 & Driver Adapter 'pg'
- [x] Konfigurasi Supabase `.env`
- [x] Skema Database (`Menu`)
- [x] Push Skema ke Supabase
- [x] Seeding Data Dummy (`tsx prisma/seed.ts`)
- [x] Fetching Menu di Homepage via Server Component

### [x] DAY 2 — Build Menu & Cart System
- [x] Langkah 1: Setup State Management untuk Cart (React Context).
- [x] Langkah 2: Membungkus Aplikasi dengan Provider.
- [x] Langkah 3: Menggunakan Cart di Client Component (Membuat Tombol Tambah).
- [x] Langkah 4: Membuat UI Keranjang (Floating Cart / Sidebar) & Hitung Subtotal.

### [x] DAY 3 — Order & Checkout Feature
- [x] Langkah 1: Skema Database Relasional (`Order` dan `OrderItem`).
- [x] Langkah 2: Form Customer & Validasi.
- [x] Langkah 3: API Create Order (Server Actions / Route Handlers).

### [ ] DAY 4 — Live Kitchen Display
- [ ] Setup Supabase Realtime / WebSockets.
- [ ] Halaman Kitchen Display.
- [ ] Sinkronisasi pesanan masuk secara realtime tanpa refresh.
