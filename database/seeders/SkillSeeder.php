<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        Skill::insert([
            [
                'profile_id' => 1,
                'name_skills' => 'Adobe Photoshop',
                'category' => 'Hard Skill',
                'level' => 'Expert',
                'icon' => 'fa-solid fa-scissors',
                'created_at' => now(),
            ],
            [
                'profile_id' => 1,
                'name_skills' => 'Communication',
                'category' => 'Soft Skill',
                'level' => 'Intermediate',
                'icon' => 'fa-solid fa-user-group',
                'created_at' => now(),
            ],
        ]);
    }
}
