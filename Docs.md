# Dokumen Penjelasan Sistem Operasi Linux, Enkripsi, & Containerization

Dokumen ini disusun untuk menjelaskan secara mendalam konsep-konsep dasar Linux, jaringan, enkripsi, serta teknologi *containerization* dan *web server*.

---

## 1. Perbedaan Antara Linux Kernel dan Linux Distro

### a. Linux Kernel
Linux Kernel adalah **inti (core)** dari sistem operasi Linux. Kernel bertindak sebagai jembatan/perantara utama antara perangkat keras (*hardware*) dan perangkat lunak (*software*). 

* **Fungsi Utama Kernel:**
  * **Manajemen Memori:** Mengalokasikan dan membebaskan RAM untuk program yang berjalan.
  * **Manajemen Proses (CPU Scheduling):** Mengatur eksekusi proses dan alokasi waktu CPU.
  * **Device Drivers:** Menyediakan antarmuka komunikasi dengan perangkat keras (kartu grafis, disk, kartu jaringan).
  * **Manajemen Filesystem & I/O:** Mengatur pembacaan dan penulisan data ke media penyimpanan.

> **Catatan:** Kernel sendiri tidak memiliki antarmuka grafis (GUI) atau aplikasi bawaan. Anda tidak bisa langsung berinteraksi dengan kernel tanpa program pendukung.

### b. Linux Distro (Distribusi Linux)
Linux Distro adalah **sistem operasi utuh dan siap pakai** yang dibangun di atas Linux Kernel. Sebuah distro menggabungkan kernel Linux dengan komponen pendukung dari proyek GNU, paket manajer, *desktop environment*, serta aplikasi bawaan.

* **Komponen dalam Linux Distro:**
  * **Linux Kernel** (sebagai fondasi)
  * **GNU Utilities & Shell** (seperti `bash`, `coreutils`, `ls`, `grep`)
  * **Package Manager** (seperti `apt`, `dnf`, `pacman`)
  * **Display Server & Desktop Environment** (seperti GNOME, KDE Plasma, XFCE)
  * **Aplikasi Pengguna** (Web browser, text editor, media player)

### Perbandingan Ringkas

| Fitur | Linux Kernel | Linux Distro |
| :--- | :--- | :--- |
| **Definisi** | Inti sistem operasi | Paket sistem operasi lengkap |
| **Pengembang Utama** | Linus Torvalds & Komunitas Kernel Linux | Perusahaan/Komunitas (Canonical, Red Hat, Debian, dll.) |
| **Fungsi** | Mengelola hardware & resource sistem | Menyediakan sistem yang dapat digunakan oleh user |
| **Contoh** | Kernel v6.5, Kernel v5.15 | Ubuntu 22.04 LTS, Fedora 38, Arch Linux, Debian 12 |

---

## 2. Linux Filesystem Hierarchy Standard (FHS)

**Filesystem Hierarchy Standard (FHS)** adalah pedoman standar yang menentukan struktur direktori dan isi direktori dalam sistem operasi berorientasi Linux/Unix. Tujuan FHS adalah agar struktur direktori konsisten di berbagai distro Linux.

```
/ (Root)
├── bin -> usr/bin
├── boot/
├── dev/
├── etc/
├── home/
├── lib -> usr/lib
├── media/
├── mnt/
├── opt/
├── proc/
├── root/
├── run/
├── sbin -> usr/sbin
├── sys/
├── tmp/
├── usr/
└── var/
```

### Penjelasan & Contoh Kegunaan Direktori Utama

1. **`/` (Root Directory)**
   * **Penjelasan:** Direktori tingkat paling atas dalam struktur Linux. Semua file dan direktori berada di bawah direktori root ini.
2. **`/bin` & `/usr/bin` (User Binaries)**
   * **Penjelasan:** Berisi file biner/perintah dasar yang dibutuhkan oleh semua pengguna.
   * **Contoh Kegunaan:** Menyimpan perintah seperti `ls`, `cp`, `mv`, `cat`, `grep`.
3. **`/sbin` & `/usr/sbin` (System Binaries)**
   * **Penjelasan:** Berisi file biner khusus untuk tugas administrasi sistem yang biasanya dijalankan oleh `root`.
   * **Contoh Kegunaan:** Perintah seperti `fdisk`, `iptables`, `reboot`, `fsck`.
