# Legacy Dummy Page Improvement Tasks (Final Stage)

## Objective
Bring legacy landing-page style demos into production-ready quality after core CMS + backend integration is stable.

## Priority 1 - Data and Routing
- [ ] Migrate all legacy `landing-page` projects into dedicated CMS entity (`landing_pages`) with fields: `slug`, `title`, `theme`, `content_json`, `status`.
- [ ] Create public endpoint for landing pages: `GET /api/public/landing-pages` and `GET /api/public/landing-pages/{slug}`.
- [ ] Add admin CRUD for landing pages (including publish/draft and preview links).
- [ ] Replace hardcoded `/landing-pages/*.html` links with CMS-driven routes.

## Priority 2 - Design and UX Quality
- [ ] Standardize typography scale, spacing rhythm, and button hierarchy across all legacy demos.
- [ ] Remove inconsistent color palettes and define reusable theme tokens per template.
- [ ] Add consistent mobile nav, sticky CTA behavior, and form accessibility labels.
- [ ] Audit icon usage and ensure no invalid/fallback icon names.

## Priority 3 - Conversion and Content
- [ ] Normalize CTA copy, trust sections, testimonials, and pricing blocks for all templates.
- [ ] Add structured metadata (title, description, OG image) per dummy page.
- [ ] Add schema markup (`LocalBusiness` / `Product` / `Service`) according to page type.
- [ ] Introduce reusable lead form component wired to `POST /api/public/leads`.

## Priority 4 - Performance and SEO
- [ ] Convert heavy images to optimized web formats and generate responsive sizes.
- [ ] Lazy-load below-the-fold media and preload hero image/fonts.
- [ ] Add canonical tags and internal linking between related pages.
- [ ] Run Lighthouse and set minimum quality gates (Perf >= 85, SEO >= 90).

## Priority 5 - QA and Release
- [ ] Add E2E flow checks: open page -> interact sections -> submit lead.
- [ ] Validate all links are non-broken and no `href="#"` placeholders remain.
- [ ] Add visual regression snapshots for desktop and mobile.
- [ ] Final UAT pass with legacy-to-new content parity checklist.
