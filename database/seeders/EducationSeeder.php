<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Education;

class EducationSeeder extends Seeder
{
    public function run(): void
    {
        Education::create([
            'profile_id' => 1,
            'title' => 'S1 Teknik Informatika',
            'origin' => 'Universitas Contoh',
            'description' => 'Fokus pada pengembangan perangkat lunak.',
            'status' => 'Sekarang',
            'start_date' => '2022-08-01',
            'end_date' => null,
            'created_at' => now(),
        ]);
    }
}
