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
        Schema::table('grapich-design', function (Blueprint $table) {
            $table->string('thumbnail')->nullable()->after('type');
        });

        Schema::table('photo_videos', function (Blueprint $table) {
            $table->string('thumbnail')->nullable()->after('type');
        });

        Schema::table('websites', function (Blueprint $table) {
            $table->string('thumbnail')->nullable()->after('origin');
        });

        Schema::table('others', function (Blueprint $table) {
            $table->string('thumbnail')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('grapich-design', function (Blueprint $table) {
            $table->dropColumn('thumbnail');
        });

        Schema::table('photo_videos', function (Blueprint $table) {
            $table->dropColumn('thumbnail');
        });

        Schema::table('websites', function (Blueprint $table) {
            $table->dropColumn('thumbnail');
        });

        Schema::table('others', function (Blueprint $table) {
            $table->dropColumn('thumbnail');
        });
    }
};
