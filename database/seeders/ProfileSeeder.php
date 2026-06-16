<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Profile;
use App\Models\User;

class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        Profile::create([
            'user_id' => 1,
            'name' => 'Wahyu Adam Anandika',
            'nickname' => 'Dika',
            'about' => 'Saya adalah seorang fotografer & desainer asal
                        Indonesia, fokus pada visual storytelling,
                        fotografi sinematik, dan pembuatan website
                        modern. Setiap karya adalah cerita yang menunggu
                        untuk diceritakan.',
            'passion' => 'Software Engineer & Multimedia ',
            'caption' => 'Capture the light, design the silence, code the future',
            'description' => 'Experienced in Graphic Design and Web Development.',
            'ttl' => '2003-03-27',
            'photo' => '/profile-photo/dika_group.svg',
            'whatsapp' => '81456140905',
            'email' => 'wahyuadamanandika01@gmail.com',
            'linkedin' => 'https://www.linkedin.com/in/wahyu-adam-anandika-a6055021a',
            'linkedin_name' => 'Wahyu Adam Anandika',
            'instagram' => 'wahyu_adam_dk',
            'github' => 'https://github.com/mrdika2703',
            'created_at' => now(),
        ]);

        // User::where('id', 1)->update([
        //     'profile_id' => 1,
        // ]);
    }
}
