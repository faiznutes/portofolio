<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CvItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CvItemController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => CvItem::query()->orderBy('section')->orderBy('sort_order')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'section' => ['required', 'string', 'max:64'],
            'title' => ['required', 'string', 'max:255'],
            'organization' => ['nullable', 'string', 'max:255'],
            'period' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ]);

        return response()->json(['data' => CvItem::query()->create($validated)], 201);
    }

    public function show(CvItem $cvItem): JsonResponse
    {
        return response()->json(['data' => $cvItem]);
    }

    public function update(Request $request, CvItem $cvItem): JsonResponse
    {
        $validated = $request->validate([
            'section' => ['sometimes', 'required', 'string', 'max:64'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'organization' => ['nullable', 'string', 'max:255'],
            'period' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ]);

        $cvItem->update($validated);

        return response()->json(['data' => $cvItem->fresh()]);
    }

    public function destroy(CvItem $cvItem): JsonResponse
    {
        $cvItem->delete();

        return response()->json(['message' => 'CV item deleted.']);
    }
}
