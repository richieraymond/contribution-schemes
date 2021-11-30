<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Contributor extends Model
{
    use HasFactory, Notifiable;

    public function scheme()
    {
        return $this->belongsTo('App\Models\Scheme', 'scheme_id', 'id');
    }

    public function children()
    {
        return $this->hasMany('App\Models\BiologicalChildren', 'contributor_id', 'id');
    }

    public function title()
    {
        return $this->hasOne('App\Models\Title', 'id', 'title');
    }

    public function maritalstatus()
    {
        return $this->hasOne('App\Models\MaritalStatus', 'id', 'maritalstatus');
    }

    public function educationlevel()
    {
        return $this->hasOne('App\Models\EducationLevel', 'id', 'education_level');
    }
}
