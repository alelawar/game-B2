# 👑 Mahkota Bintang (The Star Crown)
### Game Edukasi 2D Pixel RPG Bahasa Inggris untuk Siswa SD Kelas 3 & 4

Game RPG pixel-art 2D berbasis web yang dirancang khusus untuk siswa Sekolah Dasar kelas 3 dan 4 di Indonesia. Pemain berperan sebagai prajurit kerajaan terpilih yang bertualang menjelajahi kerajaan, berdialog dengan warga, memecahkan teka-teki materi Bahasa Inggris, menghadapi monster, dan menemukan kembali **Mahkota Bintang** milik Putri Cahaya sebelum Festival Kerajaan dimulai.

---

## 🌟 Fitur Utama

1. **Pendaftaran Pemain & Validasi Tingkat Kelas:**
   - Input nama prajurit (min. 2 karakter).
   - Pemilihan kelas (Kelas 3 SD atau Kelas 4 SD).
2. **Dunia Top-Down 2D Handcrafted (4 Wilayah Terhubung):**
   - **Alun-Alun Istana (Village Square Hub):** Pusat kerajaan, air mancur pemulih stamina, Putri Cahaya, Penjaga Alun-alun, dan Keranjang Buah.
   - **Taman Bunga Kerajaan (Royal Whispering Garden):** Tukang Kebun Rama, patung kucing tidur, gazebo meja belajar.
   - **Ruang Istana & Dapur (Castle Hall & Kitchen):** Koki Istana Budi, wastafel dapur (lokasi kunci gerbang), sofa beludru mewah.
   - **Hutan Rahasia & Altar Mahkota (Secret Forest):** Penjaga gerbang berzirah, monster Slime, Prasasti Kuno bertuliskan mantra Present Continuous, dan Altar Mahkota Bintang.
3. **10 Pertanyaan Edukatif Sesuai Kurikulum Kelas 3–4:**
   - Dibuat langsung berdasarkan dokumen `MATERIALS FOR CLASSES 3 - 4.docx`.
   - Menguji: *Likes & Dislikes, Numbers (1–50), Hobbies, Prepositions of Place, Meals & Meal Times, Present Continuous, There is / There are, Living Room Objects, Kitchen Activities & modal 'can', serta Transportation to School*.
   - Setiap jawaban benar memperoleh +10 poin (Maksimal 100 poin).
   - Dilengkapi umpan balik langsung berbahasa Indonesia beserta penjelasan edukatif.
   - Pertanyaan yang telah selesai tidak memberikan poin berulang (*anti-farming*).
4. **Sistem Pertarungan Sederhana & Ramah Anak (Real-Time Combat):**
   - Serangan tebasan pedang dengan tombol `Spasi` / tombol virtual ⚔️.
   - Monster Slime dan Penjaga Hutan dengan deteksi aggro dan efek pantulan (*knockback*).
   - Jika HP pemain habis, prajurit dipulihkan kembali di Alun-Alun tanpa menghapus progres skor atau petualangan (*forgiving design*).
5. **Aset Pixel Art & Audio Prosedural Lengkap:**
   - Seluruh grafis pixel art digenerate secara prosedural dengan HTML5 Canvas ke dalam Phaser TextureManager: anti tautan gambar rusak, 100% luring (*offline-ready*).
   - Efek suara chiptune 16-bit disintesis secara langsung menggunakan Web Audio API: tebasan pedang, pukulan, jawaban benar/salah, suara mahkota, dan melodi kemenangan kerajaan.
6. **Kontrol Responsif (Desktop & Mobile):**
   - Keyboard: `WASD` / Panah untuk bergerak, `E` untuk interaksi, `Spasi` untuk serang, `Esc` untuk menutup dialog.
   - Touchscreen: Virtual D-pad dan tombol aksi [E] & [⚔️] pada layar ponsel / tablet.
7. **Layar Kemenangan & Tombol Main Lagi (Play Again):**
   - Menampilkan nama prajurit, kelas, perolehan skor (0–100), rating bintang, dan ringkasan topik.
   - Fitur restart yang mereset kondisi permainan secara bersih.

