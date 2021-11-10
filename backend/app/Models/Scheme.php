<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\Traits\LogsActivity;

class Scheme extends Model
{
    use HasFactory, Notifiable, SoftDeletes, LogsActivity;

    public function routeNotificationForSmsAndWhatsapp()
    {
        return $this->phone;
    }
}
