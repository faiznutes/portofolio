<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $items = [
            ['name' => 'Rizky Pratama', 'role' => 'Owner Klinik', 'quote' => 'Website jadi lebih meyakinkan dan leads naik.', 'rating' => 5],
            ['name' => 'Tim Next Level Properti', 'role' => 'Property Agency', 'quote' => 'Konsep video grand opening disusun detail dan mudah dieksekusi.', 'rating' => 5],
            ['name' => 'Owner Ayam Lepas', 'role' => 'F&B Brand', 'quote' => 'Visual kemasan dan sosial media jadi lebih konsisten dan menarik.', 'rating' => 5],
            ['name' => 'Salsa Azzahra', 'role' => 'Owner Skincare Lokal', 'quote' => 'Konten campaign lebih rapi dan conversion dari Instagram Ads meningkat signifikan.', 'rating' => 5],
            ['name' => 'Rudi Hartono', 'role' => 'Founder Coffee Shop', 'quote' => 'Desain menu dan konten promo lebih premium, customer jadi lebih percaya kualitas brand kami.', 'rating' => 5],
            ['name' => 'Nabila Putri', 'role' => 'Event Organizer', 'quote' => 'Materi visual untuk event launching selesai cepat, komunikasinya enak dan hasilnya konsisten.', 'rating' => 5],
            ['name' => 'Fajar Nugroho', 'role' => 'Owner Catering Harian', 'quote' => 'Konten foto-video harian bikin order WhatsApp lebih ramai dibanding bulan sebelumnya.', 'rating' => 5],
            ['name' => 'Dewi Lestari', 'role' => 'Marketing Property', 'quote' => 'Materi iklan properti jadi lebih profesional dan gampang dipakai untuk campaign mingguan.', 'rating' => 5],
            ['name' => 'Andra Saputra', 'role' => 'UMKM Fashion', 'quote' => 'Rebranding visual membantu akun kami terlihat lebih premium dan konsisten di semua platform.', 'rating' => 5],
            ['name' => 'Maya Kurnia', 'role' => 'Owner Dessert Box', 'quote' => 'Design feed dan video promo berhasil naikin engagement serta repeat order dari pelanggan lama.', 'rating' => 5],
        ];

        foreach ($items as $index => $item) {
            DB::table('testimonials')->updateOrInsert(
                ['name' => $item['name']],
                [
                    'role' => $item['role'],
                    'quote' => $item['quote'],
                    'rating' => $item['rating'],
                    'is_active' => true,
                    'sort_order' => $index + 1,
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }
    }

    public function down(): void
    {
    }
};
