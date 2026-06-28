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
            $table->string('description_coding')->nullable()->after('description');
            $table->string('description_multimedia')->nullable()->after('description');
            $table->string('passion_coding')->nullable()->after('passion');
            $table->string('passion_multimedia')->nullable()->after('passion');
        });

        Schema::table('skills', function (Blueprint $table) {
            $table->enum('viewmode', ['All', 'Multimedia', 'Programming'])->nullable()->after('icon');
        });

        Schema::table('experiences', function (Blueprint $table) {
            $table->enum('viewmode', ['All', 'Multimedia', 'Programming'])->nullable()->after('duration');
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->enum('viewmode', ['All', 'Multimedia', 'Programming'])->nullable()->after('url_2');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn([
                'description_coding',
                'description_multimedia',
                'passion_coding',
                'passion_multimedia'
            ]);
        });

        Schema::table('skills', function (Blueprint $table) {
            $table->dropColumn('viewmode');
        });

        Schema::table('experiences', function (Blueprint $table) {
            $table->dropColumn('viewmode');
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->dropColumn('viewmode');
        });
    }
};
