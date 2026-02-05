<?php

namespace Database\Factories;

use App\Models\Reading;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reading>
 */
class ReadingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => $this->faker->randomElement(['palm', 'face', 'tarot']),
            'input_data' => ['image_url' => $this->faker->imageUrl()],
            'result' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['pending', 'processing', 'completed', 'failed']),
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'updated_at' => function (array $attributes) {
                return $this->faker->dateTimeBetween($attributes['created_at'], 'now');
            },
        ];
    }
}
