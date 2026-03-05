# Frontend (Production Connected)

Frontend statis untuk public portfolio + admin CMS yang sudah terhubung ke backend Laravel API.

## Public pages
- `index.html`
- `works.html`
- `work-detail.html`
- `services.html`
- `cv.html`
- `contact.html`

## Admin pages
- `admin/login.html`
- `admin/dashboard.html`
- `admin/works.html`
- `admin/categories.html`
- `admin/tags.html`
- `admin/highlights.html`
- `admin/banners.html`
- `admin/services.html`
- `admin/testimonials.html`
- `admin/cv.html`
- `admin/leads.html`
- `admin/settings.html`

## Run locally
1. Start backend API: `http://127.0.0.1:8000`
2. Start frontend static server:
   - double-click `start-localhost.bat`, or
   - `python -m http.server 8080`
3. Open `http://localhost:8080/`
4. Jika ada perubahan class Tailwind, rebuild CSS:
   - `cd frontend`
   - `npm install` (sekali saja)
   - `npm run build:css` (output ke `frontend/assets/tailwind.css`)
5. Jika ada perubahan halaman indexable, regenerate sitemap:
   - `cd ..` (root project)
   - `node scripts/generate-sitemap.mjs`

## API base configuration
- Default local API base: `http://127.0.0.1:8000`
- Production default: same-origin `https://faiznute.site/api/*` (tanpa override manual).
- Override from browser console:
  - `PORTFOLIO_API.setBaseUrl('https://yourdomain.com')`
- Override via HTML meta tag:
  - `<meta name="portfolio-api-base" content="https://yourdomain.com">`

## Admin login (seed)
- `admin@portfolio.local` / `Admin!2026Strong` (default local/testing fallback)

## Performance and UX polish
- Public pages memakai scroll reveal animation + progress indicator.
- Service worker (`/sw.js`) aktif otomatis di HTTPS/localhost untuk cache shell asset statis.
- Asset visual utama landing page sudah dipindah ke format WebP untuk mengurangi payload.
- CI menjalankan `scripts/check-image-budget.mjs` untuk mencegah aset non-legacy > 1 MB masuk ke branch utama.
- CI menjalankan `scripts/generate-sitemap.mjs --check` agar `frontend/sitemap.xml` selalu sinkron.
