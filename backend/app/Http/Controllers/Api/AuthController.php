<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::query()->create([
            ...$request->validated(),
            'is_admin' => false,
        ]);

        $token = $user->createToken($this->tokenName($request), ['*'], $this->tokenExpiry())->plainTextToken;

        return response()->json([
            'message' => 'Registration successful.',
            'data' => [
                'user' => $this->userPayload($user),
                'token' => $token,
            ],
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        $user = User::query()
            ->where('email', $credentials['email'])
            ->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            Log::warning('Auth login failed', [
                'event' => 'auth.login_failed',
                'email_sha256' => hash('sha256', mb_strtolower(trim($credentials['email']))),
                'ip' => (string) $request->ip(),
                'request_id' => $request->attributes->get('request_id'),
            ]);

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $tokenName = $this->tokenName($request);
        $user->tokens()->where('name', $tokenName)->delete();
        $token = $user->createToken($tokenName, ['*'], $this->tokenExpiry())->plainTextToken;

        Log::info('Auth login succeeded', [
            'event' => 'auth.login_succeeded',
            'user_id' => $user->id,
            'is_admin' => (bool) $user->is_admin,
            'ip' => (string) $request->ip(),
            'request_id' => $request->attributes->get('request_id'),
        ]);

        return response()->json([
            'message' => 'Login successful.',
            'data' => [
                'user' => $this->userPayload($user),
                'token' => $token,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'data' => [
                'user' => $this->userPayload($user),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $userId = $request->user()?->id;
        $request->user()?->currentAccessToken()?->delete();

        Log::info('Auth logout succeeded', [
            'event' => 'auth.logout_succeeded',
            'user_id' => $userId,
            'ip' => (string) $request->ip(),
            'request_id' => $request->attributes->get('request_id'),
        ]);

        return response()->json([
            'message' => 'Logout successful.',
        ]);
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_admin' => $user->is_admin,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }

    private function tokenName(Request $request): string
    {
        $agent = (string) $request->userAgent();

        return 'web-'.sha1($agent ?: 'unknown-agent');
    }

    private function tokenExpiry(): ?CarbonImmutable
    {
        $minutes = (int) config('sanctum.expiration');
        if ($minutes <= 0) {
            return null;
        }

        return CarbonImmutable::now()->addMinutes($minutes);
    }
}
