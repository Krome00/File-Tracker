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
        Schema::create('histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('equipment_id');
            $table->date('date_of_service');
            $table->string('po_number')->nullable();
            $table->date('po_date')->nullable();
            $table->string('supplier_or_mechanic')->nullable();
            $table->string('dr_or_si_number')->nullable();
            $table->date('dr_or_si_date')->nullable();
            $table->text('maintenance_details')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->foreign('equipment_id')->references('id')->on('equipments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('histories');
    }
};
