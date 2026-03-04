<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')
            ->where('group', 'profile')
            ->where('key', 'profile_role')
            ->update([
                'value' => 'Graphic Designer & Video Editor',
                'updated_at' => now(),
            ]);

        DB::table('settings')
            ->where('group', 'profile')
            ->where('key', 'profile_bio')
            ->update([
                'value' => 'Graphic Designer & Video Editor yang fokus pada branding visual, video campaign, dan kebutuhan konten bisnis yang konsisten.',
                'updated_at' => now(),
            ]);

        DB::table('banners')
            ->where('sort_order', 1)
            ->update([
                'title' => 'Siap perkuat branding visual dan video campaign bisnis Anda?',
                'subtitle' => 'Diskusikan kebutuhan desain, video, dan strategi konten untuk campaign yang lebih terarah.',
                'cta_label' => 'Diskusi via WhatsApp',
                'cta_url' => 'https://wa.me/6285155043133?text=Halo%2C%20saya%20ingin%20diskusi%20branding%20visual%20dan%20video%20campaign.',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('settings')
            ->where('group', 'profile')
            ->where('key', 'profile_bio')
            ->update([
                'value' => 'Graphic Designer & Video Editor yang saat ini fokus bekerja sebagai freelancer untuk desain visual, video campaign, dan landing page bisnis.',
                'updated_at' => now(),
            ]);

        DB::table('banners')
            ->where('sort_order', 1)
            ->update([
                'title' => 'Bangun visual brand yang rapi dan meyakinkan',
                'subtitle' => 'Dari desain, video, sampai landing page campaign dalam satu ekosistem kerja.',
                'cta_label' => 'Konsultasi',
                'cta_url' => '/contact',
                'updated_at' => now(),
            ]);
    }
};
