<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Category;
use App\Models\CvItem;
use App\Models\Highlight;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Tag;
use App\Models\Testimonial;
use App\Models\Work;
use Illuminate\Http\JsonResponse;

class PublicContentController extends Controller
{
    public function works(): JsonResponse
    {
        $works = Work::query()
            ->with(['category:id,name,slug', 'tags:id,name,slug,color'])
            ->where('is_published', true)
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderByDesc('published_at')
            ->get();

        return response()->json(['data' => $works]);
    }

    public function workDetail(string $slug): JsonResponse
    {
        $work = Work::query()
            ->with(['category:id,name,slug', 'tags:id,name,slug,color'])
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return response()->json(['data' => $work]);
    }

    public function categories(): JsonResponse
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $categories]);
    }

    public function tags(): JsonResponse
    {
        $tags = Tag::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $tags]);
    }

    public function settings(): JsonResponse
    {
        $settings = Setting::query()
            ->whereIn('group', ['profile', 'contact', 'social'])
            ->orderBy('group')
            ->orderBy('key')
            ->get()
            ->groupBy('group')
            ->map(function ($items) {
                return $items->mapWithKeys(function ($item) {
                    return [$item->key => $item->value];
                });
            });

        return response()->json(['data' => $settings]);
    }

    public function services(): JsonResponse
    {
        $services = Service::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get();

        return response()->json(['data' => $services]);
    }

    public function testimonials(): JsonResponse
    {
        $testimonials = Testimonial::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $testimonials]);
    }

    public function cvItems(): JsonResponse
    {
        $items = CvItem::query()
            ->where('is_active', true)
            ->orderBy('section')
            ->orderBy('sort_order')
            ->get();

        return response()->json(['data' => $items]);
    }

    public function highlights(): JsonResponse
    {
        $items = Highlight::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json(['data' => $items]);
    }

    public function banners(): JsonResponse
    {
        $items = Banner::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json(['data' => $items]);
    }
}
