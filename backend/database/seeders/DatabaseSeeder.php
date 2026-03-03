<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CvItem;
use App\Models\Banner;
use App\Models\Highlight;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Tag;
use App\Models\Testimonial;
use App\Models\User;
use App\Models\Work;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('tag_work')->truncate();
        DB::table('works')->truncate();
        DB::table('categories')->truncate();
        DB::table('tags')->truncate();
        DB::table('services')->truncate();
        DB::table('testimonials')->truncate();
        DB::table('cv_items')->truncate();
        DB::table('highlights')->truncate();
        DB::table('banners')->truncate();
        DB::table('settings')->truncate();
        Schema::enableForeignKeyConstraints();

        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@portfolio.local'],
            [
                'name' => 'Portfolio Admin',
                'password' => 'admin12345',
                'is_admin' => true,
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'editor@portfolio.local'],
            [
                'name' => 'Portfolio Editor',
                'password' => 'editor12345',
                'is_admin' => false,
            ]
        );

        $categoryMap = [
            'design' => Category::query()->updateOrCreate(
                ['slug' => 'design'],
                ['name' => 'Design', 'is_active' => true, 'sort_order' => 1]
            ),
            'video' => Category::query()->updateOrCreate(
                ['slug' => 'video'],
                ['name' => 'Video', 'is_active' => true, 'sort_order' => 2]
            ),
            'landing-page' => Category::query()->updateOrCreate(
                ['slug' => 'landing-page'],
                ['name' => 'Landing Page', 'is_active' => true, 'sort_order' => 3]
            ),
        ];

        $legacyWorks = [
            [
                'slug' => 'logo-fossei-rakereg-2021',
                'title' => 'Logo FoSSEI RAKEREG 2021',
                'category' => 'design',
                'image' => 'assets/images/legacy/fossei/logo.jpg',
                'excerpt' => 'Logo organisasi dengan filosofi simbolik untuk acara Rakereg FoSSEI.',
                'content' => 'Identitas visual FoSSEI dengan pendekatan geometris modern, elemen kebersamaan, dan semangat progresif untuk regenerasi organisasi.',
                'tags' => ['Logo', 'Design'],
                'tools' => ['Adobe Illustrator', 'Adobe Photoshop'],
                'gallery' => [
                    ['type' => 'image', 'title' => 'Logo Utama', 'src' => 'assets/images/legacy/fossei/logo.jpg'],
                    ['type' => 'image', 'title' => 'Filosofi 1', 'src' => 'assets/images/legacy/fossei/FIlsof 1.jpg'],
                    ['type' => 'image', 'title' => 'Filosofi 2', 'src' => 'assets/images/legacy/fossei/FIlsof 2.jpg'],
                    ['type' => 'image', 'title' => 'Banner Zoom', 'src' => 'assets/images/legacy/fossei/banner zoom.jpg'],
                ],
            ],
            [
                'slug' => 'pencalonan-bupati-lamongan',
                'title' => 'Pencalonan Bupati Lamongan',
                'category' => 'design',
                'image' => 'assets/images/legacy/banner/Social.jpg',
                'excerpt' => 'Produksi visual kampanye dari banner utama, media sosial, hingga kebutuhan acara.',
                'content' => 'Eksekusi materi kampanye dengan visual yang tegas, mudah dibaca, dan konsisten lintas kanal online serta offline.',
                'tags' => ['Design', 'Banner', 'Politik'],
                'tools' => ['Adobe Illustrator', 'Adobe Photoshop'],
                'gallery' => [
                    ['type' => 'image', 'title' => 'Social Banner', 'src' => 'assets/images/legacy/banner/Social.jpg'],
                    ['type' => 'image', 'title' => 'Banner 1', 'src' => 'assets/images/legacy/banner/banner1.jpg'],
                    ['type' => 'image', 'title' => 'Banner 2', 'src' => 'assets/images/legacy/banner/banner2.jpg'],
                    ['type' => 'image', 'title' => 'Banner 3', 'src' => 'assets/images/legacy/banner/banner3.jpg'],
                ],
            ],
            [
                'slug' => 'ayam-lepas-lebak-bulus',
                'title' => 'Ayam Lepas Lebak Bulus',
                'category' => 'design',
                'image' => 'assets/images/legacy/ayam lepas/Kemasan.png',
                'excerpt' => 'Desain kemasan, stiker, dan aset sosial media untuk brand kuliner Ayam Lepas.',
                'content' => 'Pengerjaan branding visual F&B dari packaging sampai konten sosial media untuk meningkatkan konsistensi dan daya tarik brand.',
                'tags' => ['Design', 'Packaging', 'Social Media'],
                'tools' => ['Adobe Illustrator', 'Adobe Photoshop'],
                'gallery' => [
                    ['type' => 'image', 'title' => 'Kemasan', 'src' => 'assets/images/legacy/ayam lepas/Kemasan.png'],
                    ['type' => 'image', 'title' => 'Sticker', 'src' => 'assets/images/legacy/ayam lepas/Sticker Kemasan 2.png'],
                    ['type' => 'image', 'title' => 'Social Post', 'src' => 'assets/images/legacy/ayam lepas/paket20rb.png'],
                    ['type' => 'image', 'title' => 'Promo Post', 'src' => 'assets/images/legacy/ayam lepas/29.png'],
                ],
            ],
            [
                'slug' => 'next-level-properti-grand-opening-video',
                'title' => 'Ide Konsep Video Next Level Property',
                'category' => 'video',
                'image' => 'assets/images/real-video.jpg',
                'excerpt' => 'Konsep video cinematic grand opening untuk perusahaan properti dengan tone premium.',
                'content' => 'Konsep alur video 2-3 menit untuk momen grand opening: opening, ceremony, sambutan, office tour, hingga closing brand story.',
                'tags' => ['Video', 'Property', 'Cinematic'],
                'tools' => ['Adobe Premiere Pro', 'After Effects', 'Color Grading'],
                'gallery' => [
                    ['type' => 'image', 'title' => 'Moodboard', 'src' => 'assets/images/real-video.jpg'],
                ],
            ],
            [
                'slug' => 'bangalexzz-mie-ayam-landing',
                'title' => 'Bangalexzz Mie Ayam Landing Page',
                'category' => 'landing-page',
                'image' => 'assets/images/real-catering.jpg',
                'excerpt' => 'Landing page F&B modern dengan lokalisasi Indonesia dan struktur conversion-friendly.',
                'content' => 'Landing page kampanye kuliner dengan hero kuat, menu grid, trust block, dan CTA pemesanan yang jelas.',
                'project_url' => '/landing-pages/resto-mie-ayam-landing.html',
                'tags' => ['Landing Page', 'F&B', 'Restaurant'],
                'tools' => ['HTML5', 'Tailwind CSS', 'JavaScript'],
                'gallery' => [
                    ['type' => 'link', 'title' => 'Buka Demo HTML', 'src' => '/landing-pages/resto-mie-ayam-landing.html'],
                ],
            ],
            [
                'slug' => 'bangalexzz-nasi-campur-landing',
                'title' => 'Bangalexzz Nasi Campur Landing Page',
                'category' => 'landing-page',
                'image' => 'assets/images/real-social.jpg',
                'excerpt' => 'Contoh handling social content dengan tampilan feed bergaya platform sosial.',
                'content' => 'Demo ini menampilkan bagaimana saya menangani struktur feed, konten card, dan ritme visual ala social platform untuk kebutuhan campaign brand.',
                'project_url' => '/landing-pages/facebook-social-handling-demo.html',
                'tags' => ['Landing Page', 'Social Media', 'Campaign'],
                'tools' => ['HTML5', 'Tailwind CSS', 'JavaScript'],
                'gallery' => [
                    ['type' => 'link', 'title' => 'Buka Demo HTML', 'src' => '/landing-pages/facebook-social-handling-demo.html'],
                ],
            ],
            [
                'slug' => 'bangalexzz-dimsum-modern-landing',
                'title' => 'Bangalexzz Dimsum Modern Landing Page',
                'category' => 'landing-page',
                'image' => 'assets/images/real-event.jpg',
                'excerpt' => 'Landing page dimsum dark modern dengan positioning premium.',
                'content' => 'Landing page dark modern untuk brand dimsum dengan section spesifikasi produk, pricing, dan CTA konversi.',
                'project_url' => '/landing-pages/snack-dimsum-modern.html',
                'tags' => ['Landing Page', 'Dimsum', 'Modern Layout'],
                'tools' => ['HTML5', 'Tailwind CSS', 'JavaScript'],
                'gallery' => [
                    ['type' => 'link', 'title' => 'Buka Demo HTML', 'src' => '/landing-pages/snack-dimsum-modern.html'],
                ],
            ],
            [
                'slug' => 'bangalexzz-dimsum-playful-landing',
                'title' => 'Bangalexzz Dimsum Playful Landing Page',
                'category' => 'landing-page',
                'image' => 'assets/images/real-coffee.jpg',
                'excerpt' => 'Landing page dimsum playful dengan animasi interaktif dan tone fun.',
                'content' => 'Landing page playful dengan visual vibrant, menu card interaktif, dan copywriting yang ramah untuk audiens muda.',
                'project_url' => '/landing-pages/snack-dimsum-playful.html',
                'tags' => ['Landing Page', 'Dimsum', 'Playful Design'],
                'tools' => ['HTML5', 'Tailwind CSS', 'JavaScript'],
                'gallery' => [
                    ['type' => 'link', 'title' => 'Buka Demo HTML', 'src' => '/landing-pages/snack-dimsum-playful.html'],
                ],
            ],
            [
                'slug' => 'bangalexzz-dimsum-luxury-landing',
                'title' => 'Bangalexzz Dimsum Luxury Landing Page',
                'category' => 'landing-page',
                'image' => 'assets/images/real-banner.jpg',
                'excerpt' => 'Landing page ultra-premium dengan dark luxury tone dan gold accent.',
                'content' => 'Landing page luxury dengan visual premium, glass morphism, dan struktur section untuk positioning kelas atas.',
                'project_url' => '/landing-pages/snack-dimsum-luxury.html',
                'tags' => ['Landing Page', 'Dimsum', 'Luxury Design'],
                'tools' => ['HTML5', 'Tailwind CSS', 'JavaScript'],
                'gallery' => [
                    ['type' => 'link', 'title' => 'Buka Demo HTML', 'src' => '/landing-pages/snack-dimsum-luxury.html'],
                ],
            ],
            [
                'slug' => 'property-agent-classic',
                'title' => 'Agent Properti - Solusi Properti Terpercaya',
                'category' => 'landing-page',
                'image' => 'assets/images/real-property.jpg',
                'excerpt' => 'Landing page agen properti bertema corporate dengan CTA konsultasi.',
                'content' => 'Landing page properti dengan fokus trust element, listing unggulan, dan funnel konsultasi untuk calon pembeli.',
                'project_url' => '/landing-pages/property-agent-classic.html',
                'tags' => ['Landing Page', 'Real Estate', 'Professional'],
                'tools' => ['HTML5', 'Tailwind CSS', 'JavaScript'],
                'gallery' => [
                    ['type' => 'link', 'title' => 'Buka Demo HTML', 'src' => '/landing-pages/property-agent-classic.html'],
                ],
            ],
            [
                'slug' => 'property-agent-eco-living',
                'title' => 'Eco-Living Pro - Properti Berkelanjutan',
                'category' => 'landing-page',
                'image' => 'assets/images/real-hero.jpg',
                'excerpt' => 'Landing page properti hijau berfokus pada sustainability messaging.',
                'content' => 'Landing page eco-living dengan pendekatan value proposition berkelanjutan, fitur hemat energi, dan positioning modern family.',
                'project_url' => '/landing-pages/property-agent-eco-living.html',
                'tags' => ['Landing Page', 'Real Estate', 'Sustainable'],
                'tools' => ['HTML5', 'Tailwind CSS', 'JavaScript'],
                'gallery' => [
                    ['type' => 'link', 'title' => 'Buka Demo HTML', 'src' => '/landing-pages/property-agent-eco-living.html'],
                ],
            ],
            [
                'slug' => 'property-agent-urban',
                'title' => 'Urban Properti - Investasi Cerdas Jakarta',
                'category' => 'landing-page',
                'image' => 'assets/images/real-clinic.jpg',
                'excerpt' => 'Landing page properti berfokus pada messaging investasi dan ROI tinggi.',
                'content' => 'Landing page investasi properti dengan visual bold, KPI block, dan CTA cepat untuk konsultasi investor.',
                'project_url' => '/landing-pages/property-agent-urban.html',
                'tags' => ['Landing Page', 'Real Estate', 'Investment'],
                'tools' => ['HTML5', 'Tailwind CSS', 'JavaScript'],
                'gallery' => [
                    ['type' => 'link', 'title' => 'Buka Demo HTML', 'src' => '/landing-pages/property-agent-urban.html'],
                ],
            ],
            [
                'slug' => 'property-agent-terpercaya',
                'title' => 'Properti Terpercaya - Panduan Beli Rumah Aman',
                'category' => 'landing-page',
                'image' => 'assets/images/real-property.jpg',
                'excerpt' => 'Landing page edukasi pembelian properti dengan alur 4-step buyer guide.',
                'content' => 'Landing page edukasi proses pembelian rumah dengan format step-by-step yang mudah dipahami calon buyer.',
                'project_url' => '/landing-pages/property-agent-terpercaya.html',
                'tags' => ['Landing Page', 'Real Estate', 'Trust'],
                'tools' => ['HTML5', 'Tailwind CSS', 'JavaScript'],
                'gallery' => [
                    ['type' => 'link', 'title' => 'Buka Demo HTML', 'src' => '/landing-pages/property-agent-terpercaya.html'],
                ],
            ],
        ];

        foreach ($legacyWorks as $index => $item) {
            $work = Work::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'category_id' => $categoryMap[$item['category']]->id,
                    'title' => $item['title'],
                    'excerpt' => $item['excerpt'],
                    'content' => $item['content'] ?? $item['excerpt'],
                    'cover_image' => $item['image'],
                    'project_url' => $item['project_url'] ?? null,
                    'tools_json' => $item['tools'] ?? [],
                    'gallery_json' => $item['gallery'] ?? [],
                    'is_featured' => $index < 3,
                    'is_published' => true,
                    'published_at' => now()->subDays(40 - $index),
                    'sort_order' => $index + 1,
                ]
            );

            $tagIds = collect($item['tags'])->map(function (string $tagName, int $tagIndex) {
                $slug = Str::slug($tagName);
                $tag = Tag::query()->updateOrCreate(
                    ['slug' => $slug],
                    ['name' => $tagName, 'is_active' => true, 'sort_order' => $tagIndex + 1]
                );

                return $tag->id;
            })->all();

            $work->tags()->sync($tagIds);
        }

        Setting::query()->updateOrCreate(
            ['key' => 'site_name'],
            ['group' => 'seo', 'value' => 'Faiznute Portfolio', 'type' => 'string']
        );
        Setting::query()->updateOrCreate(
            ['key' => 'contact_email'],
            ['group' => 'contact', 'value' => 'faiznute07@gmail.com', 'type' => 'string']
        );
        Setting::query()->updateOrCreate(
            ['key' => 'contact_phone'],
            ['group' => 'contact', 'value' => '085155043133', 'type' => 'string']
        );
        Setting::query()->updateOrCreate(
            ['key' => 'profile_name'],
            ['group' => 'profile', 'value' => 'Muhamad Faiz Abdurrahman', 'type' => 'string']
        );
        Setting::query()->updateOrCreate(
            ['key' => 'profile_role'],
            ['group' => 'profile', 'value' => 'Graphic Designer & Video Editor', 'type' => 'string']
        );
        Setting::query()->updateOrCreate(
            ['key' => 'profile_bio'],
            ['group' => 'profile', 'value' => 'Graphic Designer & Video Editor yang saat ini fokus bekerja sebagai freelancer untuk desain visual, video campaign, dan landing page bisnis.', 'type' => 'text']
        );
        Setting::query()->updateOrCreate(
            ['key' => 'social_instagram'],
            ['group' => 'social', 'value' => 'https://instagram.com/faiznute', 'type' => 'string']
        );
        Setting::query()->updateOrCreate(
            ['key' => 'social_tiktok'],
            ['group' => 'social', 'value' => 'https://tiktok.com/@bangalexzz', 'type' => 'string']
        );
        Setting::query()->updateOrCreate(
            ['key' => 'social_youtube'],
            ['group' => 'social', 'value' => 'https://youtube.com/bangalexzz', 'type' => 'string']
        );

        Service::query()->updateOrCreate(
            ['slug' => 'landing-page'],
            ['title' => 'Landing Page', 'summary' => 'Desain halaman promosi cepat live dan conversion-focused.', 'price' => 'Mulai Rp2.500.000', 'is_active' => true, 'sort_order' => 1]
        );
        Service::query()->updateOrCreate(
            ['slug' => 'company-profile'],
            ['title' => 'Company Profile', 'summary' => 'Website profil bisnis lengkap untuk kredibilitas brand.', 'price' => 'Mulai Rp4.500.000', 'is_active' => true, 'sort_order' => 2]
        );
        Service::query()->updateOrCreate(
            ['slug' => 'video-brand-campaign'],
            ['title' => 'Video Brand Campaign', 'summary' => 'Konsep dan editing video campaign dengan storytelling kuat.', 'price' => 'Mulai Rp1.800.000', 'is_active' => true, 'sort_order' => 3]
        );
        Service::query()->updateOrCreate(
            ['slug' => 'social-media-design'],
            ['title' => 'Social Media Design', 'summary' => 'Produksi desain visual untuk konten media sosial yang konsisten.', 'price' => 'Mulai Rp1.200.000', 'is_active' => true, 'sort_order' => 4]
        );

        Testimonial::query()->updateOrCreate(
            ['name' => 'Rizky Pratama'],
            ['role' => 'Owner Klinik', 'quote' => 'Website jadi lebih meyakinkan dan leads naik.', 'rating' => 5, 'is_active' => true, 'sort_order' => 1]
        );
        Testimonial::query()->updateOrCreate(
            ['name' => 'Tim Next Level Properti'],
            ['role' => 'Property Agency', 'quote' => 'Konsep video grand opening disusun detail dan mudah dieksekusi.', 'rating' => 5, 'is_active' => true, 'sort_order' => 2]
        );
        Testimonial::query()->updateOrCreate(
            ['name' => 'Owner Ayam Lepas'],
            ['role' => 'F&B Brand', 'quote' => 'Visual kemasan dan sosial media jadi lebih konsisten dan menarik.', 'rating' => 5, 'is_active' => true, 'sort_order' => 3]
        );

        CvItem::query()->updateOrCreate(
            ['section' => 'experience', 'title' => 'Freelance Web Creator'],
            ['organization' => 'Independent', 'period' => 'Januari 2021 - Sekarang', 'description' => 'Mengerjakan proyek desain grafis, video editing, social media visual, dan landing page untuk UMKM, F&B, event, dan properti.', 'is_active' => true, 'sort_order' => 1]
        );
        CvItem::query()->updateOrCreate(
            ['section' => 'experience', 'title' => 'PT Symphony Kreasi Indonesia'],
            ['organization' => 'PT Symphony Kreasi Indonesia', 'period' => 'Juni 2024 - Desember 2025', 'description' => 'Graphic design, video editing, digital marketing, operator streaming TikTok, talent manager, dan content manager.', 'is_active' => true, 'sort_order' => 2]
        );
        CvItem::query()->updateOrCreate(
            ['section' => 'skill', 'title' => 'Laravel'],
            ['organization' => null, 'period' => null, 'description' => 'Backend framework utama untuk proyek web.', 'is_active' => true, 'sort_order' => 1]
        );
        CvItem::query()->updateOrCreate(
            ['section' => 'skill', 'title' => 'Adobe Premiere Pro'],
            ['organization' => null, 'period' => null, 'description' => 'Editing video profesional dengan transisi cinematic.', 'is_active' => true, 'sort_order' => 2]
        );
        CvItem::query()->updateOrCreate(
            ['section' => 'skill', 'title' => 'Adobe Illustrator'],
            ['organization' => null, 'period' => null, 'description' => 'Desain vektor dan branding modern.', 'is_active' => true, 'sort_order' => 3]
        );

        Highlight::query()->updateOrCreate(
            ['title' => 'Muhamad Faiz Abdurrahman - Graphic Designer & Video Editor'],
            ['subtitle' => 'Visual modern, elegan, dan siap membantu brand tampil lebih kuat.', 'image' => 'assets/images/legacy/1000121680.png', 'cta_label' => 'Lihat Karya', 'cta_url' => 'works.html', 'is_active' => true, 'sort_order' => 1]
        );

        Banner::query()->updateOrCreate(
            ['title' => 'Bangun visual brand yang rapi dan meyakinkan'],
            ['subtitle' => 'Dari desain, video, sampai landing page campaign dalam satu ekosistem kerja.', 'image' => 'assets/images/legacy/banner/banner1.jpg', 'cta_label' => 'Konsultasi', 'cta_url' => 'contact.html', 'is_active' => true, 'sort_order' => 1]
        );

        $admin->tokens()->delete();
    }
}
