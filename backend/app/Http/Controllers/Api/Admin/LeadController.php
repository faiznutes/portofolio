<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesApiPagination;
use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    use HandlesApiPagination;

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->paginatedData(
            $request,
            Lead::query()->latest()
        ));
    }

    public function show(Lead $lead): JsonResponse
    {
        return response()->json(['data' => $lead]);
    }

    public function update(Request $request, Lead $lead): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:new,read,replied,archived'],
        ]);

        $lead->update($validated);

        return response()->json(['data' => $lead->fresh()]);
    }

    public function destroy(Lead $lead): JsonResponse
    {
        $lead->delete();

        return response()->json(['message' => 'Lead deleted.']);
    }
}
