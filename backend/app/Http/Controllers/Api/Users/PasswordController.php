<?php

namespace App\Http\Controllers\Api\Users;

use App\Http\Controllers\BaseController;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\Admin;
use App\Models\PasswordChange;
use App\Models\User;
use App\Notifications\PasswordResetNotification;
use App\Notifications\SMSNotifications;
use App\Notifications\WhatsappNotification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class PasswordController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function forgotPassword(ForgotPasswordRequest $request)
    {
        try {
            $validated = $request->validated();
            $change = new PasswordChange();
            $message = 'A reset token has been sent to your email';
            $user = null;
            if ($validated['model'] === 'admin') {
                if ($validated['use_phone']) {
                    $user = Admin::where(['phone' => $validated['phone']])->firstOrFail();
                } else {
                    $user = Admin::where(['email' => $validated['email']])->firstOrFail();
                }
            } else {
                if ($validated['use_phone']) {
                    $user = Admin::where(['phone' => $validated['phone']])->firstOrFail();
                } else {
                    $user = Admin::where(['email' => $validated['email']])->firstOrFail();
                }
            }
            if (!$user) {
                return $this->sendResponse(
                    false,
                    'We can not find the specified user',
                    200
                );
            }
            if ($validated['use_phone']) {
                $change->contact = $validated['phone'];
                $message = 'A reset token has been sent to you via SMS and WhatsApp';
            } else {
                $change->contact = $validated['email'];
            }
            $change->use_phone = $validated['use_phone'];
            $change->model = $validated['model'];
            $change->expiry_date = Carbon::now()->addHour();
            $change->token = $this->generatePasswordResetToken();
            $change->save();
            $alert = 'Your password rest token is ' . $change->token . ' Expiry ' . $change->expiry_date;
            if ($validated['use_phone']) {
                $user->notify(new SMSNotifications($alert));
                $user->notify(new WhatsappNotification($alert));
            } else {
                $user->notify(new PasswordResetNotification($user, $alert));
            }

            return $this->sendResponse(
                true,
                $message,
                200,
                ['token' => $change]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to send reset token' . $ex->getMessage(),
                400
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function resetPassword(ResetPasswordRequest $request)
    {
        try {
            $validated = $request->validated();
            $token = PasswordChange::where(['model' => $validated['model'], 'status' => false, 'contact' => $validated['contact']])->first();
            if (!$token) {
                return $this->sendResponse(
                    false,
                    'Incorrect token',
                    200
                );
            }
            if (Carbon::now()->gt($token->expiry_date)) {
                $token->status = true;
                $token->save();
                return $this->sendResponse(
                    false,
                    'This token has expired, please generate a new one',
                    200
                );
            }
            $user = null;
            if ($validated['model'] === 'admin') {
                if ($token->use_phone) {
                    $user = Admin::where(['phone' => $token->contact])->firstOrFail();
                } else {
                    $user = Admin::where(['email' => $token->contact])->firstOrFail();
                }
            } else {
                if ($token->use_phone) {
                    $user = User::where(['phone' => $token->contact])->firstOrFail();
                } else {
                    $user = User::where(['email' => $token->contact])->firstOrFail();
                }
            }
            $user->password = Hash::make($validated['password']);
            if ($user->save()) {
                $token->status = true;
                $token->save();
            }
            $user->notify(new PasswordResetNotification($user, 'Your password has just been reset'));
            return $this->sendResponse(
                true,
                'Password reset successfully',
                200,
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to reset password' . $ex->getMessage(), 400);
        }
    }
}
