<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    protected $table = 'equipments';
    protected $fillable = [
        'name',
        'description',
        'plate_no',
        'chassis_no',
        'engine_no',
        'property_no',
        'date_acquired',
        'acquisition_cost',
        'date_unserviceable',
        'accountable_office',
        'accountable_officer',
    ];
    public function histories()
    {
        return $this->hasMany(History::class);
    }
    
    public function exportWithHistories()
    {
        $equipments = Equipment::with(['histories.parts'])->get();

        return response()->json($equipments);
    }
}