4. **`/etc` (Configuration Files)**
   * **Penjelasan:** Tempat penyimpanan file konfigurasi sistem dan aplikasi.
   * **Contoh Kegunaan:** 
     * `/etc/nginx/nginx.conf` (konfigurasi web server Nginx)
     * `/etc/passwd` (informasi akun pengguna)
     * `/etc/fstab` (konfigurasi automount media penyimpanan)
5. **`/home` (User Home Directories)**
   * **Penjelasan:** Tempat menyimpan data pribadi dan konfigurasi spesifik milik masing-masing pengguna biasa.
   * **Contoh Kegunaan:** `/home/habib/Documents` atau `/home/habib/Downloads`.
6. **`/var` (Variable Data)**
   * **Penjelasan:** Menyimpan data yang ukurannya sering berubah atau dinamis saat sistem berjalan.
   * **Contoh Kegunaan:** File log sistem (`/var/log/syslog`), file website Nginx (`/var/www/html`), database file.
7. **`/tmp` (Temporary Files)**
   * **Penjelasan:** Menyimpan file sementara yang dibuat oleh aplikasi. File di direktori ini biasanya akan dihapus secara otomatis saat sistem di-*reboot*.
8. **`/dev` (Device Files)**
   * **Penjelasan:** Di Linux, perangkat keras direpresentasikan sebagai file. Direktori ini berisi berkas representasi perangkat keras.
   * **Contoh Kegunaan:** `/dev/sda` (harddisk utama), `/dev/null` (perangkat virtual penyerap input).
9. **`/proc` & `/sys` (Virtual/Pseudo Filesystems)**
   * **Penjelasan:** Direktori virtual yang dibuat langsung oleh kernel di dalam RAM untuk menyajikan informasi status sistem secara *real-time*.
   * **Contoh Kegunaan:** `/proc/cpuinfo` (informasi spesifikasi CPU), `/proc/meminfo` (status pemakaian RAM).
10. **`/opt` (Optional Add-on Software)**
    * **Penjelasan:** Tempat menginstal aplikasi pihak ketiga yang mandiri (standalone) di luar bawaan paket manajer distro.

---

## 3. Sistem Permission dan Owner pada Linux

Setiap file dan direktori di Linux memiliki aturan hak akses (*permission*) dan kepemilikan (*ownership*) untuk menjamin keamanan sistem.

### a. Kepemilikan (Ownership)
Hak akses terbagi ke dalam 3 tingkatan subjek:
1. **User (`u`)**: Pengguna yang memiliki file tersebut (Owner).
2. **Group (`g`)**: Kelompok pengguna yang terdaftar pada file tersebut.
3. **Others (`o`)**: Pengguna lain di luar owner dan anggota group.

### b. Jenis Permission & Nilai Octal

| Permission | Simbol | Nilai Octal | Arti pada File | Arti pada Direktori |
| :--- | :---: | :---: | :--- | :--- |
| **Read** | `r` | `4` | Membaca isi file | Melihat daftar file di dalam direktori (`ls`) |
| **Write** | `w` | `2` | Mengedit/mengubah file | Membuat, menghapus, atau mengubah nama file di dalamnya |
| **Execute** | `x` | `1` | Menjalankan file sebagai program/script | Masuk ke dalam direktori (`cd`) |

### c. Membaca Format Output `ls -l`

Contoh perintah: `ls -l script.sh`
```text
-rwxr-xr-- 1 habib developers 4096 Sep  1 10:00 script.sh
```

Penjelasan karakter `-rwxr-xr--`:
* Karakter 1 (`-`): Tipe file (`-` = file biasa, `d` = direktori, `l` = symlink).
* Karakter 2–4 (`rwx`): Permission untuk **User** (Read, Write, Execute = $4+2+1 = 7$).
* Karakter 5–7 (`r-x`): Permission untuk **Group** (Read, Execute = $4+0+1 = 5$).
* Karakter 8–10 (`r--`): Permission untuk **Others** (Read only = $4+0+0 = 4$).
* `habib`: Nama **User** pemilik.
* `developers`: Nama **Group** pemilik.

### d. Contoh Perintah Manajemen Permission & Owner

