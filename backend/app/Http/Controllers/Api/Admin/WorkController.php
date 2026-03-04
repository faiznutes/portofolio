<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesApiPagination;
use App\Http\Controllers\Controller;
use App\Models\Work;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkController extends Controller
{
    use HandlesApiPagination;

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->paginatedData(
            $request,
            Work::query()
                ->with(['category:id,name,slug', 'tags:id,name,slug'])
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->orderByDesc('created_at')
        ));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:works,slug'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'project_url' => ['nullable', 'url', 'max:255'],
            'tools_json' => ['sometimes', 'array'],
            'tools_json.*' => ['string', 'max:120'],
            'gallery_json' => ['sometimes', 'array'],
            'gallery_json.*.type' => ['required_with:gallery_json', 'string', 'in:image,link'],
            'gallery_json.*.title' => ['nullable', 'string', 'max:255'],
            'gallery_json.*.src' => ['required_with:gallery_json', 'string', 'max:1000'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_published' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'tag_ids' => ['sometimes', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ]);

        $tagIds = $validated['tag_ids'] ?? [];
        unset($validated['tag_ids']);

        $work = Work::query()->create($validated);
        $work->tags()->sync($tagIds);

        return response()->json([
            'data' => $work->load(['category:id,name,slug', 'tags:id,name,slug']),
        ], 201);
    }

    public function show(Work $work): JsonResponse
    {
        return response()->json([
            'data' => $work->load(['category:id,name,slug', 'tags:id,name,slug']),
        ]);
    }

    public function update(Request $request, Work $work): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', 'unique:works,slug,'.$work->id],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'project_url' => ['nullable', 'url', 'max:255'],
            'tools_json' => ['sometimes', 'array'],
            'tools_json.*' => ['string', 'max:120'],
            'gallery_json' => ['sometimes', 'array'],
            'gallery_json.*.type' => ['required_with:gallery_json', 'string', 'in:image,link'],
            'gallery_json.*.title' => ['nullable', 'string', 'max:255'],
            'gallery_json.*.src' => ['required_with:gallery_json', 'string', 'max:1000'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_published' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'tag_ids' => ['sometimes', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ]);

        $tagIds = $validated['tag_ids'] ?? null;
        unset($validated['tag_ids']);

        $work->update($validated);

        if ($tagIds !== null) {
            $work->tags()->sync($tagIds);
        }

        return response()->json([
            'data' => $work->fresh()->load(['category:id,name,slug', 'tags:id,name,slug']),
        ]);
    }

    public function destroy(Work $work): JsonResponse
    {
        $work->delete();

        return response()->json(['message' => 'Work deleted.']);
    }
}
