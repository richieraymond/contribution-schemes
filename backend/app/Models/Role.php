<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    /**
     * Get company role belongs to where necessary
     */
    public function scheme()
    {
        return $this->belongsTo('App\Models\Scheme', 'scheme_id', 'id');
    }
}
