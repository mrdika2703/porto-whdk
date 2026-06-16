<?php

namespace Database\Seeders;

use App\Models\Other;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OtherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Other::Insert([
            [
                'profile_id' => 1,
                'category' => 'UI/UX Design',
                'title' => 'UI/UX Design',
                'description' => 'UI/UX Design',
                'url_1' => '/sample/sampleimages-3_2.png',
                'created_at' => now(),
            ],
            [
                'profile_id' => 1,
                'category' => 'Web Development',
                'title' => 'Web Development',
                'description' => 'Web Development',
                'url_1' => '/sample/sampleimages-3_2.png',
                'created_at' => now(),
            ],
        ]);
    }
}
