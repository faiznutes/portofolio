# SEO Implementation 2 Phase

Dokumen ini dibuat untuk eksekusi cepat, terarah, dan terukur agar skor SEO bisa naik stabil menuju 90+ serta memperkuat ranking brand `Faiznute`.

## Phase 1 - Major (Eksekusi Wajib, Dampak Terbesar)

### 1) Technical SEO Foundation
- Pastikan semua halaman publik punya `title`, `meta description`, `canonical`, `robots`, OG/Twitter yang valid.
- Pastikan redirect `.html -> clean URL` berjalan tanpa loop dan tanpa downgrade scheme (HTTP/HTTPS).
- Validasi `robots.txt` dan `sitemap.xml` live sesuai domain final.

### 2) Indexing Acceleration (Search Console)
- Submit ulang sitemap: `https://faiznute.site/sitemap.xml`.
- Request indexing manual untuk halaman inti: `/`, `/works`, `/services`, `/cv`, `/contact`.
- Cek coverage issue dan perbaiki error crawl jika ada.

### 3) Brand Entity Reinforcement
- Konsistenkan naming brand `Faiznute` di website + sosial.
- Pastikan schema utama (`WebSite`, `ProfessionalService`, `Person/Service`) valid dan konsisten.
- Tambahkan sinyal branded di bio/profil eksternal yang mengarah ke domain utama.

### 4) Data Integrity Production
- Pastikan data publik penting tidak turun setelah deploy (services, cv-items, testimonials).
- Cek endpoint kritikal:
  - `/api/public/testimonials`
  - `/api/public/services`
  - `/api/public/cv-items`

### Definition of Done - Phase 1
- Halaman utama SEO tags lengkap dan valid.
- Sitemap & robots dapat diakses crawler tanpa error.
- Redirect bersih (tidak loop, tidak mixed scheme).
- Search Console submit + indexing request selesai.
- Endpoint publik utama sehat dan menampilkan data.

---

## Phase 2 - Minor (Polish + Growth)

### 1) CTR Optimization
- Uji iterasi title/description untuk halaman utama dan layanan.
- Gunakan copy yang lebih click-worthy tanpa keyword stuffing.

### 2) Content Expansion (Long-tail)
- Tambah 3-5 konten pendukung/FAQ bertema:
  - portofolio web dev
  - jasa video editor
  - jasa editor konten
  - graphic designer untuk UMKM

### 3) Internal Link Enrichment
- Tambah anchor link kontekstual antar halaman utama.
- Pastikan jalur konversi jelas: Home -> Works -> Services -> Contact.

### 4) External Signal Growth
- Tambah backlink branded dari profil sosial/profesional utama.
- Jaga konsistensi NAP/brand mention agar entity semakin kuat.

### Definition of Done - Phase 2
- Snippet CTR meningkat (monitor GSC).
- Long-tail query mulai muncul di impressions.
- Internal linking lebih kuat dan user flow lebih jelas.

---

## Urutan Implementasi Cepat

1. Selesaikan semua item Phase 1 dulu (wajib).
2. Deploy + verifikasi live.
3. Jalankan monitoring 7-14 hari.
4. Masuk Phase 2 untuk growth berkelanjutan.

## KPI Target

- Lighthouse SEO: >= 90 (mobile) pada halaman utama.
- Branded query (`faiznute`, `portofolio faiznute`) naik impression dan klik.
- Tidak ada error indexing kritikal di Search Console.