---

## 🛠️ Tech Stack

- **Game Engine:** Phaser 3 (`phaser@^3.88.2`)
- **Language:** TypeScript (`strict: true`)
- **Bundler:** Vite
- **UI & Styling:** Vanilla HTML5 & CSS3 (Glassmorphism, Outfit font, palet warna kerajaan cerah)
- **Deployment Target:** Vercel (Static Single Page Application)

---

## 📁 Struktur Folder

```
src/
├── data/
│   ├── questions.ts      # 10 pertanyaan kurikulum Kelas 3 & 4
│   └── maps.ts           # Definisi layout peta, NPC, objek, portal, dan monster
├── game/
│   ├── config.ts         # Konfigurasi Phaser 3 (pixelArt, scale fit, physics)
│   ├── entities/
│   │   ├── Player.ts     # Entitas prajurit pemain & sistem pedang
│   │   ├── NPC.ts        # Entitas warga kerajaan yang dapat diajak bicara
│   │   ├── Enemy.ts      # Monster Slime & Boss penjaga
│   │   └── Interactable.ts # Objek interaktif (meja, wastafel, altar, keranjang)
│   └── scenes/
│       ├── BootScene.ts  # Booting & pembuatan tekstur prosedural
│       └── WorldScene.ts # Manajemen gameplay, pergerakan, portal, kamera & pertarungan
├── systems/
│   ├── GameState.ts      # State manajer tunggal (skor, HP, quest, jawaban)
│   ├── AudioSystem.ts    # Sintesis audio chiptune Web Audio API
│   └── TextureGenerator.ts # Generator pixel art 16-bit
├── ui/
│   ├── styles.css        # Desain antarmuka HUD, modal, & kuis
│   └── components/
│       ├── RegistrationModal.ts # Modal pendaftaran nama & kelas
│       ├── HUD.ts               # Tampilan HP (hati), skor, & banner objektif
│       ├── DialogModal.ts       # Kotak dialog warga & cerita
│       ├── QuizModal.ts         # Kotak kuis bahasa Inggris & umpan balik
│       ├── VictoryModal.ts      # Layar kemenangan kerajaan
│       └── TouchControls.ts     # Kontrol virtual layar sentuh
└── main.ts               # Entry point aplikasi
```

---

## 🚀 Menjalankan Secara Lokal

### Prasyarat
- Node.js (v18 atau lebih baru)
- npm

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses URL lokal yang ditampilkan (biasanya `http://localhost:3000` atau `http://localhost:5173`).

### 3. Membangun Bundle Produksi
```bash
npm run build
```
Hasil build siap saji akan dibuat di folder `dist/`.

### 4. Meninjau Hasil Produksi (Preview)
```bash
npm run preview
```

---

## ☁️ Panduan Deploy ke Vercel

Game ini dibangun sebagai aplikasi web statis murni sehingga dapat langsung di-deploy ke Vercel tanpa memerlukan server backend atau konfigurasi rumit.

### Langkah-langkah:
1. Pastikan seluruh file proyek sudah di-commit ke repositori Git (misalnya di GitHub / GitLab):
   ```bash
   git add .
   git commit -m "feat: complete Mahkota Bintang educational RPG game"
   git push origin main
   ```
2. Buka dashboard [Vercel](https://vercel.com/) dan masuk ke akun Anda.
3. Klik tombol **Add New...** lalu pilih **Project**.
4. Pilih repositori GitHub proyek **Mahkota Bintang** Anda.
5. Pada konfigurasi proyek Vercel:
   - **Framework Preset:** `Vite` (Vercel akan mendeteksi secara otomatis)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Klik tombol **Deploy**.
7. Setelah proses selesai (biasanya kurang dari 1 menit), Vercel akan memberikan domain publik URL langsung (misalnya `https://mahkota-bintang.vercel.app`) yang siap dimainkan langsung oleh siswa!
