<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Str;

class AccountCreationNotification extends Notification implements ShouldQueue
{
    use Queueable;
    private $user;
    private $password;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($user, $password)
    {
        $this->user = $user;
        $this->password = $password;
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
            ->subject(config('app.name') . ' - ACCOUNT CREATION')
            ->greeting('Welcome to ' . config('app.name') . ' ' . $this->user['first_name' . '!'])
            ->line('We are excited to have you on our platform.')
            ->line('Below are your login credentials, It\'s recommended you change your password after your first login.')
            ->line('Email: ' . $this->user['email'])
            ->line('Password: ' . $this->password)
            ->line('If you received this mail in error, please discard it. In case of any issues, call/ whatsapp us on +(256) 200770500 / (+256) 393 236376')
            ->line(' Alternatively, you can send us an email on vantagesupport@nepserv.co.ug');
    }
}
