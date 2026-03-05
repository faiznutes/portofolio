# TASKS SEO 2 Phase

## Phase 1 - Major (prioritas tinggi)

1. [x] Ambil baseline audit SEO saat ini (title, meta, canonical, robots, sitemap, status code).
2. [x] Standarisasi canonical dan `og:url` ke clean path (`/`, `/works`, `/services`, `/cv`, `/contact`).
3. [x] Rewrite title dan meta description halaman publik sesuai keyword target.
4. [x] Upgrade JSON-LD (`WebSite`, `Person/ProfessionalService`, `Service`, `BreadcrumbList`) sesuai konteks halaman.
5. [x] Perbaiki `frontend/sitemap.xml` menjadi absolute URL dan tambah `lastmod`.
6. [x] Sinkronkan `frontend/robots.txt` dengan sitemap final dan pembatasan halaman admin.
7. [x] Tambahkan redirect `.html` ke clean URL di `deploy/docker/nginx-frontend.conf` untuk mencegah URL duplikat.
8. [x] Tetapkan policy indexing untuk `work-detail` generic page (disarankan `noindex,follow` tahap awal).
9. [x] Jalankan validasi hasil akhir SEO on-page dan technical checks.

## Phase 2 - Minor (setelah major stabil)

1. [x] Polishing copy heading/body agar lebih natural untuk intent pencarian.
2. [x] Fine tuning OG/Twitter title-description-image untuk share preview dan CTR.
3. [x] Optimasi internal linking antar halaman dengan anchor yang lebih deskriptif.
4. [x] Tambahkan FAQ ringan jika relevan untuk long-tail keyword.
5. [x] Susun checklist monitoring pasca deploy (index coverage, query branded, query non-branded).
