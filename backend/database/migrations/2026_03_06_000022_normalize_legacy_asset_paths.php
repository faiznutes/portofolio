<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $works = DB::table('works')
            ->select(['id', 'cover_image', 'gallery_json'])
            ->get();

        foreach ($works as $work) {
            $updatedCover = $this->normalizePath($work->cover_image);
            $updatedGalleryJson = $this->normalizeGalleryJson($work->gallery_json);

            $changes = [];
            if ($updatedCover !== $work->cover_image) {
                $changes['cover_image'] = $updatedCover;
            }
            if ($updatedGalleryJson !== $work->gallery_json) {
                $changes['gallery_json'] = $updatedGalleryJson;
            }

            if ($changes !== []) {
                DB::table('works')->where('id', $work->id)->update($changes);
            }
        }

        $highlights = DB::table('highlights')
            ->select(['id', 'image'])
            ->get();

        foreach ($highlights as $highlight) {
            $updatedImage = $this->normalizePath($highlight->image);
            if ($updatedImage !== $highlight->image) {
                DB::table('highlights')
                    ->where('id', $highlight->id)
                    ->update(['image' => $updatedImage]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op: this migration normalizes legacy paths to active assets.
    }

    private function normalizeGalleryJson(mixed $value): mixed
    {
        if (! is_string($value) || trim($value) === '') {
            return $value;
        }

        $decoded = json_decode($value, true);
        if (! is_array($decoded)) {
            return $value;
        }

        $normalized = $this->normalizeAny($decoded);
        $encoded = json_encode($normalized, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        return $encoded === false ? $value : $encoded;
    }

    private function normalizeAny(mixed $value): mixed
    {
        if (is_string($value)) {
            return $this->normalizePath($value);
        }

        if (! is_array($value)) {
            return $value;
        }

        $normalized = [];
        foreach ($value as $key => $item) {
            $normalized[$key] = $this->normalizeAny($item);
        }

        return $normalized;
    }

    private function normalizePath(mixed $value): mixed
    {
        if (! is_string($value) || $value === '') {
            return $value;
        }

        return str_replace(
            array_keys($this->pathMap()),
            array_values($this->pathMap()),
            $value
        );
    }

    /**
     * @return array<string, string>
     */
    private function pathMap(): array
    {
        return [
            'assets/images/legacy/fossei/logo.jpg' => 'assets/images/real-portrait.jpg',
            'assets/images/legacy/fossei/FIlsof 1.jpg' => 'assets/images/real-banner.jpg',
            'assets/images/legacy/fossei/FIlsof 2.jpg' => 'assets/images/real-social.jpg',
            'assets/images/legacy/fossei/banner zoom.jpg' => 'assets/images/real-event.jpg',
            'assets/images/legacy/banner/Social.jpg' => 'assets/images/real-social.jpg',
            'assets/images/legacy/banner/banner2.jpg' => 'assets/images/real-event.jpg',
            'assets/images/legacy/banner/banner3.jpg' => 'assets/images/real-property.jpg',
            'assets/images/legacy/ayam lepas/Kemasan.png' => 'assets/images/real-catering.jpg',
            'assets/images/legacy/ayam lepas/Sticker Kemasan 2.png' => 'assets/images/real-coffee.jpg',
            'assets/images/legacy/ayam lepas/paket20rb.png' => 'assets/images/real-social.jpg',
            'assets/images/legacy/ayam lepas/29.png' => 'assets/images/real-event.jpg',
            'assets/images/legacy/1000121680.png' => 'assets/images/1000121680-KuDX9S0_.png',
            'assets/images/mieayam-hero.png' => 'assets/images/mieayam-hero.webp',
            'assets/images/mieayam-special.png' => 'assets/images/mieayam-special.webp',
            'assets/images/mieayam-spicy.png' => 'assets/images/mieayam-spicy.webp',
            'assets/images/mieayam-original.png' => 'assets/images/mieayam-original.webp',
            'assets/images/dimsum-spread.png' => 'assets/images/dimsum-spread.webp',
            'assets/images/dimsum-hero.png' => 'assets/images/dimsum-hero.webp',
            'assets/images/dimsum-xlb.png' => 'assets/images/dimsum-xlb.webp',
            'assets/images/dimsum-siumai.png' => 'assets/images/dimsum-siumai.webp',
            'assets/images/dimsum-charsiu.png' => 'assets/images/dimsum-charsiu.webp',
            'assets/images/luxury-xlb.png' => 'assets/images/luxury-xlb.webp',
            'assets/images/luxury-siumai.png' => 'assets/images/luxury-siumai.webp',
            'assets/images/luxury-hero.png' => 'assets/images/luxury-hero.webp',
            'assets/images/luxury-hargow.png' => 'assets/images/luxury-hargow.webp',
            'assets/images/luxury-scallop.png' => 'assets/images/luxury-scallop.webp',
            'assets/images/playful-shrimp.png' => 'assets/images/banner-karya.webp',
            'assets/images/playful-veggie.png' => 'assets/images/banner-karya.webp',
            'assets/images/playful-porkbun.png' => 'assets/images/banner-karya.webp',
            'assets/images/mieayam-hero.jpg' => 'assets/images/mieayam-hero.webp',
        ];
    }
};
