<?php

namespace App\Http\Controllers\Api\Users;

use App\Http\Controllers\BaseController;
use App\Http\Requests\ModifyPermissionRequest;
use App\Models\Permission;
use App\Models\Role;
use App\Models\RolePermissionAssoc;
use Illuminate\Support\Facades\Auth;

class PrivilegeController extends BaseController
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

    public function index($roleid)
    {
        try {
            $allpermissions = Permission::all();
            $role = Role::findOrFail($roleid);
            $assignedpermissions = RolePermissionAssoc::where('role_id', $roleid)->get();
            if (!$role->is_admin_role) {
                $allpermissions = Permission::where(['is_admin_permission' => false])->get();
            }
            return $this->sendResponse(
                true,
                'Permissions retrieved successfully',
                200,
                ['allpermissions' => $allpermissions, 'assignedpermissions' => $assignedpermissions]
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to retrieve permissions', 400);
        }
    }

    public function addPermission(ModifyPermissionRequest $request)
    {
        try {
            $validated = $request->validated();
            $assigned = RolePermissionAssoc::where('role_id', $validated['roleid'])
                ->where('permission_id', $validated['permissionid'])->get();
            if (empty($assigned)) {
                $role = RolePermissionAssoc::findOrFail($assigned[0]->id);
                $role->status = true;
                $role->save();
                return $this->sendResponse(true, 'Permission assigned successfully');
            } else {
                $permission = new RolePermissionAssoc();
                $permission->role_id = $request->roleid;
                $permission->created_by = Auth::user()->id;
                $permission->permission_id =  $request->permissionid;
                $permission->save();
                return $this->sendResponse(true, 'Permission assigned successfully');
            }
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to assign permission' . $ex, 400);
        }
    }

    public function revokePermission(ModifyPermissionRequest $request)
    {
        try {
            $validated = $request->validated();
            $assigned = RolePermissionAssoc::where('role_id', $validated['roleid'])
                ->where('permission_id', $validated['permissionid'])->get();
            $role = RolePermissionAssoc::findOrFail($assigned[0]->id);
            $role->status = false;
            $role->save();
            return $this->sendResponse(
                true,
                'Permission assigned successfully',
                200
            );
        } catch (\Exception $ex) {
            return $this->sendResponse(false, 'Failed to assign permission', 400);
        }
    }
}
