<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PhotoVideo;

class PhotoVideoSeeder extends Seeder
{
    public function run(): void
    {
        PhotoVideo::insert([
            [
                'profile_id' => 1,
                'category' => 'Wedding',
                'title' => 'A & B Wedding',
                'description' => 'Cinematic wedding video highlights.',
                'type' => 'video',
                'url_1' => '/sample/sampleimages-2_3.png',
                'url_2' => null,
                'url_3' => null,
                'url_4' => null,
                'url_5' => null,
                'created_at' => now(),
            ],
            [
                'profile_id' => 1,
                'category' => 'Wedding',
                'title' => 'A & B Wedding',
                'description' => 'Cinematic wedding video highlights.',
                'type' => 'video',
                'url_1' => '/sample/sampleimages-3_2.png',
                'url_2' => null,
                'url_3' => null,
                'url_4' => null,
                'url_5' => null,
                'created_at' => now(),
            ],
            [
                'profile_id' => 1,
                'category' => 'Wedding',
                'title' => 'A & B Wedding',
                'description' => 'Cinematic wedding video highlights.',
                'type' => 'photo',
                'url_1' => '/sample/sampleimages-2_3.png',
                'url_2' => null,
                'url_3' => null,
                'url_4' => null,
                'url_5' => null,
                'created_at' => now(),
            ]
        ]);
    }
}
