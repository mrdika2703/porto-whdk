<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GrapichDesign;

class GrapichDesignSeeder extends Seeder
{
    public function run(): void
    {
        GrapichDesign::insert([
            [
                'profile_id' => 1,
                'category' => 'Sosmed',
                'title' => 'Instagram Feed Promo',
                'description' => 'Promo design for local coffee shop',
                'type' => 'image',
                'url_1' => '/sample/sampleimages-2_3.png',
                'url_2' => null,
                'url_3' => null,
                'created_at' => now(),
            ],
            [
                'profile_id' => 1,
                'category' => 'Poster',
                'title' => 'Music Festival',
                'description' => 'Main poster for summer festival',
                'type' => 'image',
                'url_1' => '/sample/sampleimages-3_2.png',
                'url_2' => null,
                'url_3' => null,
                'created_at' => now(),
            ],
            [
                'profile_id' => 1,
                'category' => 'Banner',
                'title' => 'Website B',
                'description' => 'Banner for summer festival',
                'type' => 'image',
                'url_1' => '/sample/sampleimages-2_3.png',
                'url_2' => null,
                'url_3' => null,
                'created_at' => now(),
            ],
        ]);
    }
}
