<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('works')->where('slug', 'bangalexzz-dimsum-modern-landing')->update([
            'cover_image' => 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1200&h=800&auto=format&fit=crop',
            'updated_at' => now(),
        ]);

        DB::table('works')->where('slug', 'bangalexzz-dimsum-playful-landing')->update([
            'cover_image' => 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1200&h=800&auto=format&fit=crop',
            'updated_at' => now(),
        ]);

        DB::table('works')->where('slug', 'bangalexzz-dimsum-luxury-landing')->update([
            'cover_image' => 'https://images.unsplash.com/photo-1496116214517-7982d5a9d84f?w=1200&h=800&auto=format&fit=crop',
            'updated_at' => now(),
        ]);

        DB::table('works')->whereIn('slug', [
            'property-agent-eco-living',
            'property-agent-urban',
        ])->update([
            'cover_image' => 'assets/images/real-property.jpg',
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('works')->where('slug', 'bangalexzz-dimsum-modern-landing')->update([
            'cover_image' => 'assets/images/real-event.jpg',
            'updated_at' => now(),
        ]);

        DB::table('works')->where('slug', 'bangalexzz-dimsum-playful-landing')->update([
            'cover_image' => 'assets/images/real-coffee.jpg',
            'updated_at' => now(),
        ]);

        DB::table('works')->where('slug', 'bangalexzz-dimsum-luxury-landing')->update([
            'cover_image' => 'assets/images/real-banner.jpg',
            'updated_at' => now(),
        ]);

        DB::table('works')->where('slug', 'property-agent-eco-living')->update([
            'cover_image' => 'assets/images/real-hero.jpg',
            'updated_at' => now(),
        ]);

        DB::table('works')->where('slug', 'property-agent-urban')->update([
            'cover_image' => 'assets/images/real-clinic.jpg',
            'updated_at' => now(),
        ]);
    }
};
