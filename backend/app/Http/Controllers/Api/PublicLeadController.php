<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PublicLeadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $honeypot = trim((string) $request->input('website', ''));
        if ($honeypot !== '') {
            return response()->json([
                'message' => 'Thanks, your message has been received.',
                'data' => [
                    'id' => null,
                    'status' => 'new',
                ],
            ], 201);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:32'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $validated['email'] = mb_strtolower(trim($validated['email']));

        $lead = Lead::query()->create([
            ...$validated,
            'status' => 'new',
            'source' => 'website-contact-form',
        ]);

        Log::info('Public lead stored', [
            'lead_id' => $lead->id,
            'source' => $lead->source,
            'ip' => (string) $request->ip(),
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