1. **Mengubah Permission dengan `chmod`:**
   ```bash
   # Menggunakan angka octal (User: rwx (7), Group: r-x (5), Others: r-x (5))
   chmod 755 script.sh

   # Menggunakan notasi simbolik (Menambahkan akses execute ke owner)
   chmod u+x script.sh

   # Mencabut akses write dari group dan others
   chmod go-w document.txt
   ```

2. **Mengubah Owner dan Group dengan `chown`:**
   ```bash
   # Mengubah owner menjadi 'habib' dan group menjadi 'www-data'
   chown habib:www-data /var/www/html/index.html

   # Mengubah owner direktori beserta seluruh isinya secara rekursif (-R)
   chown -R habib:habib /home/habib/project
   ```

---

## 4. Perbedaan Antara Bash, Sh, dan Jenis-Jenis Shell Lain

Shell adalah program penerjemah perintah (*command line interpreter*) yang menerima instruksi ketikan pengguna dan meneruskannya ke kernel.

```
+----------+      +-------+      +--------+      +----------+
| Pengguna | ---> | Shell | ---> | Kernel | ---> | Hardware |
+----------+      +-------+      +--------+      +----------+
```

### Jenis-Jenis Shell Utama

1. **`sh` (Bourne Shell)**
   * **Deskripsi:** Shell paling awal dan standar dalam keluarga Unix. Menjadi acuan standar POSIX.
   * **Karakteristik:** Sangat ringan, fungsi sederhana, terbatas (tidak ada autocompletion bawaan atau histori perintah tingkat lanjut).
   * **Penggunaan:** Sering digunakan sebagai symlink ke shell ringan lain untuk eksekusi script boot yang butuh performa cepat.

2. **`bash` (Bourne-Again Shell)**
   * **Deskripsi:** Pengembangan lanjutan dari `sh` buatan proyek GNU. Merupakan shell standar (*default*) pada hampir seluruh distro Linux.
   * **Fitur Tambahan:** Menyediakan autocompletion (`Tab`), sejarah perintah (`history`), fungsi alias, array, serta pengkondisian canggih `[[ ]]`.

3. **`zsh` (Z Shell)**
   * **Deskripsi:** Shell modern yang sangat fleksibel dan kaya fitur. Merupakan shell default pada macOS.
   * **Fitur Tambahan:** Mendukung *plugin* dan *theme* (misalnya via framework *Oh My Zsh*), koreksi otomatis ejaan perintah, serta autocompletion pintar dengan daftar pilihan interaktif.

4. **`fish` (Friendly Interactive Shell)**
   * **Deskripsi:** Shell interaktif yang dirancang dengan prinsip langsung siap pakai tanpa perlu konfigurasi rumit.
   * **Fitur Tambahan:** *Auto-suggestion* otomatis berdasarkan histori ketikan (berwarna abu-abu), pewarnaan sintaks (*syntax highlighting*) secara langsung saat mengetik.

5. **`dash` (Debian Almquist Shell)**
   * **Deskripsi:** Implementasi `sh` yang sangat cepat dan hemat memori pada lingkungan Debian/Ubuntu.
   * **Penggunaan:** Pada Ubuntu, `/bin/sh` sebenarnya dialiaskan ke `/bin/dash` untuk mempercepat proses pembuatan dan eksekusi script sistem.

### Perbandingan Sintaks Script

* **Script POSIX compliant (`/bin/sh`):**
  ```sh
  #!/bin/sh
  if [ "$NAME" = "Habib" ]; then
      echo "Hello Habib"
  fi
  ```

* **Script khusus Bash (`/bin/bash`):**
  ```bash
  #!/bin/bash
  # Memakai sintaks bawaan Bash (Array & pengkondisian tingkat lanjut)
  names=("Habib" "Rizki" "Admin")
  if [[ "${names[0]}" == "Habib" ]]; then
      echo "Selamat Datang, ${names[0]}!"
  fi
  ```

---

## 5. Prinsip Enkripsi pada SSH (Secure Shell)

SSH (Secure Shell) adalah protokol jaringan kriptografis yang digunakan untuk komunikasi data secara aman dan *remote login* antar komputer melalui jaringan yang tidak aman.

SSH menggabungkan 3 teknik kriptografi:

```
                  +-----------------------------------+
                  |        SSH SECURITY STACK         |
                  +-----------------------------------+
                  | 1. Symmetric Encryption           | (Kerahasiaan Data Sesi)
                  | 2. Asymmetric Encryption          | (Otentikasi & Pertukaran Kunci)
                  | 3. Hashing / HMAC                 | (Integritas Data)
                  +-----------------------------------+
```

### a. Enkripsi Asimetris (Asymmetric Encryption)
* **Konsep:** Menggunakan sepasang kunci matematika: **Public Key** (kunci publik) dan **Private Key** (kunci privat).
* **Prinsip Kerja:** Data yang dienkripsi dengan Public Key hanya bisa didekripsi menggunakan Private Key pasangannya.
* **Penggunaan pada SSH:**
  * Digunakan saat proses pembentukan koneksi awal (*handshake*) untuk memverifikasi identitas server dan otentikasi client tanpa perlu mengirim kata sandi.
  * Public key ditaruh di server (pada file `~/.ssh/authorized_keys`), sedangkan Private key disimpan aman di komputer client.

### b. Enkripsi Simetris (Symmetric Encryption)
* **Konsep:** Menggunakan **satu kunci rahasia yang sama** untuk enkripsi dan dekripsi pesan.
* **Prinsip Kerja:** Algoritma seperti AES (Advanced Encryption Standard) atau ChaCha20 digunakan karena kecepatannya yang sangat tinggi dibanding enkripsi asimetris.
* **Penggunaan pada SSH:**
  * Setelah proses otentikasi berhasil, client dan server menyepakati satu kunci sesi simetris sementara (*Session Key*) menggunakan algoritma **Diffie-Hellman Key Exchange**.
  * Seluruh lalu lintas data terminal selanjutnya dienkripsi menggunakan *Session Key* simetris ini.

### c. Hashing & Integrity Check (HMAC)
* **Konsep:** Fungsi hash satu arah (*one-way hash*) yang menghasilkan *fingerprint* unik dari data.
* **Penggunaan pada SSH:** Menggunakan **HMAC (Hash-based Message Authentication Code)** untuk memastikan bahwa data yang dikirim tidak diubah, diintip, atau dimanipulasi oleh pihak ketiga di tengah jalan (*Data Integrity Check*).

### Ringkasan Alur Koneksi SSH
1. **Host Verification:** Client menghubungi server SSH; server mengirimkan Public Key server untuk verifikasi identitas host.
2. **Key Exchange (Diffie-Hellman):** Client dan Server membuat *Session Key* simetris bersama tanpa pernah mengirimkan kunci tersebut secara langsung melewati jaringan.
3. **User Authentication:** Client mengotentikasi diri menggunakan sepasang SSH key (Private Key client menjawab tantangan enkripsi dari Public Key di server).
4. **Encrypted Session:** Seluruh komunikasi selanjutnya berjalan secara terenkripsi cepat menggunakan enkripsi simetris.

---

## 6. Perbedaan Antara HTTP dan HTTPS

| Parameter | HTTP (Hypertext Transfer Protocol) | HTTPS (HTTP Secure) |
| :--- | :--- | :--- |
| **Definisi** | Protokol transfer teks tanpa enkripsi | Protokol HTTP yang dilapisi enkripsi TLS/SSL |
| **Port Default** | Port `80` | Port `443` |
| **Keamanan Data** | *Plaintext* (Teks mentah tanpa enkripsi) | Terenkripsi penuh (Ciphertext) |
| **Sertifikat** | Tidak memerlukan sertifikat | Memerlukan Sertifikat SSL/TLS dari CA |
| **Kerentanan** | Rentan penyadapan (*Eavesdropping*) dan Man-In-The-Middle (MITM) | Aman dari penyadapan dan manipulasi data di tengah jalan |
| **Kecepatan** | Lebih cepat sedikit karena tanpa *overhead* enkripsi | Membutuhkan proses *TLS Handshake*, namun dioptimasi oleh HTTP/2 & HTTP/3 |

### Ilustrasi Komunikasi

* **HTTP:**
  ```text
  Client ------------ [ Password: 12345 (Teks Terbuka) ] ------------> Server
  ```
  *(Jika disadap oleh peretas di jaringan WiFi umum, kata sandi langsung terlihat jelas).*

