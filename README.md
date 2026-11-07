# Konverfile

**Konverter file gambar gratis, privat, dan tanpa batas — langsung di browsermu.**

Konverfile mengubah gambar dan membuat PDF sepenuhnya di perangkat pengguna. Tidak ada file yang diunggah ke server, tidak perlu daftar, tidak ada batas jumlah file.

---

## Fitur

- **Ubah format gambar** — JPG, PNG, dan WebP satu sama lain
- **Kompres & resize** — atur kualitas dan lebar maksimum sekaligus
- **Gambar ke PDF** — gabungkan banyak gambar jadi satu file PDF, ukuran A4 atau sesuai gambar
- **Batch convert** — proses banyak file sekaligus
- **Dark mode** — toggle manual + otomatis ikut pengaturan sistem
- **Privat** — semua proses terjadi di browser, nol upload ke server
- **Tanpa daftar** — langsung pakai, tidak perlu akun

---

## Teknologi

| Bagian | Teknologi |
|---|---|
| Markup | HTML5 |
| Tampilan | CSS3 (custom properties, grid, flexbox) |
| Logika | Vanilla JavaScript (ES2020+) |
| Konversi gambar | Canvas API (bawaan browser) |
| Pembuatan PDF | [jsPDF](https://github.com/parallax/jsPDF) v2.5.1 via CDN |
| Font | DM Sans + DM Mono (Google Fonts) |
| Hosting | GitHub Pages |

---

## Struktur Proyek

```
konverfile/
├── index.html   # Halaman utama & markup
├── style.css    # Desain, palet warna, dark mode
├── app.js       # Logika konversi & interaksi
└── README.md    # Dokumentasi ini
```

---

## Cara Menjalankan Secara Lokal

Tidak perlu build tool atau server. Cukup:

```bash
git clone https://github.com/username/konverfile.git
cd konverfile
# Buka index.html di browser
```

Karena semua konversi menggunakan Canvas API bawaan browser, tidak ada dependensi yang perlu dipasang secara lokal.

---

## Cara Deploy ke GitHub Pages

1. Push semua file ke branch `main`
2. Buka **Settings → Pages**
3. Pilih source: **Branch: main**, folder: **/ (root)**
4. Klik Save — tunggu 1–3 menit
5. Website aktif di `https://username.github.io/konverfile`

> Ganti `username` dengan username GitHub-mu.

---

## Palet Warna

| Nama | Light mode | Dark mode |
|---|---|---|
| Background | `#F5F0E8` (cream) | `#111A14` |
| Surface | `#FFFFFF` | `#1C2B20` |
| Hijau utama | `#2D7A4F` | `#4DB87A` |
| Teks utama | `#1A2E1E` | `#E6EDE8` |
| Teks sekunder | `#5A7060` | `#8BAF96` |

---

## Rencana Pengembangan

- [ ] PDF ke gambar
- [ ] Gabung & pisah PDF
- [ ] Kompres PDF
- [ ] Tombol donasi (Saweria / Trakteer)
- [ ] Paket Pro sekali beli (fitur lanjutan)
- [ ] Konversi PDF ↔ Word (membutuhkan backend PHP)

---

## Lisensi

[MIT License](LICENSE) — bebas digunakan, dimodifikasi, dan didistribusikan.

---

*Konverfile dibuat untuk membantu pengguna Indonesia yang membutuhkan konverter file yang bisa dipercaya — cepat, bersih, dan benar-benar privat.*
