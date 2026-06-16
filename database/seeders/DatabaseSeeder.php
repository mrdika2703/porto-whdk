<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ProfileSeeder::class,
            SkillSeeder::class,
            ExperienceSeeder::class,
            EducationSeeder::class,
            PhotoVideoSeeder::class,
            GrapichDesignSeeder::class,
            WebsiteSeeder::class,
            CertificateSeeder::class,
            OtherSeeder::class,
        ]);
    }
}
