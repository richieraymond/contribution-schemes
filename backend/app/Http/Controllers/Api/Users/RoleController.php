<?php

namespace App\Http\Controllers\Api\Users;

use App\AdminRole;
use App\Http\Controllers\BaseController;
use App\Http\Requests\CreateRoleRequest;
use App\Models\Role;
use Auth;
use Illuminate\Support\Facades\Auth as FacadesAuth;

class RoleController extends BaseController
{
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
            $roles = Role::with('scheme')->get();
            return $this->sendResponse(
                true,
                'Roles retrieved successfully',
                200,
                ['roles' => $roles]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve roles'
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateRoleRequest $request)
    {
        try {
            $validated = $request->validated();
            $role = new Role();
            $role->name = $validated['name'];
            $role->is_admin_role = $validated['is_admin_role'];
            $role->scheme_id = $validated['scheme_id'];
            $role->ip_address = $request->ip();
            $role->user_agent = $request->header('User-Agent');
            $role->created_by =  FacadesAuth::user()->id;
            $role->save();
            return $this->sendResponse(
                true,
                'Role added successfully',
                200,
                ['role' => $role]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to add role' . $ex, 400);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CreateRoleRequest $request, $id)
    {
        try {
            $validated = $request->validated();
            $role = Role::findOrFail($id);
            $role->name = $validated['name'];
            $role->scheme_id = $validated['scheme_id'];
            $role->updated_by = FacadesAuth::user()->id;
            if (array_key_exists('status', $validated)) {
                $role->status = $validated['status'];
            }
            $role->save();
            return $this->sendResponse(
                true,
                'Role updated successfully',
                200,
                ['role' => $role]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to update role', 400);
        }
    }

    public function show($roleId)
    {
        try {
            $role = Role::findOrFail($roleId);
            return $this->sendResponse(
                true,
                'Role retrieved successfully',
                200,
                ['role' => $role]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve role'
            );
        }
    }

    public function getRoleBySchemeId($schemeId)
    {
        try {
            $roles = Role::where(['scheme_id' => $schemeId])->get();
            return $this->sendResponse(
                true,
                'Roles retrieved successfully',
                200,
                ['roles' => $roles]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(
                false,
                'Failed to retrieve company roles'
            );
        }
    }
}
