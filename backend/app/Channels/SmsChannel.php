<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;
use AfricasTalking\SDK\AfricasTalking;

class SmsChannel
{
    public function send($notifiable, Notification $notification)
    {
        $message = $notification->toSms();

        info('Message' . $message);
        $to = $notifiable->routeNotificationForSmsAndWhatsapp('Sms');

        $username = config('services.africastalking.username');
        $apiKey = config('services.africastalking.key');
        $from = config('services.africastalking.from');

        $africasTalking = new AfricasTalking($username, $apiKey);
        $sms = $africasTalking->sms();

        return $sms->send([
            'to'      => '+' . $to,
            'from' => $from,
            'message' => $message
        ]);
    }
}
