<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_route_is_disabled(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'Password123',
        ]);

        $response->assertNotFound();
    }

    public function test_mass_assignment_cannot_elevate_is_admin(): void
    {
        $user = User::query()->create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => 'Password123',
            'is_admin' => true,
        ]);

        $this->assertFalse((bool) $user->fresh()->is_admin);
    }

    public function test_user_can_login_and_fetch_profile_then_logout(): void
    {
        $user = User::factory()->create([
            'password' => 'password123',
        ]);

        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $token = $loginResponse->json('data.token');

        $loginResponse
            ->assertOk()
            ->assertJsonPath('data.user.email', $user->email);

        $this
            ->withToken($token)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('data.user.email', $user->email);

        $this
            ->withToken($token)
            ->postJson('/api/auth/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logout successful.');

        $this->assertDatabaseCount('personal_access_tokens', 0);

    }

    public function test_logout_removes_only_current_token(): void
    {
        $user = User::factory()->create([
            'password' => 'password123',
        ]);

        $firstLogin = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);
        $firstToken = $firstLogin->json('data.token');

        $secondLogin = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);
        $secondToken = $secondLogin->json('data.token');

        $this->assertNotSame($firstToken, $secondToken);
        $this->assertDatabaseCount('personal_access_tokens', 1);

        $this
            ->withToken($secondToken)
            ->postJson('/api/auth/logout')
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_expired_token_cannot_access_profile(): void
    {
        config(['sanctum.expiration' => 1]);

        $user = User::factory()->create([
            'password' => 'password123',
        ]);

        $token = $user->createToken('manual-token')->plainTextToken;
        $tokenId = explode('|', $token)[0] ?? null;
        $record = PersonalAccessToken::query()->findOrFail($tokenId);
        $record->forceFill(['created_at' => now()->subMinutes(3)])->save();

        $this
            ->withToken($token)
            ->getJson('/api/auth/me')
            ->assertUnauthorized();
    }

    public function test_profile_endpoint_requires_authentication(): void
    {
        $this
            ->getJson('/api/auth/me')
            ->assertUnauthorized();
    }
}
