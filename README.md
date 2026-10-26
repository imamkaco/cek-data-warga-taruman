# Panduan Deploy Aplikasi Cek Data Warga Desa Taruman ke Vercel

Aplikasi ini sudah dikonfigurasi secara lengkap untuk dapat langsung dideploy ke **Vercel** (`.vercel.app`) secara gratis dengan dukungan frontend Vite + backend API Serverless Function.

---

## 📁 File Konfigurasi yang Telah Disiapkan

1. **`vercel.json`**
   - Mengatur rute frontend SPA Vite ke direktori `dist`
   - Mengarahkan semua panggilan API (`/api/*`) ke Serverless Function Vercel
2. **`/api/index.ts`**
   - Menjalankan backend Express secara serverless di Vercel
   - Menyediakan endpoint statistik kependudukan, pencarian data warga, login admin, tambah warga, edit, hapus, dan import/export Excel.
3. **`/data/warga.json`**
   - Basis data awal warga Desa Taruman.

---

## 🚀 Cara 1: Deploy Melalui Website Vercel (Paling Mudah)

1. **Upload / Push Kode ke GitHub**:
   - Buat repository baru di [GitHub](https://github.com/new).
   - Push seluruh file proyek ini ke repository GitHub Anda.

2. **Buka Vercel**:
   - Kunjungi [https://vercel.com](https://vercel.com) dan login (bisa langsung pakai akun GitHub Anda).

3. **Impor Proyek**:
   - Di dashboard Vercel, klik tombol **"Add New..."** lalu pilih **"Project"**.
   - Pilih repository GitHub yang baru saja Anda upload, lalu klik **"Import"**.

4. **Pengaturan Project (Build and Output Settings)**:
   - **Framework Preset**: Pilih `Vite` (biasanya terdeteksi otomatis).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Environment Variables (Opsional)**:
   - Tambahkan variable berikut jika ingin mengubah password admin:
     - Key: `ADMIN_PASSWORD`
     - Value: `TARUMAN123#` (atau password pilihan Anda)

6. **Deploy**:
   - Klik tombol **"Deploy"**.
   - Tunggu sekitar 1-2 menit hingga proses selesai.
   - Selesai! Aplikasi Anda akan aktif di alamat seperti:
     `https://cek-data-warga-taruman.vercel.app`

---

## ⚡ Cara 2: Deploy Melalui Terminal (Vercel CLI)

Jika Anda menggunakan terminal / command prompt di komputer:

```bash
# 1. Install Vercel CLI (jika belum ada)
npm i -g vercel

# 2. Login ke akun Vercel
vercel login

# 3. Jalankan perintah deploy
vercel --prod
```

Ikuti petunjuk di layar (tekan Enter untuk pilihan default). Vercel akan langsung memberikan link web aktif `*.vercel.app`.

---

## 🔒 Akses Administrator
- **Password Masuk Admin**: `TARUMAN123#`
- **Fitur Admin**: Tambah warga, Hapus data warga, Ubah validasi, dan Export Excel.
- **Fitur Publik**: Hanya melihat dan mencari data warga tanpa bisa mengedit/menghapus.