* **HTTPS:**
  ```text
  Client ------------ [ Enkripsi: a8f9c2d7e1#$!% (Ciphertext) ] -------> Server
  ```
  *(Peretas hanya melihat sekumpulan karakter acak yang tidak dapat dibaca).*

### Tiga Trik Utama HTTPS:
1. **Encryption (Kerahasiaan):** Mengamankan data dari penyadapan.
2. **Data Integrity (Integritas):** Memastikan data tidak bisa dimodifikasi atau dirusak saat dikirim.
3. **Authentication (Otentikasi):** Memastikan pengguna benar-benar terhubung ke server yang asli, bukan server palsu/penipu.

---

## 7. Docker OCI (Open Container Initiative) Compliance Standard

**Open Container Initiative (OCI)** adalah proyek kolaborasi industri terbuka yang dibentuk pada tahun 2015 oleh Docker, Red Hat, Google, CoreOS, dan para pemimpin industri lainnya di bawah naungan Linux Foundation.

### Tujuan Utama OCI
Menciptakan **standar terbuka industri** untuk format *container image* dan *container runtime* agar aplikasi kontainer bersifat independen, dapat dijalankan di mana saja, serta menghindari ketergantungan pada satu vendor (*vendor lock-in*).

```
                      +------------------------------------+
                      |    OCI SPECIFICATION STANDARDS     |
                      +------------------------------------+
                                 /              \
                                /                \
   +----------------------------------+    +------------------------------------+
   |   OCI Image Specification        |    |   OCI Runtime Specification        |
   |   (Format struktur tar, manifest,|    |   (Standar cara menjalankan        |
   |    dan layer image)              |    |    kontainer dari image)           |
   +----------------------------------+    +------------------------------------+
                     |                                      |
         Contoh: Docker Image,                Contoh Runtime OCI:
         Podman Image                         runc, crun, kata-containers
```

### 2 Spesifikasi Utama OCI:

1. **OCI Image Specification (image-spec):**
   * Menentukan standar format pembuatan *container image*.
   * Mengatur struktur manifest, konfigurasi JSON, serta *filesystem layers* dalam format *tarball*.
   * **Dampak:** Image yang dibuat menggunakan Docker dapat dipublikasikan ke registry standar dan dijalankan oleh platform lain.

2. **OCI Runtime Specification (runtime-spec):**
   * Menentukan standar spesifikasi siklus hidup kontainer (*container lifecycle*: create, start, stop, delete).
   * Mengatur bagaimana *runtime* berinteraksi dengan fitur kernel Linux (namespaces, cgroups, seccomp).
   * **Contoh Runtime Standard OCI:** `runc` (default runtime pada Docker dan Containerd).

### Manfaat OCI Compliance:
Dengan adanya standar OCI, *container image* yang Anda *build* menggunakan Docker dapat dijalankan tanpa perubahan di berbagai *container engine* dan pengatur orkestrasi seperti:
* **Docker**
* **Podman**
* **Kubernetes (via Containerd / CRI-O)**
* **AWS Fargate / Google Cloud Run**

---

## 8. Perbedaan Antara Container dan Virtual Machine (VM)

```
       VIRTUAL MACHINES (VM)                         CONTAINERS
+---------------------------------+     +---------------------------------+
| App A   | App B   | App C       |     | App A   | App B   | App C       |
| Bins/Lib| Bins/Lib| Bins/Lib    |     | Bins/Lib| Bins/Lib| Bins/Lib    |
| Guest OS| Guest OS| Guest OS    |     +---------+---------+-------------+
+---------+---------+-------------+     |     Container Engine (Docker)   |
|           Hypervisor            |     +---------------------------------+
+---------------------------------+     |         Host Operating System   |
|      Host Operating System      |     +---------------------------------+
+---------------------------------+     |            Hardware             |
|            Hardware             |     +---------------------------------+
+---------------------------------+
```

### Tabel Perbandingan

