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
        Schema::create('websites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('profiles')->onDelete('cascade');
            $table->string('category');
            $table->string('title');
            $table->text('description');
            $table->string('tech');
            $table->string('link')->nullable();
            $table->string('origin')->nullable();
            $table->string('url_1');
            $table->string('url_2')->nullable();
            $table->string('url_3')->nullable();
            $table->string('url_4')->nullable();
            $table->string('url_5')->nullable();
            $table->string('url_6')->nullable();
            $table->string('url_7')->nullable();
            $table->string('url_8')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('websites');
    }
};
