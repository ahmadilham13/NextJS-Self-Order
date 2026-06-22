# 🍔 Self-Order F&B Apps with Realtime Kitchen Display

Sistem pemesanan mandiri (Self-Order) restoran kelas *Enterprise* yang dirancang untuk memberikan pengalaman tanpa hambatan bagi pelanggan, dapur (kitchen), dan manajemen (admin). Dibangun menggunakan ekosistem Next.js 15 terbaru.

## ✨ Fitur Utama

### 🧑‍💼 Customer Experience (Frontend)
- **Katalog Menu Dinamis:** Menampilkan ketersediaan stok menu secara *realtime* (lengkap dengan overlay "Habis" jika stok kosong).
- **Sistem Keranjang Belanja:** *State Management* menggunakan React Context API.
- **Dukungan Guest & Member Mode:** Pelanggan yang *login* akan otomatis mendapatkan diskon khusus (Loyalty Program).
- **Pembayaran Terintegrasi (Midtrans):** Popup pembayaran otomatis (E-Wallet, Virtual Account, dll) menggunakan Midtrans Snap.
- **Riwayat Transaksi & Struk Digital:** Bukti bayar otomatis (*print-ready*) bergaya kertas kasir termal.

### 👨‍🍳 Kitchen Display System (KDS)
- **Realtime WebSocket:** Sinkronisasi pesanan masuk secara langsung tanpa perlu *refresh* (menggunakan Supabase Realtime).
- **Manajemen Status Pesanan:** Dapur bisa mengubah status dari "Memasak" menjadi "Siap Disajikan".

### 👑 Backoffice & Admin Dashboard (RBAC)
- **Role-Based Access Control:** Keamanan ganda untuk memisahkan akses `CUSTOMER`, `KITCHEN`, dan `ADMIN`.
- **Analytics Dashboard:** Visualisasi pendapatan kotor, total pesanan sukses, dan bar indikator menu paling laris.
- **Menu Management (CRUD):** Tambah, edit harga, ubah ketersediaan stok, dan upload gambar menu secara langsung ke **Supabase Storage**. Dilengkapi dengan tabel *pagination*.
- **User Management:** Panel untuk memantau daftar pengguna dan menaikkan/menurunkan jabatan staf (Admin/Kitchen).
- **Halaman Rekonsiliasi:** Pencocokan *Order ID* dan jumlah uang masuk antara database internal dengan rekening Midtrans.
- **Audit Log Terpusat:** Sistem mencatat setiap tindakan perubahan yang dilakukan oleh Admin (Siapa, Kapan, Apa yang diubah).

---

## 🛠️ Tech Stack & Konvensi

1. **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
2. **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
3. **Database & Storage:** [Supabase](https://supabase.com/) (PostgreSQL & Object Storage)
4. **ORM:** [Prisma 7](https://www.prisma.io/) (Menggunakan `@prisma/adapter-pg` untuk koneksi *Pooler*)
5. **Autentikasi:** Supabase Auth (SSR)
6. **Payment Gateway:** [Midtrans](https://midtrans.com/) (Snap Token & Webhook Settlement)

---

## 🚀 Panduan Instalasi Lokal

### 1. Kloning Repositori
```bash
git clone https://github.com/ahmadilham13/NextJS-Self-Order.git
cd NextJS-Self-Order
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables (`.env`)
Buat file `.env` di *root* proyek dan isikan dengan kunci-kunci berikut:

```env
# Prisma Database
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[POOLER_URL]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://[USER]:[PASSWORD]@[DIRECT_URL]:5432/postgres"

# Supabase Auth & Storage
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="ey..."

# Midtrans Payment Gateway
MIDTRANS_SERVER_KEY="SB-Mid-server-..."
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-..."
```

*Catatan: Pastikan kamu telah membuat bucket bernama `menu-images` dengan status **Public** dan menyetel Storage Policy di Supabase untuk mengizinkan operasi Upload.*

### 4. Sinkronisasi Database (Prisma)
```bash
# Push skema ke Supabase
npx prisma db push

# (Opsional) Seeding data dummy
npx tsx prisma/seed.ts
```

### 5. Jalankan Server Development
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

---

## 🏗️ Struktur Proyek

- `/src/app/` - Halaman antarmuka pelanggan (Homepage, Login, History).
- `/src/app/admin/` - Ekosistem Backoffice (Dashboard, Manajemen, Audit, Recon). Dilindungi oleh RBAC.
- `/src/app/kitchen/` - Ekosistem Dapur (Live Order Display).
- `/src/actions/` - Logika *Server Actions* untuk manipulasi database, mutasi, dan pengecekan otorisasi.
- `/src/app/api/webhook/` - *Route handler* untuk menerima notifikasi pelunasan dari Midtrans.

---

*Dibangun dengan dedikasi penuh. Sistem ini dirancang bukan sekadar sebagai aplikasi kasir, melainkan sebagai mesin bisnis yang berjalan otomatis.*
