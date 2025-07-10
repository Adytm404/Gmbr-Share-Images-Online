# Gmbr - Berbagi Gambar Online

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Gmbr** adalah aplikasi web yang memungkinkan pengguna untuk mengunggah gambar dan secara instan mendapatkan tautan yang dapat dibagikan. Proyek ini meniru antarmuka Jumpshare dan dibangun dengan backend **Flask** dan frontend **React** (Vite + TypeScript).

## ✨ Fitur

* **Unggah Gambar Instan**: Unggah gambar dengan cepat melalui dialog file atau seret dan lepas (drag-and-drop).
* **Berbagi Tautan**: Secara otomatis menghasilkan tautan unik yang dapat dibagikan untuk setiap gambar yang diunggah.
* **Pratinjau Gambar**: Lihat pratinjau gambar yang diunggah beserta ukurannya.
* **Salin Sekali Klik**: Salin tautan yang dapat dibagikan dan URL gambar mentah dengan mudah.
* **Mode Gelap/Terang**: Beralih antara tema terang dan gelap untuk kenyamanan menonton.
* **Antarmuka Responsif**: Desain yang beradaptasi dengan baik di berbagai ukuran layar.
* **Latar Belakang Animasi**: Latar belakang animasi yang halus untuk pengalaman pengguna yang lebih baik.
* **Penampil Gambar Khusus**: Gambar yang dibagikan ditampilkan dalam penampil yang bersih dan terfokus.

---

## 🛠️ Tumpukan Teknologi

* **Backend**:
    * **Flask**: Kerangka kerja web Python untuk melayani API.
    * **NyanDrive**: Digunakan sebagai layanan penyimpanan cloud untuk gambar yang diunggah.
* **Frontend**:
    * **React**: Pustaka JavaScript untuk membangun antarmuka pengguna.
    * **Vite**: Alat build frontend untuk pengembangan yang cepat.
    * **TypeScript**: Menambahkan tipe statis ke JavaScript untuk meningkatkan kualitas kode.
    * **Tailwind CSS**: Kerangka kerja CSS untuk desain yang cepat.

---

## 🚀 Memulai

### Prasyarat

Pastikan sistem Anda telah menginstal perangkat lunak berikut:

* **Node.js** (v18.0.0 atau lebih tinggi)
* **Python** (v3.6 atau lebih tinggi)
* **npm** (Node Package Manager)

### Instalasi & Menjalankan

1.  **Kloning repositori:**
    ```bash
    git clone [https://github.com/Adytm404/Gmbr-Share-Images-Online.git](https://github.com/Adytm404/Gmbr-Share-Images-Online.git)
    cd Gmbr-Share-Images-Online
    ```

2.  **Siapkan Backend:**
    * Navigasi ke direktori root proyek.
    * Buat dan aktifkan lingkungan virtual:
        ```bash
        python -m venv venv
        source venv/bin/activate  # Di Windows, gunakan `venv\Scripts\activate`
        ```
    * Instal dependensi Python:
        ```bash
        pip install -r requirements.txt
        ```
    * Buat file `.env` di root proyek dan tambahkan token NyanDrive Anda:
        ```
        NYANDRIVE_TOKEN="TOKEN_ANDA_DISINI"
        ```
    * Jalankan server Flask:
        ```bash
        flask run --port 5005
        ```
    Server backend sekarang akan berjalan di `http://127.0.0.1:5005`.

3.  **Siapkan Frontend:**
    * Buka terminal baru dan navigasi ke direktori `frontend`:
        ```bash
        cd frontend
        ```
    * Instal dependensi npm:
        ```bash
        npm install
        ```
    * Jalankan server pengembangan Vite:
        ```bash
        npm run dev
        ```
    Aplikasi frontend sekarang akan berjalan di `http://localhost:5173`.

---

## ⚙️ Konfigurasi

* `NYANDRIVE_TOKEN`: Token API yang diperlukan untuk otentikasi dengan API NyanDrive. Token ini harus ditempatkan dalam file `.env` di direktori root proyek.

---

## 📝 Titik Akhir API

Aplikasi backend Flask menyediakan titik akhir berikut:

* `POST /upload`: Mengunggah file gambar ke NyanDrive dan mengembalikan URL kustom.
* `GET /image/<entry_id>`: Berfungsi sebagai proksi untuk mengambil dan menampilkan gambar dari NyanDrive berdasarkan ID entri.

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk detailnya.