| Fitur | Virtual Machine (VM) | Container |
| :--- | :--- | :--- |
| **Arsitektur Isolasi** | Isolasi tingkat perangkat keras (*Hardware-level*) via Hypervisor. | Isolasi tingkat proses OS (*OS-level*) menggunakan Kernel Namespaces & CGroups. |
| **Sistem Operasi** | Setiap VM membawa *Guest OS* lengkap sendiri. | Membagi (*share*) Kernel dari Host OS bersama kontainer lain. |
| **Ukuran Image** | Sangat Besar (Berukuran Gigabyte / GB). | Sangat Ringan (Berukuran Megabyte / MB). |
| **Waktu Booting** | Lambat (Hitungan menit). | Sangat Cepat (Hitungan detik atau milidetik). |
| **Efisiensi Resource** | Konsumsi CPU & RAM tinggi karena overhead *Guest OS*. | Sangat efisien, hanya menggunakan resource sesuai kebutuhan proses. |
| **Keamanan / Isolasi** | Sangat kuat (Isolasi total antar VM). | Kuat, tetapi keamanan bergantung pada isolasi kernel bersama. |

---

## 9. Definisi dan Manfaat Image Layer pada Docker

### Definisi Image Layer
Docker Image disusun atas **kumpulan lapisan bertingkat yang bersifat *Read-Only*** (*stacked read-only layers*). Setiap perintah atau instruksi di dalam `Dockerfile` (seperti `FROM`, `RUN`, `COPY`) akan menghasilkan satu *layer* baru.

Saat container dijalankan dari sebuah image, Docker menambahkan satu lapisan tipis paling atas yang bersifat **Read-Write** (*Container Layer* / *Writable Layer*).

```
+-------------------------------------------------------+
|  Container Layer (Read-Write)                         |  <-- Tempat perubahan data saat container berjalan
+-------------------------------------------------------+
|  Layer 3: COPY . /app           (Read-Only)           |  <-- Dihasilkan dari instruksi COPY
+-------------------------------------------------------+
|  Layer 2: RUN apt-get install   (Read-Only)           |  <-- Dihasilkan dari instruksi RUN
+-------------------------------------------------------+
|  Layer 1: FROM node:18-alpine   (Read-Only Base Image)|  <-- Dihasilkan dari base image
+-------------------------------------------------------+
```

### Manfaat Utama Arsitektur Image Layer

1. **Reusability & Storage Efficiency (Hemat Penyimpanan):**
   * Beberapa image yang menggunakan *base layer* yang sama (misal `ubuntu:22.04`) hanya akan menyimpan *base layer* tersebut satu kali di harddisk server.

2. **Build Caching (Proses Build Cepat):**
   * Saat melakukan `docker build`, Docker mengecek apakah *layer* tertentu pernah di-build sebelumnya. Jika tidak ada perubahan kode pada instruksi tersebut, Docker akan menggunakan cache dari layer sebelumnya.

3. **Efisiensi Network Transfer:**
   * Saat melakukan `docker pull` atau `docker push`, Docker hanya mengunduh/mengunggah layer-layer yang belum ada atau berubah di registry, sehingga menghemat bandwidth internet.

---

## 10. Kegunaan Docker Volume dan Docker Network Beserta Contohnya

### a. Docker Volume

#### Definisi & Kegunaan
Secara *default*, file yang dibuat di dalam kontainer bersifat sementara (*ephemeral*) dan akan hilang begitu kontainer dihapus. **Docker Volume** adalah mekanisme untuk menyimpan data secara permanen (*persistent storage*) di luar siklus hidup kontainer pada host machine.

#### Contoh Penggunaan Docker Volume
1. **Membuat Volume:**
   ```bash
   docker volume create pgdata_volume
   ```

2. **Menjalankan Database Postgres dengan Volume:**
   ```bash
   docker run -d \
     --name database-server \
     -e POSTGRES_PASSWORD=rahasia \
     -v pgdata_volume:/var/lib/postgresql/data \
     postgres:15-alpine
   ```
   *(Data tabel PostgreSQL di `/var/lib/postgresql/data` akan tetap tersimpan aman di host meskipun kontainer `database-server` dihentikan atau dihapus).*

---

### b. Docker Network

#### Definisi & Kegunaan
**Docker Network** digunakan untuk mengisolasi, menghubungkan, dan mengatur komunikasi antar kontainer maupun antara kontainer dengan jaringan luar/internet.

