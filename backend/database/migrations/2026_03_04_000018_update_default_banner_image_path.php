<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('banners')
            ->where('image', 'assets/images/real-banner.jpg')
            ->update([
                'image' => 'assets/images/banner-index.webp',
                'cta_url' => '/contact',
                'updated_at' => now(),
            ]);

        DB::table('banners')
            ->where('image', 'assets/images/banner-index.png')
            ->update([
                'image' => 'assets/images/banner-index.webp',
                'cta_url' => '/contact',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('banners')
            ->where('image', 'assets/images/banner-index.webp')
            ->update([
                'image' => 'assets/images/real-banner.jpg',
                'cta_url' => 'contact.html',
                'updated_at' => now(),
            ]);
    }
};
