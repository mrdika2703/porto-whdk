<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Website;

class WebsiteSeeder extends Seeder
{
    public function run(): void
    {
        Website::insert([
            [
                'profile_id' => 1,
                'category' => 'project',
                'title' => 'Company Profile UI',
                'origin' => 'Freelance Project',
                'description' => 'Modern company profile website using React.',
                'tech' => 'Laravel, MySQL, API, React, Tailwind',
                'link' => 'www.google.com',
                'url_1' => '/sample/sampleimages-3_2.png',
                'url_2' => '/sample/sampleimages-3_2.png',
                'url_3' => '/sample/sampleimages-3_2.png',
                'url_4' => null,
                'url_5' => null,
                'url_6' => null,
                'url_7' => null,
                'url_8' => null,
                'created_at' => now(),
            ],
            [
                'profile_id' => 1,
                'category' => 'develop',
                'title' => 'Company Profile UI',
                'origin' => 'Freelance Project',
                'description' => 'Modern company profile website using React.',
                'tech' => 'Laravel, MySQL, API, React, Tailwind',
                'link' => 'www.google.com',
                'url_1' => '/sample/sampleimages-3_2.png',
                'url_2' => '/sample/sampleimages-3_2.png',
                'url_3' => '/sample/sampleimages-3_2.png',
                'url_4' => null,
                'url_5' => null,
                'url_6' => null,
                'url_7' => null,
                'url_8' => null,
                'created_at' => now(),
            ],
        ]);
    }
}