#### Tipe Driver Network Utama:
* **`bridge` (Default):** Jaringan privat internal pada satu host. Kontainer dalam jaringan bridge yang sama dapat saling berkomunikasi menggunakan nama kontainer (*DNS resolution*).
* **`host`:** Kontainer membagi langsung stack jaringan milik host (tanpa isolasi port).
* **`none`:** Mematikan seluruh akses jaringan pada kontainer.
* **`overlay`:** Menghubungkan kontainer di beberapa host fisik berbeda (digunakan pada Docker Swarm/Cluster).

#### Contoh Penggunaan Docker Network
1. **Membuat Jaringan Kustom (Bridge):**
   ```bash
   docker network create app-net
   ```

2. **Menjalankan Backend API dalam Jaringan `app-net`:**
   ```bash
   docker run -d \
     --name backend-api \
     --network app-net \
     my-backend-image
   ```

3. **Menjalankan Frontend Web Server dalam Jaringan yang Sama:**
   ```bash
   docker run -d \
     --name frontend-web \
     --network app-net \
     -p 80:80 \
     my-frontend-image
   ```

> **Hasil:** Aplikasi `frontend-web` dapat memanggil API di `backend-api` secara langsung menggunakan nama hostname `http://backend-api:5000` tanpa perlu mengetahui alamat IP internal kontainer.

---

## 11. Definisi dan Tujuan Penggunaan Web Server dan Reverse Proxy

### a. Web Server

#### Definisi
Web Server adalah perangkat lunak (atau komputer) yang bertugas menerima permintaan HTTP/HTTPS dari klien (seperti *web browser*) dan mengembalikan tanggapan (*response*) berupa halaman web, file statis (HTML, CSS, JavaScript, Gambar), atau meneruskannya ke aplikasi backend.

#### Contoh Web Server Popular
* **Nginx**
* **Apache HTTP Server**
* **Caddy**
* **LiteSpeed**

#### Tujuan Utama Penggunaan Web Server:
1. Menyajikan konten statis web ke pengguna dengan cepat.
2. Mengatur pengiriman respon header, status kode HTTP, dan MIME types.
3. Mengatur batasan akses file dan hak akses keamanan web.

---

### b. Reverse Proxy

#### Definisi
Reverse Proxy adalah server yang diposisikan di depan satu atau beberapa web server/backend service. Reverse proxy menerima permintaan dari klien luar, lalu meneruskan (*forward*) permintaan tersebut ke server internal yang sesuai, kemudian mengembalikan hasilnya kembali ke klien.

```
                                +-------------------+
                                |   Reverse Proxy   |
                                |      (Nginx)      |
                                +---------+---------+
                                          |
                   +----------------------+----------------------+
                   |                      |                      |
                   v                      v                      v
          +------------------+   +------------------+   +------------------+
          | Backend Node.js  |   | Backend Python   |   | Database Service |
          |   (Port 3000)    |   |   (Port 8000)    |   |   (Port 5432)    |
          +------------------+   +------------------+   +------------------+
```

#### Tujuan Utama Penggunaan Reverse Proxy:

1. **Load Balancing (Pemerataan Beban):**
   * Membagi lalu lintas pengunjung secara merata ke beberapa server backend agar tidak ada satu server yang *overload*.
2. **Security & Anonymity (Keamanan Topologi):**
   * Menyembunyikan keberadaan dan IP asli dari server backend internal dari jangkauan publik.
3. **SSL/TLS Termination (Offloading Enkripsi):**
   * Mengelola enkripsi sertifikat HTTPS di tingkat Reverse Proxy, sehingga server backend hanya perlu memproses HTTP biasa tanpa membuang CPU resource untuk enkripsi.
4. **Caching & Kompresi:**
   * Menyimpan *cache* konten statis dan melakukan kompresi data (misal Gzip/Brotli) sebelum dikirim ke pengguna untuk mempercepat *loading page*.

#### Contoh Konfigurasi Reverse Proxy pada Nginx (`nginx.conf`)

```nginx
server {
    listen 80;
    server_name api.eventhub.com;

    location / {
        # Meneruskan traffic ke aplikasi Node.js yang berjalan di port 3000
        proxy_pass http://127.0.0.1:3000;
        
        # Meneruskan HTTP Header asli dari client
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
