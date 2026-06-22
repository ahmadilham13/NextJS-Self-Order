# 🍔 Smart Resto POS & Self-Order System

A modern, full-stack Food & Beverage Self-Order System built with Next.js 15. Features a customer-facing kiosk interface and a real-time kitchen display system (KDS) synchronized via WebSockets.

## ✨ Fitur Utama
- **Menu Digital & Keranjang**: Tampilan beranda yang interaktif bagi pelanggan untuk memilih makanan dan memasukkannya ke keranjang (State Management dengan React Context).
- **Sistem Checkout**: Pengisian data pelanggan dan perhitungan total harga secara otomatis.
- **Realtime Kitchen Display**: Layar khusus dapur yang akan memunculkan pesanan baru seketika (tanpa perlu *refresh*) menggunakan Supabase WebSockets.
- **Alur Status Pesanan**: Koki dapat mengubah status pesanan dari `PENDING` -> `COOKING` -> `READY` -> `COMPLETED`.
- **Filter Pintar**: Navigasi di layar dapur untuk menyaring pesanan berdasarkan statusnya saat ini.

## 🛠️ Teknologi yang Digunakan
- **Framework**: Next.js 15 (App Router, Server Actions)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma 7
- **Realtime Sync**: `@supabase/supabase-js`

## 🚀 Cara Menjalankan di Komputer Lokal

1. Clone repositori ini:
   ```bash
   git clone https://github.com/username-kamu/nama-repo.git
   cd nama-repo
   ```

2. Install semua dependensi:
   ```bash
   npm install
   ```

3. Buat file `.env` di folder utama dan isi dengan konfigurasi database Supabase-mu:
   ```env
   DATABASE_URL="postgresql://postgres.[PROYEK_ID]:[PASSWORD]@aws-0-....pooler.supabase.com:6543/postgres"
   DIRECT_URL="postgresql://postgres.[PROYEK_ID]:[PASSWORD]@aws-0-....pooler.supabase.com:5432/postgres"
   NEXT_PUBLIC_SUPABASE_URL="https://[PROYEK_ID].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
   ```

4. Sinkronisasi skema database ke Supabase:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
   *(Opsional: Jalankan `npx tsx prisma/seed.ts` jika kamu punya script data awal)*

5. Jalankan server lokal:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` untuk layar Pelanggan/Kasir, dan `http://localhost:3000/kitchen` untuk layar Dapur.

6. Jalankan command ini untuk melihat database via Prisma GUI:
   ```bash
   npx prisma studio
   ```

## 🤝 Kontribusi
Dibuat sebagai proyek pembelajaran mandiri (Micro-Steps Project). Silakan lakukan *fork* dan modifikasi sesukamu!
