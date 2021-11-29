<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContributionNotification extends Notification
{
    use Queueable;
    private $contact;
    private $amount;
    private $sasula_reference;
    private $name;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($contact, $amount, $sasula_reference, $name)
    {
        $this->contact=$contact;
        $this->amount=$amount;
        $this->sasula_reference=$sasula_reference;
        $this->name=$name;

    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject(config('app.name') . ' - PAYMENT RECEIVED')
            ->greeting('Dear ' . $this->name.',')
            ->line('Deposit of UGX '.number_format($this->amount).' has been received for: '.$this->sasula_reference)
            ->line('Thank you for using '.config('app.name'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
