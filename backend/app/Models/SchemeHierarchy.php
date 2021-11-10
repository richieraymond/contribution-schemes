<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchemeHierarchy extends Model
{
    use HasFactory;

    public function scheme()
    {
        return $this->belongsTo('App\Models\SchemeHierarchy', 'scheme_id', 'id');
    }
}
