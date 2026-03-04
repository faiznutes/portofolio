<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesApiPagination;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    use HandlesApiPagination;

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->paginatedData(
            $request,
            Setting::query()->orderBy('group')->orderBy('key')
        ));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'group' => ['sometimes', 'string', 'max:64'],
            'key' => ['required', 'string', 'max:255', 'unique:settings,key'],
            'value' => ['nullable', 'string'],
            'type' => ['sometimes', 'string', 'max:32'],
        ]);

        $setting = Setting::query()->create($validated);

        return response()->json(['data' => $setting], 201);
    }

    public function show(Setting $setting): JsonResponse
    {
        return response()->json(['data' => $setting]);
    }

    public function update(Request $request, Setting $setting): JsonResponse
    {
        $validated = $request->validate([
            'group' => ['sometimes', 'string', 'max:64'],
            'key' => ['sometimes', 'required', 'string', 'max:255', 'unique:settings,key,'.$setting->id],
            'value' => ['nullable', 'string'],
            'type' => ['sometimes', 'string', 'max:32'],
        ]);

        $setting->update($validated);

        return response()->json(['data' => $setting->fresh()]);
    }

    public function destroy(Setting $setting): JsonResponse
    {
        $setting->delete();

        return response()->json(['message' => 'Setting deleted.']);
    }
}
