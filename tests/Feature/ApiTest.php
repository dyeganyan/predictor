<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token', 'token_type']);
    }

    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token', 'token_type']);
    }

    public function test_user_can_get_horoscope_prediction()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/horoscope', [
            'name' => 'John Doe',
            'dob' => '1990-01-01',
            'time' => '12:00',
            'location' => 'New York, USA',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['result', 'type', 'status']]);

        $this->assertDatabaseHas('readings', [
            'type' => 'horoscope',
            'user_id' => $user->id,
        ]);
    }

    public function test_user_can_upload_palm_image()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('palm.jpg');

        $response = $this->actingAs($user)->postJson('/api/palm', [
            'image' => $file,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('readings', [
            'type' => 'palm',
            'user_id' => $user->id,
        ]);

        // Check if file was stored (filename generated is random)
        // We just assume it's stored if DB has record and no error
    }

    public function test_user_can_upload_coffee_images()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $file1 = UploadedFile::fake()->image('cup1.jpg');
        $file2 = UploadedFile::fake()->image('cup2.jpg');

        $response = $this->actingAs($user)->postJson('/api/coffee', [
            'images' => [$file1, $file2],
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('readings', [
            'type' => 'coffee',
            'user_id' => $user->id,
        ]);
    }
}
