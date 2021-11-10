<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Twilio\Rest\Client;

class BaseController extends Controller
{

    /**
     * send response method.
     *
     * @return \Illuminate\Http\Response
     */
    public function sendResponse($status = true, $message, $code = 200, $extras = [])
    {
        $response = [
            'success' => $status,
            'message' => $message,
        ];

        if (!empty($extras)) {
            $response = array_merge($response, $extras);
        }

        return response()->json($response, $code);
    }
    public function fileUploader($file, $name = 'file')
    {
        $extension = $file->getClientOriginalExtension();
        $filename = $name . '-' . time() . '.' . $extension;
        Storage::disk('local')->putFileAs(
            'documents',
            $file,
            $filename
        );
        return $filename;
    }

    public function containsOnlyNull($args)
    {
        return count(array_filter($args, function ($v) {
            return $v !== null;
        })) === 0;
    }

    public function generateRandomPassword()
    {
        $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $pass = array();
        $alphaLength = strlen($alphabet) - 1;
        for ($i = 0; $i < 8; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass);
    }

    public function generatePasswordResetToken()
    {
        return random_int(100000, 999999);
    }
}
