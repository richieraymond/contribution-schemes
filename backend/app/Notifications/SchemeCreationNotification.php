<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SchemeCreationNotification extends Notification implements ShouldQueue
{
    use Queueable;
    private $scheme;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($scheme)
    {
        $this->scheme = $scheme;
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
            ->subject(config('app.name'))
            ->greeting('Welcome to ' . config('app.name') . ' ' . $this->scheme['contact_person'] . '!')
            ->line('Your contribution scheme ' . $this->scheme['name'] . ' has been successfully enrolled on our platform.')
            ->line('Thank you for choosing us!')
            ->line('If you received this mail in error, please discard it. In case of any issues, call/ whatsapp us on +(256) 200770500 / (+256) 393 236376')
            ->line(' Alternatively, you can send us an email on vantagesupport@nepserv.co.ug');
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
