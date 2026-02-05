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
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('balance', 10, 2)->default(0.00)->after('email');
            $table->date('birth_date')->nullable()->after('password');
            $table->string('birth_time')->nullable()->after('birth_date');
            $table->string('birth_location')->nullable()->after('birth_time');
            $table->string('gender')->nullable()->after('birth_location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['balance', 'birth_date', 'birth_time', 'birth_location', 'gender']);
        });
    }
};
