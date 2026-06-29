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
        Schema::table('profiles', function (Blueprint $table) {
            $table->text('about')->nullable()->change();
            $table->text('description')->nullable()->change();
            $table->text('description_coding')->nullable()->change();
            $table->text('description_multimedia')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('about')->nullable()->change();
            $table->string('description')->nullable()->change();
            $table->string('description_coding')->nullable()->change();
            $table->string('description_multimedia')->nullable()->change();
        });
    }
};
