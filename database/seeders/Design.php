<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\GrapichDesign;

class Design extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $Design = [
            ['category' => 'Sosmed', 'title' => 'Post Campaign', 'img' => '/sample/sampleimages-2_3.png', 'created_at' => now(),],
            ['category' => 'Sosmed', 'title' => 'Feed Promo', 'img' => '/sample/sampleimages-3_2.png', 'created_at' => now(),],
            ['category' => 'Sosmed', 'title' => 'Story Update', 'img' => '/sample/sampleimages-3_2.png', 'created_at' => now(),],
            ['category' => 'Sosmed', 'title' => 'Ads Concept', 'img' => '/sample/sampleimages-2_3.png', 'created_at' => now(),],
            ['category' => 'Sosmed', 'title' => 'Product Launch', 'img' => '/sample/sampleimages-3_2.png', 'created_at' => now(),],
            ['category' => 'Sosmed', 'title' => 'Giveaway', 'img' => '/sample/sampleimages-2_3.png', 'created_at' => now(),],
            ['category' => 'Sosmed', 'title' => 'Testimonial', 'img' => '/sample/sampleimages-2_3.png', 'created_at' => now(),],
            ['category' => 'Sosmed', 'title' => 'Q&A Session', 'img' => '/sample/sampleimages-3_2.png', 'created_at' => now(),],
            ['category' => 'Sosmed', 'title' => 'Tips & Trick', 'img' => '/sample/sampleimages-2_3.png', 'created_at' => now(),],
            ['category' => 'Poster', 'title' => 'Event Music', 'img' => '/sample/sampleimages-2_3.png', 'created_at' => now(),],
            ['category' => 'Poster', 'title' => 'Movie Poster', 'img' => '/sample/sampleimages-3_2.png', 'created_at' => now(),],
            ['category' => 'Banner', 'title' => 'Web Hero', 'img' => '/sample/sampleimages-3_2.png', 'created_at' => now(),],
        ];

        foreach ($Design as $item) {
            GrapichDesign::create($item);
        }
    }
}
