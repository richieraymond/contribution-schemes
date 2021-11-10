<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\BaseController;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\LoginRequest;
use App\Models\Admin as ModelsAdmin;
use App\Models\Permission as ModelsPermission;
use App\Models\Role;
use App\Models\RolePermissionAssoc as ModelsRolePermissionAssoc;
use App\Models\User;

class LoginController extends BaseController
{
    public function __construct()
    {
        $this->middleware('guest');
    }

    public function processLogin(LoginRequest $request)
    {
        $validcredentials = $request->validated();
        $user = null;
        $token = null;

        if ($validcredentials['model'] === 'admin') {
            $user = ModelsAdmin::where('email', $validcredentials['useridentifier'])->first();
        } else {
            $user = User::with('scheme')->where('email', $validcredentials['useridentifier'])->first();
        }

        if ($user) {
            if (!$user->status) {
                return $this->sendResponse(false, 'Sorry, Your account is inactive. Kindly contact the administrator to activate it!', 200);
            }
            if (Hash::check($validcredentials['password'], $user->password)) {
                $token = $user->createToken('[peecEnergyAdmin]')->plainTextToken;
                $assignedpermissions = ModelsRolePermissionAssoc::where('role_id', $user->role_id)
                    ->where('status', true)->get();
            }
        } else {
            return $this->sendResponse(false, 'Invalid credentials', 200);
        }

        $userpermissions = [];
        if (!empty($assignedpermissions)) {
            for ($i = 0; $i < count($assignedpermissions); $i++) {
                $permission = ModelsPermission::findOrFail($assignedpermissions[$i]->permission_id);
                array_push($userpermissions, $permission->code);
            }
        }
        $userrole = Role::findOrFail($user->role_id);
        if ($token) {
            $user->api_token = $token;
            $user->save();
            return $this->sendResponse(
                true,
                "Login Successful",
                200,
                [
                    'token' => $token,
                    'user' => $user,
                    'role' => $userrole->name,
                    'permissions' => $userpermissions
                ]
            );
        } else {
            return $this->sendResponse(false, "Invalid Credentials", 400);
        }
    }
}
