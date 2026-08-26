# 🎪 EventHub - Platform Event & Komunitas Modern

EventHub adalah platform web modern yang dirancang untuk memudahkan pengguna dalam menemukan, mengelola, dan menghadiri berbagai acara (event) serta bergabung dengan berbagai komunitas yang relevan. Dilengkapi dengan fitur khusus untuk Pengguna, Event Organizer, dan Administrator.

---

## 🚀 Fitur Utama

### 👤 User / Peserta
- **Eksplorasi Event & Komunitas**: Cari dan filter event berdasarkan kategori, tanggal, dan lokasi.
- **Detail Event & Registrasi**: Lihat informasi mendalam mengenai event, daftar atau beli tiket event, serta ikut serta dalam forum diskusi event.
- **Komunitas**: Jelajahi berbagai komunitas, bergabung, dan berinteraksi di ruang diskusi komunitas.
- **Event Saya (My Events)**: Pantau event yang akan datang (*upcoming*), event yang pernah diikuti (*past*), serta event yang disimpan (*saved*).
- **Profil Pengguna**: Kelola informasi profil dan aktivitas pengguna.
- **Notifikasi**: Pusat notifikasi aktivitas dan pengingat event.

### 🎯 Event Organizer
- **Dashboard Organizer**: Pantau statistik dan daftar event yang dipublikasikan.
- **Buat & Edit Event**: Formulir pembuat event baru secara dinamis dengan opsi kustomisasi detail acara.

### 🛡️ Administrator (Admin Dashboard)
- **Ringkasan Analitik**: Grafik dan visualisasi data statistik (pengguna, event, aktivitas) menggunakan Chart.js.
- **Manajemen Pengguna**: Kelola dan pantau seluruh data pengguna terdaftar.
- **Moderasi Event & Komunitas**: Kontrol penuh untuk memverifikasi atau mengelola konten event dan komunitas.

---

## 🛠️ Teknologi yang Digunakan

- **Core**: [React 19](https://react.dev/), [Vite 8](https://vite.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/), [Redux Persist](https://github.com/rt2zz/redux-persist) (Local Persistence), Context API (Auth & Theme)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Material UI (MUI)](https://mui.com/), [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **Data Visualisation**: [Chart.js](https://www.chartjs.org/)
- **Notification**: [React Toastify](https://fkhadra.github.io/react-toastify/)

---

## 📁 Struktur Direktori Proyek

```text
event-hub/
├── public/                 # Asset publik statis
├── src/
│   ├── assets/             # Gambar, ilustrasi, dan icon
│   ├── components/         # Komponen UI reusable (Modal, Navbar, Footer, dll)
│   ├── context/            # Context Provider (AuthContext, ThemeProvider)
│   ├── data/               # Mock data awal aplikasi
│   ├── hooks/              # Custom React Hooks (useLocalStorage, dll)
│   ├── layouts/            # Layout Wrapper (AuthLayout, MainLayout, DashboardLayout)
│   ├── pages/              # Halaman-halaman utama aplikasi
│   │   ├── admin/          # Halaman Dashboard Admin
│   │   ├── auth/           # Halaman Login & Register
│   │   ├── communities/    # Halaman Komunitas & Detail Komunitas
│   │   ├── events/         # Halaman Daftar Event
│   │   ├── events-detail/  # Halaman Detail Event & Diskusi
│   │   ├── my-events/      # Halaman Event Saya
│   │   ├── Organizer/      # Halaman Dashboard Organizer & Create Event
│   │   └── profile/        # Halaman Profil Pengguna
│   ├── redux/              # Redux Store & Slices (dataSlice, store)
│   ├── router/             # Konfigurasi Routing (Router.jsx)
│   ├── utils/              # Helper & fungsi utilitas
│   ├── App.jsx             # Root App component
│   ├── main.jsx            # Entry point aplikasi
│   └── index.css           # Global Stylesheet & Konfigurasi Tailwind
├── index.html              # HTML Entry Point
├── package.json            # Dependensi dan script NPM
└── vite.config.js          # Konfigurasi Vite
```

---

## ⚙️ Panduan Instalasi & Penggunaan

### Prasyarat
- [Node.js](https://nodejs.org/) (Versi 18 ke atas disarankan)
- Package Manager (`npm`)

### Langkah Instalasi

1. **Clone repository ini** (atau pastikan Anda berada di direktori proyek):
   ```bash
   git clone https://github.com/username/event-hub.git
   cd event-hub
   ```

2. **Install seluruh dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (Development Mode)**:
   ```bash
   npm run dev
   ```
   Buka browser dan akses alamat lokal yang muncul (biasanya `http://localhost:5173`).

---

## 📜 Skrip NPM yang Tersedia

- `npm run dev` : Menjalankan aplikasi dalam mode pengembangan dengan Hot Module Replacement (HMR).
- `npm run build` : Membuat bundel produksi (*production build*) di dalam folder `dist`.
- `npm run preview` : Menjalankan server lokal untuk meninjau hasil *build* produksi.
- `npm run lint` : Menjalankan ESLint untuk mengecek kualitas dan gaya penulisan kode.

---

## 🤝 Kontribusi

Kontribusi selalu terbuka! Jika Anda ingin berkontribusi:
1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b fitur/fitur-baru`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch tersebut (`git push origin fitur/fitur-baru`)
5. Buat Pull Request

---

## 📄 Lisensi

Proyek ini dibuat untuk tujuan pengembangan dan pembelajaran. Silakan gunakan dan kembangkan secara bebas.
