<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Highlight;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HighlightController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Highlight::query()->orderBy('sort_order')->orderByDesc('created_at')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:255'],
            'cta_label' => ['nullable', 'string', 'max:255'],
            'cta_url' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ]);

        return response()->json(['data' => Highlight::query()->create($validated)], 201);
    }

    public function show(Highlight $highlight): JsonResponse
    {
        return response()->json(['data' => $highlight]);
    }

    public function update(Request $request, Highlight $highlight): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:255'],
            'cta_label' => ['nullable', 'string', 'max:255'],
            'cta_url' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ]);

        $highlight->update($validated);

        return response()->json(['data' => $highlight->fresh()]);
    }

    public function destroy(Highlight $highlight): JsonResponse
    {
        $highlight->delete();

        return response()->json(['message' => 'Highlight deleted.']);
    }
}
