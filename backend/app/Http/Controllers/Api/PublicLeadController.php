<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicLeadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:32'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $lead = Lead::query()->create([
            ...$validated,
            'status' => 'new',
            'source' => 'website-contact-form',
        ]);

        return response()->json([
            'message' => 'Thanks, your message has been received.',
            'data' => [
                'id' => $lead->id,
                'status' => $lead->status,
            ],
        ], 201);
    }
}
