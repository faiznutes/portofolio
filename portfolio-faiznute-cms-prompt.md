# PROMPT PACK — Portfolio Faiznute (Web Creator) + Admin Dashboard CMS — MVP v1 (Indonesia)

> Gunakan dokumen ini sebagai **prompt tunggal** untuk AI coding agent.  
> Output yang diharapkan: repo siap jalan dengan UI modern (minimal clean luxury), admin dashboard untuk edit semua konten, dan halaman publik conversion-focused (lead via form + WhatsApp).

---

## 0) Brand & Direction
- Nama/Brand: **Faiznute**
- Positioning utama: **Web Creator** (tetap bisa tampilkan skill Graphic Design & Video Editing sebagai layanan/kapabilitas)
- Target klien: **semua (UMKM, F&B, event, dll)**
- Gaya visual: **minimal, clean, luxury, modern**
- Warna dominan: **biru + silver/putih**
- Bahasa: **Indonesia**
- CTA: **WhatsApp + Form (lead booking)** + link sosial (IG/TikTok)
- Karya: sumber referensi link **Instagram & TikTok** (untuk setiap project bisa punya link)

---

## 1) Rekomendasi Stack (pilih ini agar cepat & rapi)
**Pilihan disarankan (MVP terbaik untuk CMS cepat):**
- Backend: **Laravel 11**
- Frontend: **Blade + TailwindCSS**
- Interaktif admin & form cepat: **Livewire v3**
- Auth: **Laravel Breeze**
- Role: cukup **Admin** (opsional tambah spatie/permission kalau ingin multi admin)
- DB: **MySQL**
- Storage: Laravel `public` disk (thumbnail project, banner)
- Deploy test: local + nanti VPS

Alasan: cepat selesai, mudah maintain, dan admin dashboard enak.

---

## 2) PRD Singkat
### 2.1 Problem
- Butuh website portfolio yang terlihat profesional, modern, dan “familiar” (tidak membosankan).
- Harus bisa update project/works dengan mudah via admin (tanpa edit kode).
- Harus bisa mengonversi visitor menjadi lead (WA + form).

### 2.2 Goals (MVP)
- Landing page menonjolkan highlight work, layanan, trust, CTA.
- Portfolio list + filter kategori (Web / Design / Video).
- Case study detail per project (problem → role → process → result).
- Halaman CV (profil, pengalaman, skill, tools, education, sertifikasi).
- Admin dashboard CMS: CRUD untuk semua konten.

### 2.3 Success Metrics (MVP)
- Visitor bisa menemukan karya terbaik < 10 detik (di home).
- Form lead tersimpan + redirect WA.
- Admin bisa tambah project lengkap < 3 menit.

---

## 3) MVP Scope
### 3.1 Public (Visitor)
- Home (hero + highlights + featured works + services + testimonials + CTA)
- Works/Portfolio list + filter (kategori, tag)
- Work detail (case study)
- Services page (paket/jasa)
- About/CV page
- Contact page (form + WA)

### 3.2 Admin CMS
- Login admin
- Dashboard (stats sederhana)
- CRUD:
  - Projects/Works + gallery + metrics + tags + category
  - Highlights (featured work di home)
  - Banners/Hero (apa yang ingin ditonjolkan)
  - Services (jasa/paket)
  - Testimonials (dummy dulu)
  - CV sections (experience, education, skills, tools, certificates)
  - Site settings (WhatsApp number, IG/TikTok links, email, SEO defaults)

---

## 4) Roles
- **Guest/Visitor**: view pages, submit lead form
- **Admin**: manage all content (CMS)

---

## 5) Pages & Routes
### Public
- `GET /` Home
- `GET /works` Works list + filter
- `GET /works/{slug}` Work detail (case study)
- `GET /services` Services
- `GET /cv` CV / About
- `GET /contact` Contact
- `POST /leads` Submit lead (form)

### Admin (auth)
Prefix: `/admin`
- `GET /admin` Dashboard
- `GET /admin/works` + CRUD
- `GET /admin/categories` + CRUD
- `GET /admin/tags` + CRUD
- `GET /admin/highlights` + CRUD + sort
- `GET /admin/banners` + CRUD + active toggle
- `GET /admin/services` + CRUD
- `GET /admin/testimonials` + CRUD
- `GET /admin/cv` manage CV sections (experience/education/skills/tools/certs)
- `GET /admin/leads` list + status + note
- `GET /admin/settings` site settings + SEO + social links

---

## 6) Flow (User Journey)
### Visitor Flow
1) Landing `/` → lihat hero + featured works
2) Scroll: services + proof + testimonials
3) Klik “Lihat Karya” → list works → filter → detail case study
4) Klik CTA “Konsultasi via WhatsApp” atau isi form → lead tersimpan → success + tombol WA

### Admin Flow
1) Login
2) Tambah work lengkap (thumbnail, gallery, case study)
3) Set highlight + banner untuk home
4) Update CV sections
5) Cek leads masuk + ubah status (new/contacted/closed)

---

## 7) Data Model (Database)
### users
- id, name, email (unique), password, timestamps

### categories
- id, name, slug unique, sort_order, is_active, timestamps

### tags
- id, name, slug unique, timestamps

### works
- id, title, slug unique, category_id
- summary, role, tools (json/text), outcome_metrics (json/text)
- case_problem, case_process, case_result
- client_name?, year?
- is_featured, is_published
- thumbnail_path?, external_link?, social_link_ig?, social_link_tiktok?
- sort_order, timestamps

### work_images
- id, work_id, image_path, caption?, sort_order, timestamps

### work_tag (pivot)
- work_id, tag_id

### highlights
- id, title, subtitle?, work_id?, image_path?, cta_text?, cta_url?
- is_active, sort_order, timestamps

