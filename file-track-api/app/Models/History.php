<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    protected $fillable = [
        'equipment_id', 
        'date_of_service', 
        'po_number', 
        'po_date',
        'supplier_or_mechanic', 
        'dr_or_si_number', 
        'dr_or_si_date',
        'maintenance_details', 
        'remarks'
    ];

    public function parts()
    {
        return $this->hasMany(Part::class);
    }

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }
}