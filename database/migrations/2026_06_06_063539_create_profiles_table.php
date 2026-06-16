<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('nickname', 10);
            $table->string('passion');
            $table->text('about');
            $table->string('caption');
            $table->text('description')->nullable();
            $table->date('ttl');
            $table->string('photo');
            $table->string('whatsapp');
            $table->string('email');
            $table->string('linkedin');
            $table->string('linkedin_name');
            $table->string('instagram');
            $table->string('github');
            $table->timestamps();
        });

        // Schema::table('users', function (Blueprint $table) {
        //     $table->foreignId('profile_id')->constrained('profiles')->onDelete('cascade');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
