<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesApiPagination;
use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    use HandlesApiPagination;

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->paginatedData(
            $request,
            Testimonial::query()->orderBy('sort_order')->orderByDesc('created_at')
        ));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'quote' => ['required', 'string'],
            'avatar' => ['nullable', 'string', 'max:255'],
            'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ]);

        return response()->json(['data' => Testimonial::query()->create($validated)], 201);
    }

    public function show(Testimonial $testimonial): JsonResponse
    {
        return response()->json(['data' => $testimonial]);
    }

    public function update(Request $request, Testimonial $testimonial): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'quote' => ['sometimes', 'required', 'string'],
            'avatar' => ['nullable', 'string', 'max:255'],
            'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ]);

        $testimonial->update($validated);

        return response()->json(['data' => $testimonial->fresh()]);
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();

        return response()->json(['message' => 'Testimonial deleted.']);
    }
}
