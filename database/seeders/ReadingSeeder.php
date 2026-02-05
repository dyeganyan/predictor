<?php

namespace Database\Seeders;

use App\Models\Reading;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReadingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 20 readings with new or existing users
        Reading::factory(20)->create();
    }
}
