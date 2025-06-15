<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('equipments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('plate_no')->nullable();
            $table->string('chassis_no')->nullable();
            $table->string('engine_no')->nullable();
            $table->string('property_no')->nullable();
            $table->date('date_acquired')->nullable();
            $table->decimal('acquisition_cost', 10, 2)->nullable();
            $table->date('date_unserviceable')->nullable();
            $table->string('accountable_office')->nullable();
            $table->string('accountable_officer')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipments');
    }
};
