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

### [x] DAY 4 — Live Kitchen Display
- [x] Setup Supabase Realtime / WebSockets.
- [x] Halaman Kitchen Display.
- [x] Sinkronisasi pesanan masuk secara realtime tanpa refresh.

## 🎉 SELAMAT! FASE 1 SELESAI! 🎉
Semua target silabus Fase 1 telah berhasil diselesaikan dengan luar biasa!

---

## 🚀 FASE 2: FITUR ENTERPRISE & MONETISASI
Pendekatan tetap menggunakan "Micro-Steps / Step-by-Step".

### [ ] DAY 5 — Authentication & User Management
- [x] Langkah 1: Setup Supabase Auth & Pembaruan Skema Database (Tabel `User` dan relasinya ke `Order`).
- [x] Langkah 2: Membuat Halaman Register & Login.
- [x] Langkah 3: Mengelola Sesi Pengguna di Frontend (Menampilkan Status Login).

### [x] DAY 6 — Guest Mode & Member Benefits
- [x] Langkah 1: Memperbarui logika Checkout (Menggabungkan alur Tamu dan Pengguna Terdaftar).
- [x] Langkah 2: Sistem Diskon Otomatis untuk Member Terdaftar.

### [x] DAY 7 — Authorization (Role-Based Access)
- [x] Langkah 1: Menambahkan sistem `Role` (Customer, Kitchen, Admin).
- [x] Langkah 2: Mengamankan halaman `/kitchen` (Hanya akun staf yang bisa mengakses layar dapur).

### [x] DAY 8 — Payment Gateway Integration (Midtrans)
- [x] Langkah 1: Konfigurasi Server Key & Client Key Midtrans.
- [x] Langkah 2: Membuat API Route / Server Action untuk menerbitkan *Snap Token* pembayaran.
- [x] Langkah 3: Menampilkan Pop-Up Pembayaran saat Checkout.
- [x] Langkah 4: Menangani *Webhook* (Notifikasi otomatis dari Bank/E-Wallet untuk merubah status menjadi 'Lunas').

---

## 🌟 FASE 3: CUSTOMER EXPERIENCE
### [x] DAY 9 — Transaction History & Digital Receipt
- [x] Langkah 1: Membangun halaman riwayat pesanan khusus pelanggan yang *login*.
- [x] Langkah 2: Menampilkan status pelunasan berdasarkan *webhook* Midtrans.
- [x] Langkah 3: Membuat struk digital (*print-ready*) menyerupai kertas kasir termal.

---

## 💼 FASE 4: BACKOFFICE & ADMIN DASHBOARD
Fitur manajerial tingkat lanjut untuk mengontrol keseluruhan sistem dari balik layar.

### [x] DAY 10 — Database Enhancement & Audit Log
- [x] Langkah 1: Menambahkan tabel `AuditLog` di Prisma Schema.
- [x] Langkah 2: Memperbarui tabel `Menu` dengan menambahkan kolom `isAvailable` (Stok Tersedia).
- [x] Langkah 3: Menyiapkan *Layout* khusus `/admin` yang dilindungi dengan *Role Based Access Control* (hanya Admin).

### [x] DAY 11 — Core Management (CRUD)
- [x] Langkah 1: **Menu Management** (Menambah, Mengedit harga/ketersediaan, Menghapus menu).
- [x] Langkah 2: **User Management** (Melihat daftar pengguna, mengubah *role* menjadi Admin/Kitchen, dll).

### [x] DAY 12 — Analytics & Recon (Rekonsiliasi)
- [x] Langkah 1: **Dashboard Analytic** (Grafik pendapatan, menu paling laris, total pesanan).
- [x] Langkah 2: **Halaman Rekonsiliasi** (Mencocokkan jumlah uang masuk di Midtrans dengan catatan database kita).
- [x] Langkah 3: **Halaman Audit Log** (Memantau siapa melakukan apa: misal "Admin B mengubah harga Ayam Goreng").

---

## 🏆 🎉 PROYEK SELESAI 100% 🎉 🏆
Seluruh target dari Fase 1 hingga Fase 4 telah berhasil dirampungkan! Sistem siap diterjunkan ke dapur restoran sesungguhnya!
