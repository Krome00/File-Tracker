<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Part extends Model
{
    protected $fillable = [
        'history_id', 'part_name', 'qty', 'unit', 'unit_price', 'total'
    ];

    public function history()
    {
        return $this->belongsTo(History::class);
    }
}