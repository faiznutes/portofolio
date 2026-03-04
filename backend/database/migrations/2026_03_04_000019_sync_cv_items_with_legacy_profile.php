<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $experienceItems = [
            [
                'title' => 'Freelance Graphic Designer & Video Editor',
                'organization' => 'Independent',
                'period' => 'Januari 2021 - Sekarang',
                'description' => 'Menangani branding visual, social media content, dan video campaign untuk UMKM, F&B, event, dan properti.',
                'sort_order' => 1,
            ],
            [
                'title' => 'PT Symphony Kreasi Indonesia',
                'organization' => 'PT Symphony Kreasi Indonesia',
                'period' => 'Juni 2024 - Desember 2025',
                'description' => 'Graphic design, video editing, digital marketing, operator streaming TikTok, talent manager, dan content manager.',
                'sort_order' => 2,
            ],
            [
                'title' => 'Streaming Operator & Live Commerce Support',
                'organization' => 'Project Based',
                'period' => '2022 - Sekarang',
                'description' => 'Mengelola kebutuhan teknis live streaming, flow konten, dan koordinasi tim saat campaign live commerce berlangsung.',
                'sort_order' => 3,
            ],
        ];

        $skillItems = [
            ['title' => 'Adobe Photoshop', 'description' => 'Photo editing, compositing, dan visual branding design.', 'sort_order' => 1],
            ['title' => 'Adobe Illustrator', 'description' => 'Desain vektor, logo system, dan kebutuhan identitas visual.', 'sort_order' => 2],
            ['title' => 'Adobe Premiere Pro', 'description' => 'Editing video campaign, short form, dan ads content.', 'sort_order' => 3],
            ['title' => 'Adobe After Effects', 'description' => 'Motion graphics dan animasi elemen visual untuk konten digital.', 'sort_order' => 4],
            ['title' => 'Canva', 'description' => 'Produksi cepat konten visual social media dengan template konsisten.', 'sort_order' => 5],
            ['title' => 'CapCut', 'description' => 'Editing video vertikal untuk kebutuhan TikTok, Reels, dan Shorts.', 'sort_order' => 6],
            ['title' => 'Branding & Visual Strategy', 'description' => 'Menyusun arah visual brand agar konsisten di semua touchpoint.', 'sort_order' => 7],
            ['title' => 'Live Streaming Production', 'description' => 'Setup live, alur rundown, dan quality control saat siaran berlangsung.', 'sort_order' => 8],
        ];

        foreach ($experienceItems as $item) {
            DB::table('cv_items')->updateOrInsert(
                ['section' => 'experience', 'title' => $item['title']],
                [
                    'organization' => $item['organization'],
                    'period' => $item['period'],
                    'description' => $item['description'],
                    'is_active' => true,
                    'sort_order' => $item['sort_order'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        foreach ($skillItems as $item) {
            DB::table('cv_items')->updateOrInsert(
                ['section' => 'skill', 'title' => $item['title']],
                [
                    'organization' => null,
                    'period' => null,
                    'description' => $item['description'],
                    'is_active' => true,
                    'sort_order' => $item['sort_order'],
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        DB::table('cv_items')
            ->where('section', 'experience')
            ->whereNotIn('title', array_column($experienceItems, 'title'))
            ->update(['is_active' => false, 'updated_at' => now()]);

        DB::table('cv_items')
            ->where('section', 'skill')
            ->whereNotIn('title', array_column($skillItems, 'title'))
            ->update(['is_active' => false, 'updated_at' => now()]);
    }

    public function down(): void
    {
        DB::table('cv_items')
            ->whereIn('title', [
                'Freelance Graphic Designer & Video Editor',
                'Streaming Operator & Live Commerce Support',
                'Adobe Photoshop',
                'Adobe After Effects',
                'Canva',
                'CapCut',
                'Branding & Visual Strategy',
                'Live Streaming Production',
            ])
            ->update(['is_active' => false, 'updated_at' => now()]);

        DB::table('cv_items')
            ->where('section', 'experience')
            ->where('title', 'Freelance Web Creator')
            ->update(['is_active' => true, 'sort_order' => 1, 'updated_at' => now()]);

        DB::table('cv_items')
            ->where('section', 'skill')
            ->whereIn('title', ['Laravel', 'Adobe Premiere Pro', 'Adobe Illustrator'])
            ->update(['is_active' => true, 'updated_at' => now()]);
    }
};
