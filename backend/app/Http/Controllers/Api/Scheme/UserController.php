<?php

namespace App\Http\Controllers\Api\Scheme;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CreateUserRequest;
use App\Models\User;
use App\Notifications\AccountCreationNotification;
use App\Notifications\SMSNotifications;
use App\Notifications\WhatsappNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct()
    {
        $this->middleware(['auth:admins,schemes']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $users = User::with(['role', 'scheme'])->get();
            return $this->sendResponse(
                true,
                'Users retrieved successfully',
                200,
                ['users' => $users]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve admins' . $ex,
                400
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateUserRequest $request)
    {
        try {
            $data = $request->validated();
            $existingphone = User::where(['phone' => $data['phone']])->first();
            if ($existingphone != null) {
                return $this->sendResponse(
                    false,
                    'Phone number already belongs to another user',
                    200
                );
            }
            if ($data['email']) {
                $existingmail = User::where(['email' => $data['email']])->first();
                if ($existingmail != null) {
                    return $this->sendResponse(
                        false,
                        'Email already belongs to another user',
                        200
                    );
                }
            }
            $password = $this->generateRandomPassword();
            $user = new User();
            $user->role_id = $data['role_id'];
            $user->user_agent = $request->header('User-Agent');
            $user->ip_address = $request->ip();
            $user->first_name = $data['first_name'];
            $user->last_name = $data['last_name'];
            if (!Auth::user()->scheme_id) {
                $user->scheme_id = $data['scheme_id'];
            } else {
                $user->scheme_id = Auth::user()->scheme_id;
            }
            $user->password = Hash::make($password);
            $user->email = $data['email'];
            $user->phone = $data['phone'];
            $user->created_by = Auth::user()->id;
            $user->save();
            $user->notify(new AccountCreationNotification($user, $password));
            $message = 'Welcome to PEEC Energy. Email: ' . $user->email . ' Password:' . $password;
            $user->notify(new SMSNotifications($message));
            $user->notify(new WhatsappNotification($message));
            return $this->sendResponse(
                true,
                'User saved successfully',
                200,
                ['user' => $user]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to create user' . $ex
            );
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $user = User::with(['scheme', 'role'])->findOrFail($id);
            return $this->sendResponse(
                true,
                'User retrieved successfully',
                200,
                ['user' => $user]
            );
        } catch (\Exception $ex) {
            $this->sendResponse(
                false,
                'Failed to find user',
                200
            );
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CreateUserRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $user = User::findOrFail($id);
            $user->role_id = $data['role_id'];
            $user->user_agent = $request->header('User-Agent');
            $user->ip_address = $request->ip();
            $user->first_name = $data['first_name'];
            $user->last_name = $data['last_name'];
            $user->email = $data['email'];
            if (!Auth::user()->scheme_id) {
                $user->scheme_id = $data['scheme_id'];
            } else {
                $user->scheme_id = Auth::user()->scheme_id;
            }
            $user->phone = $data['phone'];
            if (array_key_exists('status', $data)) {
                $user->status = $data['status'];
            }
            $user->save();
            return $this->sendResponse(
                true,
                'User updated successfully',
                200,
                ['user' => $user]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to update user' . $ex
            );
        }
    }
}
