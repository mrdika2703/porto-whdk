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
        Schema::table('skills', function (Blueprint $table) {
            $table->enum('visible', ['yes', 'no'])->default('yes')->after('icon');
        });

        Schema::table('experiences', function (Blueprint $table) {
            $table->enum('visible', ['yes', 'no'])->default('yes')->after('duration');
        });

        Schema::table('education', function (Blueprint $table) {
            $table->enum('visible', ['yes', 'no'])->default('yes')->after('end_date');
        });

        Schema::table('grapich-design', function (Blueprint $table) {
            $table->enum('visible', ['yes', 'no'])->default('yes')->after('url_3');
        });

        Schema::table('photo_videos', function (Blueprint $table) {
            $table->enum('visible', ['yes', 'no'])->default('yes')->after('url_5');
        });

        Schema::table('websites', function (Blueprint $table) {
            $table->enum('visible', ['yes', 'no'])->default('yes')->after('url_8');
        });

        Schema::table('others', function (Blueprint $table) {
            $table->enum('visible', ['yes', 'no'])->default('yes')->after('url_2');
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->enum('visible', ['yes', 'no'])->default('yes')->after('url_5');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('skills', function (Blueprint $table) {
            $table->dropColumn('visible');
        });

        Schema::table('experiences', function (Blueprint $table) {
            $table->dropColumn('visible');
        });

        Schema::table('education', function (Blueprint $table) {
            $table->dropColumn('visible');
        });

        Schema::table('grapich-design', function (Blueprint $table) {
            $table->dropColumn('visible');
        });

        Schema::table('photo_videos', function (Blueprint $table) {
            $table->dropColumn('visible');
        });

        Schema::table('websites', function (Blueprint $table) {
            $table->dropColumn('visible');
        });

        Schema::table('other', function (Blueprint $table) {
            $table->dropColumn('visible');
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->dropColumn('visible');
        });
    }
};
