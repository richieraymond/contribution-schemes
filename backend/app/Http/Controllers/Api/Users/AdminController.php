<?php

namespace App\Http\Controllers\Api\Users;

use App\Http\Controllers\BaseController;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\CreateAdminRequest;
use App\Http\Requests\EditAdminRequest;
use App\Models\Admin as ModelsAdmin;
use App\Notifications\AccountCreationNotification;
use App\Notifications\SMSNotifications;
use App\Notifications\WhatsappNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth as FacadesAuth;

class AdminController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct()
    {
        $this->middleware(['auth:admins']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $admins = ModelsAdmin::with('role')->get();
            return $this->sendResponse(
                true,
                'Admins retrieved successfully',
                200,
                ['admins' => $admins]
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
    public function store(CreateAdminRequest $request)
    {
        try {
            $data = $request->validated();
            $existingphone = ModelsAdmin::where(['phone' => $data['phone']])->first();
            if ($existingphone != null) {
                return $this->sendResponse(
                    false,
                    'Phone number already belongs to another user',
                    200
                );
            }
            if ($data['email']) {
                $existingmail = ModelsAdmin::where(['email' => $data['email']])->first();
                if ($existingmail != null) {
                    return $this->sendResponse(
                        false,
                        'Email already belongs to another user',
                        200
                    );
                }
            }
            $admin = new ModelsAdmin();
            $password = $this->generateRandomPassword();
            $admin->role_id = $data['role_id'];
            $admin->user_agent = $request->header('User-Agent');
            $admin->ip_address = $request->ip();
            $admin->first_name = $data['first_name'];
            $admin->last_name = $data['last_name'];
            $admin->email = $data['email'];
            $admin->phone = $data['phone'];
            $admin->password = Hash::make($password);
            $admin->created_by = FacadesAuth::user()->id;
            $admin->save();
            $admin->notify(new AccountCreationNotification($admin, $password));
            $message = 'Welcome to PEEC Energy. Email: ' . $admin->email . ' Password:' . $password;
            $admin->notify(new SMSNotifications($message));
            $admin->notify(new WhatsappNotification($message));
            return $this->sendResponse(
                true,
                'Admin saved successfully',
                200,
                ['admin' => $admin]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to create admin' . $ex
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
            $admin = ModelsAdmin::with('role')->findOrFail($id);
            return $this->sendResponse(
                true,
                'Admin retrieved successfully',
                200,
                ['admin' => $admin]
            );
        } catch (\Exception $ex) {
            $this->sendResponse(
                false,
                'Failed to find admin',
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
    public function update(EditAdminRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $admin = ModelsAdmin::findOrFail($id);
            $admin->role_id = $data['role_id'];
            $admin->user_agent = $request->header('User-Agent');
            $admin->ip_address = $request->ip();
            $admin->first_name = $data['first_name'];
            $admin->last_name = $data['last_name'];
            $admin->email = $data['email'];
            $admin->phone = $data['phone'];
            if (array_key_exists('status', $data)) {
                $admin->status = $data['status'];
            }
            $admin->save();
            return $this->sendResponse(
                true,
                'Admin updated successfully',
                200,
                ['admin' => $admin]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to update user' . $ex
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function changePassword(ChangePasswordRequest $request)
    {
        try {
            $validated = $request->validated();
            $admin = ModelsAdmin::findOrFail($validated['userId']);
            $admin->password = Hash::make($validated['password']);
            $admin->save();
            return $this->sendResponse(
                true,
                'Password changed successfully',
                200,
                ['admin' => $admin]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to change password', 400);
        }
    }
}
