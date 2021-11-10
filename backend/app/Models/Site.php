<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\Traits\LogsActivity;

class Site extends Model
{
    use HasFactory, Notifiable, SoftDeletes, LogsActivity;

    /**
     * Get company site belongs to
     */
    public function company()
    {
        return $this->belongsTo('App\Models\Company', 'company_id', 'id');
    }

    public function routeNotificationForSmsAndWhatsapp()
    {
        return $this->phone;
    }
}
