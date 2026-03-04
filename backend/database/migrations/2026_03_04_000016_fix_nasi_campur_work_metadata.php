<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('works')
            ->where('slug', 'bangalexzz-nasi-campur-landing')
            ->update([
                'cover_image' => 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&h=800&auto=format&fit=crop',
                'excerpt' => 'Landing page Nasi Campur dengan visual menu, opsi custom, dan CTA pemesanan cepat.',
                'content' => 'Landing page Nasi Campur dengan struktur menu yang jelas, section opsi kustom, social proof, dan CTA pemesanan yang langsung mengarah ke aksi.',
                'project_url' => '/landing-pages/resto-nasi-campur-landing.html',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('works')
            ->where('slug', 'bangalexzz-nasi-campur-landing')
            ->update([
                'cover_image' => 'assets/images/real-social.jpg',
                'excerpt' => 'Contoh handling social content dengan tampilan feed bergaya platform sosial.',
                'content' => 'Demo ini menampilkan bagaimana saya menangani struktur feed, konten card, dan ritme visual ala social platform untuk kebutuhan campaign brand.',
                'project_url' => '/landing-pages/facebook-social-handling-demo.html',
                'updated_at' => now(),
            ]);
    }
};
