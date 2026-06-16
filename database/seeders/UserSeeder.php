<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Wahyu Adama Nandika',
            'email' => 'wahyuadamanandika01@gmail.com',
            'password' => 'password123',
            'created_at' => now(),
        ]);
    }
}
