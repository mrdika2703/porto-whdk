<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Experience;

class ExperienceSeeder extends Seeder
{
    public function run(): void
    {
        Experience::create([
            'profile_id' => 1,
            'title' => 'Senior Graphic Designer',
            'origin' => 'Creative Agency JKT',
            'description' => 'Lead designer for various branding projects.',
            'status' => 'Selesai',
            'start_date' => '2021-01-01',
            'end_date' => '2023-12-31',
            'created_at' => now(),
        ]);
    }
}
