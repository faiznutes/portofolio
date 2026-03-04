<?php

namespace Tests\Feature;

use App\Models\Banner;
use App\Models\Category;
use App\Models\CvItem;
use App\Models\Highlight;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Tag;
use App\Models\Testimonial;
use App\Models\User;
use App\Models\Work;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CmsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_endpoints_return_content_and_accept_contact_lead(): void
    {
        $this->getJson('/api/public/health')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'API is healthy.');

        $category = Category::query()->create([
            'name' => 'Web Apps',
            'slug' => 'web-apps',
        ]);

        $tag = Tag::query()->create([
            'name' => 'Laravel',
            'slug' => 'laravel',
        ]);

        $work = Work::query()->create([
            'category_id' => $category->id,
            'title' => 'Portfolio CMS',
            'slug' => 'portfolio-cms',
            'is_published' => true,
            'published_at' => now(),
        ]);
        $work->tags()->sync([$tag->id]);

        Setting::query()->create([
            'group' => 'seo',
            'key' => 'site_name',
            'value' => 'Portfolio Web AI',
            'type' => 'string',
        ]);

        Service::query()->create([
            'title' => 'Landing Page',
            'slug' => 'landing-page',
            'is_active' => true,
        ]);

        Testimonial::query()->create([
            'name' => 'Client A',
            'quote' => 'Great work',
            'is_active' => true,
        ]);

        CvItem::query()->create([
            'section' => 'experience',
            'title' => 'Freelancer',
            'is_active' => true,
        ]);

        Highlight::query()->create([
            'title' => 'Main Highlight',
            'is_active' => true,
        ]);

        Banner::query()->create([
            'title' => 'Main Banner',
            'is_active' => true,
        ]);

        $this->getJson('/api/public/works')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'portfolio-cms');

        $this->getJson('/api/public/works/portfolio-cms')
            ->assertOk()
            ->assertJsonPath('data.category.slug', 'web-apps');

        $this->getJson('/api/public/categories')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/public/tags')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/public/settings')
            ->assertOk()
            ->assertJsonPath('data.seo.site_name', 'Portfolio Web AI');

        $this->getJson('/api/public/services')
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'landing-page');

        $this->getJson('/api/public/testimonials')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/public/cv-items')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/public/highlights')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/public/banners')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->postJson('/api/public/leads', [
            'name' => 'Prospect',
            'email' => 'prospect@example.com',
            'subject' => 'Need a website',
            'message' => 'Please contact me.',
        ])->assertCreated()
            ->assertJsonPath('data.status', 'new');

        $this->assertDatabaseHas('leads', [
            'email' => 'prospect@example.com',
            'status' => 'new',
        ]);
    }

    public function test_admin_routes_require_authentication(): void
    {
        $this->getJson('/api/admin/categories')
            ->assertUnauthorized()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Unauthenticated.');
    }

    public function test_non_admin_user_cannot_access_admin_routes(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $token = $user->createToken('user-token')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/admin/categories')
            ->assertForbidden()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Forbidden. Admin access required.');
    }

    public function test_authenticated_user_can_manage_admin_categories(): void
    {
        $user = User::factory()->create(['is_admin' => true]);
        $token = $user->createToken('test-token')->plainTextToken;

        $create = $this->withToken($token)->postJson('/api/admin/categories', [
            'name' => 'Branding',
            'slug' => 'branding',
            'description' => 'Brand and visual identity projects',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        $categoryId = $create->json('data.id');

        $create->assertCreated()
            ->assertJsonPath('data.slug', 'branding');

        $this->withToken($token)
            ->getJson('/api/admin/categories/'.$categoryId)
            ->assertOk()
            ->assertJsonPath('data.name', 'Branding');

        $this->withToken($token)
            ->putJson('/api/admin/categories/'.$categoryId, [
                'name' => 'Brand Design',
                'slug' => 'brand-design',
            ])
            ->assertOk()
            ->assertJsonPath('data.slug', 'brand-design');

        $this->withToken($token)
            ->deleteJson('/api/admin/categories/'.$categoryId)
            ->assertOk();

        $this->assertDatabaseMissing('categories', ['id' => $categoryId]);
    }

    public function test_authenticated_user_can_manage_admin_services(): void
    {
        $user = User::factory()->create(['is_admin' => true]);
        $token = $user->createToken('service-token')->plainTextToken;

        $create = $this->withToken($token)->postJson('/api/admin/services', [
            'title' => 'Company Profile',
            'slug' => 'company-profile',
            'summary' => 'Profile website package',
            'price' => 'Rp4.500.000',
        ]);

        $serviceId = $create->json('data.id');

        $this->withToken($token)
            ->putJson('/api/admin/services/'.$serviceId, [
                'title' => 'Company Profile Pro',
                'slug' => 'company-profile-pro',
            ])
            ->assertOk()
            ->assertJsonPath('data.slug', 'company-profile-pro');

        $this->withToken($token)
            ->deleteJson('/api/admin/services/'.$serviceId)
            ->assertOk();

        $this->assertDatabaseMissing('services', ['id' => $serviceId]);
    }

    public function test_public_lead_validation_uses_standard_error_format(): void
    {
        $this->postJson('/api/public/leads', [
            'name' => 'Only Name',
        ])
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Validation failed.')
            ->assertJsonStructure(['errors' => ['email', 'message']]);
    }

    public function test_admin_created_published_work_is_visible_on_public_endpoints(): void
    {
        $user = User::factory()->create(['is_admin' => true]);
        $token = $user->createToken('work-smoke-token')->plainTextToken;

        $category = Category::query()->create([
            'name' => 'Landing Page',
            'slug' => 'landing-page',
            'is_active' => true,
        ]);

        $tag = Tag::query()->create([
            'name' => 'Tailwind CSS',
            'slug' => 'tailwind-css',
            'is_active' => true,
        ]);

        $createResponse = $this->withToken($token)
            ->postJson('/api/admin/works', [
                'category_id' => $category->id,
                'title' => 'Smoke Test Project',
                'slug' => 'smoke-test-project',
                'excerpt' => 'Smoke flow test',
                'content' => 'End-to-end smoke content',
                'project_url' => 'https://example.com/live',
                'tools_json' => ['HTML5', 'Tailwind CSS'],
                'gallery_json' => [
                    ['type' => 'image', 'title' => 'Hero', 'src' => 'https://example.com/hero.jpg'],
                ],
                'is_published' => true,
                'published_at' => now()->toISOString(),
                'tag_ids' => [$tag->id],
            ]);

        $createResponse
            ->assertCreated()
            ->assertJsonPath('data.slug', 'smoke-test-project');

        $this->getJson('/api/public/works')
            ->assertOk()
            ->assertJsonFragment(['slug' => 'smoke-test-project']);

        $this->getJson('/api/public/works/smoke-test-project')
            ->assertOk()
            ->assertJsonPath('data.project_url', 'https://example.com/live')
            ->assertJsonPath('data.tools_json.0', 'HTML5')
            ->assertJsonPath('data.gallery_json.0.type', 'image');
    }
}
