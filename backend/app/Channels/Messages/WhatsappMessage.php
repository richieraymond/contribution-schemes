<?php

namespace App\Channels\Messages;

class WhatsappMessage
{
    public $content;
    public $attachments;

    public function content($content)
    {
        $this->content = $content;
        return $this;
    }

    public function attachments($attachments)
    {
        $this->attachments = $attachments;
        return $this;
    }
}
