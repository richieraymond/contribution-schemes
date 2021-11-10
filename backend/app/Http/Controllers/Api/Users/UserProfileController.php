<?php

namespace App\Http\Controllers\Api\Users;

use App\Http\Controllers\BaseController;
use App\Http\Requests\ProfilePasswordReset;
use App\Models\Admin;
use App\Models\User;
use App\Notifications\PasswordResetNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserProfileController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct()
    {
        $this->middleware('auth:admins,schemes');
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function resetPassword(ProfilePasswordReset $request)
    {
        try {
            $validated = $request->validated();
            $user = null;
            if (Auth::user()->scheme_id) {
                $user = User::findOrFail(Auth::user()->id);
            } else {
                $user = Admin::findOrFail(Auth::user()->id);
            }
            $user->password = Hash::make($validated['password']);
            $user->save();
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
