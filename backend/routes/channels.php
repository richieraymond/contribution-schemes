<?php

use App\Models\Admin;
use App\Models\GuardCheckIn;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('guard_check_ins', function ($user, $companyId) {
    if ($user->company_id) {
        return $user->id === User::findOrFail($user->id)->id;
    }
    return $user->id === Admin::findOrFail($user->id)->id;
});
