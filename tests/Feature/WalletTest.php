<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WalletTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_deposit_funds()
    {
        $user = User::factory()->create(['balance' => 0]);

        $response = $this->actingAs($user)->postJson('/api/wallet/deposit', [
            'amount' => 10.00
        ]);

        $response->assertStatus(200)
                 ->assertJson(['balance' => 10.00]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'balance' => 10.00
        ]);
    }

    public function test_user_can_check_balance()
    {
        $user = User::factory()->create(['balance' => 50.00]);

        $response = $this->actingAs($user)->getJson('/api/wallet/balance');

        $response->assertStatus(200)
                 ->assertJson(['balance' => 50.00]);
    }

    public function test_reading_fails_insufficient_funds()
    {
        $user = User::factory()->create(['balance' => 0]);

        // Mock Gemini Service to avoid API calls?
        // The controller checks balance first, so it should fail fast.

        $response = $this->actingAs($user)->postJson('/api/horoscope', [
            'period' => 'weekly',
            'name' => 'Test',
            'dob' => '1990-01-01',
            'time' => '12:00',
            'location' => 'Test City'
        ]);

        $response->assertStatus(402);
    }

    public function test_horoscope_deducts_funds()
    {
        $user = User::factory()->create([
            'balance' => 10.00,
            'birth_date' => '1990-01-01',
            'birth_time' => '12:00',
            'birth_location' => 'Test City'
        ]);

        // Mock the Gemini Service
        $this->mock(\App\Services\GeminiService::class, function ($mock) {
            $mock->shouldReceive('generateContent')->andReturn('Your future is bright.');
        });

        $response = $this->actingAs($user)->postJson('/api/horoscope', [
            'period' => 'weekly'
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'balance' => 5.00 // 10 - 5
        ]);
    }
}
