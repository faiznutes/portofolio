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

## API base configuration
- Default local API base: `http://127.0.0.1:8000`
- Override from browser console:
  - `PORTFOLIO_API.setBaseUrl('https://api.yourdomain.com')`
- Override via HTML meta tag:
  - `<meta name="portfolio-api-base" content="https://api.yourdomain.com">`

## Admin login (seed)
- `admin@portfolio.local` / `admin12345`
