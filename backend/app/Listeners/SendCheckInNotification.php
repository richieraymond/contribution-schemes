<?php

namespace App\Listeners;

use App\Events\GuardCheckinProcessed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendCheckInNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  GuardCheckinProcessed  $event
     * @return void
     */
    public function handle(GuardCheckinProcessed $event)
    {
        //
    }
}
