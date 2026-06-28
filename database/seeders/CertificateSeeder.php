<?php

namespace Database\Seeders;

use App\Models\Certificate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CertificateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Certificate::insert([
            [
                'profile_id' => 1,
                'category' => 'Hard Skill',
                'title' => 'UI/UX Design',
                'description' => 'UI/UX Design',
                'start_date' => '2022-01-01',
                'end_date' => '2022-01-01',
                'url_1' => '/sample/sampleimages-3_2.png',
                'url_2' => null,
                'created_at' => now(),
            ],
            [
                'profile_id' => 1,
                'category' => 'Soft Skill',
                'title' => 'Web Development',
                'description' => 'Web Development',
                'start_date' => '2022-01-01',
                'end_date' => '2022-01-01',
                'url_1' => '/sample/sampleimages-3_2.png',
                'url_2' => null,
                'created_at' => now(),
            ],

        ]);
    }
}