### banners
- id, title, subtitle?, image_path?, badge_text?
- cta_primary_text, cta_primary_url, cta_secondary_text?, cta_secondary_url?
- is_active, start_at?, end_at?, sort_order, timestamps

### services
- id, name, description, deliverables (json/text), starting_price?, duration?
- is_featured, sort_order, is_active, timestamps

### testimonials
- id, client_name, client_role?, quote, rating, is_active, sort_order, timestamps

### cv_experiences
- id, title, company, location?, start_date, end_date?, is_current, description, sort_order, timestamps

### cv_educations
- id, school, major?, start_year?, end_year?, description?, sort_order, timestamps

### cv_skills
- id, name, level (basic/intermediate/advanced), group (web/design/video/softskill), sort_order, timestamps

### cv_tools
- id, name, group (web/design/video), sort_order, timestamps

### cv_certificates (optional)
- id, name, issuer?, year?, url?, sort_order, timestamps

### leads
- id, name, phone, email?, message?, service_interest?, budget_range?
- status (new/contacted/closed/lost), note?, source (web), timestamps

### settings
- id, key unique, value, is_secret bool, timestamps

---

## 8) CRUD Requirements (Admin)
- Works: full CRUD + gallery upload + tags + featured/publish toggle + sort
- Banners/Highlights: CRUD + active toggle + schedule + sort
- Services/Testimonials: CRUD + sort
- CV: CRUD tiap section + sort
- Leads: list + filter status + search + update status + note
- Settings: WA, IG, TikTok, email, SEO defaults

---

## 9) UI/UX MODERN STANDARD (Wajib, “wah” & familiar)
### Visual
- Minimal clean luxury, banyak white space, card elegan (rounded-2xl, border halus, shadow lembut).
- Warna: blue (primary), putih/silver/abu (neutral), accent tipis.
- Typography scale konsisten, heading tegas, body nyaman.

### Layout
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Section spacing: `py-12 md:py-16`
- Grid rapi, alignment presisi.

### Interaction
- Hover & focus states halus, skeleton loading untuk grid, empty state yang membantu.
- Sticky CTA WhatsApp di mobile.

### Familiar structure
- Hero + CTA, featured works, services, proof, testimonials, FAQ (optional), final CTA.

### Accessibility
- Kontras cukup, tap target 44px, focus ring jelas.

---

## 10) Copywriting Standard (Indonesia)
Tone: profesional, ramah, jelas, benefit-driven (tidak lebay).

Hero example:
- Headline: “Saya bantu bisnismu tampil profesional lewat website yang rapi & siap jual.”
- Sub: “Landing page, company profile, hingga toko online—dibuat cepat, clean, dan mudah dikelola.”
- CTA: “Konsultasi via WhatsApp” + “Lihat Karya”

Microcopy form:
- “Saya balas maksimal 1x24 jam kerja.”
- Success: “Mantap! Pesanmu sudah terkirim. Klik WhatsApp untuk lanjut diskusi.”

---

## 11) Layout Responsif (Flex + Grid + Tailwind)
- Works grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8`
- Navbar: `flex items-center justify-between gap-3` + menu `hidden md:flex`
- Work detail: `grid grid-cols-1 lg:grid-cols-12 gap-6` (content 8, sidebar 4)
- Card: `flex flex-col h-full` + CTA `mt-auto`
- Image: `aspect-[4/3]` + `object-cover`
- Focus ring: `focus-visible:ring-2 focus-visible:ring-offset-2`

---

## 12) Seed Data (Dummy untuk demo)
- Admin: `admin@demo.test` / `password`
- Categories: Web, Design, Video
- Tags: Laravel, Tailwind, Figma, Premiere, After Effects, SEO, UI/UX
- Works: 9 dummy (3 per kategori) + 3 featured (dengan case study dummy realistis)
- Banners: 2 aktif (“Open for Project”, “Promo Landing Page”)
- Services: 6
- Testimonials: 6 dummy
- CV: experience 3, education 1, skills/tools lengkap

---

## 13) Repo Structure (disarankan)
```
portfolio-faiznute/
  app/
    Livewire/Admin/
    Http/Controllers/
    Models/
  database/
    migrations/
    factories/
    seeders/
  resources/
    views/
      public/
        home.blade.php
        works/index.blade.php
        works/show.blade.php
        services/index.blade.php
        cv/index.blade.php
        contact/index.blade.php
      admin/
        dashboard.blade.php
        works/
        banners/
        highlights/
        services/
        testimonials/
        cv/
        leads/
        settings/
    views/components/
      navbar.blade.php
      button.blade.php
      badge.blade.php
      work-card.blade.php
      section-heading.blade.php
      footer.blade.php
  routes/web.php
  README.md
```

---

## 14) Definition of Done
- Semua halaman public ada & responsif
- Admin CMS CRUD semua konten + upload berjalan
- Works filter + pagination OK
- Contact form simpan lead + success + CTA WA
- Seed membuat situs langsung terlihat “jadi”
- README run + akun demo

---

# PROMPT EKSEKUSI UNTUK AI CODING (langsung implement)
Bangun project **Laravel 11 + Blade + Tailwind + Livewire** sesuai dokumen ini. Jangan tanya lagi, langsung implement:
1) Install Breeze (Blade) + Livewire.
2) Buat migrations/models/factories/seeders sesuai data model.
3) Buat public pages + controller + blade views.
4) Buat admin CMS dengan Livewire (CRUD lengkap, search/filter, pagination, upload images).
5) Terapkan UI/UX Modern Standard + Copywriting Standard + Layout rules.
6) Buat Blade components reusable.
7) Outputkan:
   - tree file
   - kode inti (migrations/models/livewire/controllers)
   - views/components utama
   - README run + env + migrate/seed + akun demo
Selesai.
