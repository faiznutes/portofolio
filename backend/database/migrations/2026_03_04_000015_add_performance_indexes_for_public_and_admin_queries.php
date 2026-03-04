<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('works', function (Blueprint $table): void {
            $table->index(['is_published', 'is_featured', 'sort_order', 'published_at'], 'works_public_listing_idx');
            $table->index(['category_id', 'is_published'], 'works_category_published_idx');
        });

        Schema::table('leads', function (Blueprint $table): void {
            $table->index(['status', 'created_at'], 'leads_status_created_idx');
            $table->index('email', 'leads_email_idx');
        });

        Schema::table('categories', function (Blueprint $table): void {
            $table->index(['is_active', 'sort_order', 'name'], 'categories_active_sort_name_idx');
        });

        Schema::table('tags', function (Blueprint $table): void {
            $table->index(['is_active', 'sort_order', 'name'], 'tags_active_sort_name_idx');
        });

        Schema::table('services', function (Blueprint $table): void {
            $table->index(['is_active', 'sort_order', 'title'], 'services_active_sort_title_idx');
        });

        Schema::table('testimonials', function (Blueprint $table): void {
            $table->index(['is_active', 'sort_order', 'created_at'], 'testimonials_active_sort_created_idx');
        });

        Schema::table('cv_items', function (Blueprint $table): void {
            $table->index(['is_active', 'section', 'sort_order'], 'cv_items_active_section_sort_idx');
        });

        Schema::table('highlights', function (Blueprint $table): void {
            $table->index(['is_active', 'sort_order', 'created_at'], 'highlights_active_sort_created_idx');
        });

        Schema::table('banners', function (Blueprint $table): void {
            $table->index(['is_active', 'sort_order', 'created_at'], 'banners_active_sort_created_idx');
        });

        Schema::table('settings', function (Blueprint $table): void {
            $table->index(['group', 'key'], 'settings_group_key_idx');
        });
    }

    public function down(): void
    {
        Schema::table('works', function (Blueprint $table): void {
            $table->dropIndex('works_public_listing_idx');
            $table->dropIndex('works_category_published_idx');
        });

        Schema::table('leads', function (Blueprint $table): void {
            $table->dropIndex('leads_status_created_idx');
            $table->dropIndex('leads_email_idx');
        });

        Schema::table('categories', function (Blueprint $table): void {
            $table->dropIndex('categories_active_sort_name_idx');
        });

        Schema::table('tags', function (Blueprint $table): void {
            $table->dropIndex('tags_active_sort_name_idx');
        });

        Schema::table('services', function (Blueprint $table): void {
            $table->dropIndex('services_active_sort_title_idx');
        });

        Schema::table('testimonials', function (Blueprint $table): void {
            $table->dropIndex('testimonials_active_sort_created_idx');
        });

        Schema::table('cv_items', function (Blueprint $table): void {
            $table->dropIndex('cv_items_active_section_sort_idx');
        });

        Schema::table('highlights', function (Blueprint $table): void {
            $table->dropIndex('highlights_active_sort_created_idx');
        });

        Schema::table('banners', function (Blueprint $table): void {
            $table->dropIndex('banners_active_sort_created_idx');
        });

        Schema::table('settings', function (Blueprint $table): void {
            $table->dropIndex('settings_group_key_idx');
        });
    }
};
