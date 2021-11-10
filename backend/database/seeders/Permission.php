<?php

namespace Database\Seeders;

use App\Models\Permission as ModelsPermission;
use Illuminate\Database\Seeder;

class Permission extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ModelsPermission::create(['code' => 'can_manage_admins', 'description' => 'Manage Super Admins', 'is_admin_permission' => true]);
        ModelsPermission::create(['code' => 'can_manage_groups', 'description' => 'Manage Groups', 'is_admin_permission' => true]);
        ModelsPermission::create(['code' => 'can_manage_user_roles', 'description' => 'Manage User Roles', 'is_admin_permission' => true]);
        ModelsPermission::create(['code' => 'can_manage_group_admins', 'description' => 'Manage Group Admins', 'is_admin_permission' => true]);
        ModelsPermission::create(['code' => 'can_manage_projects', 'description' => 'Manage Projects', 'is_admin_permission' => false]);
        ModelsPermission::create(['code' => 'can_view_collection_reports', 'description' => 'View Reports', 'is_admin_permission' => false]);
        ModelsPermission::create(['code' => 'can_manage_members', 'description' => 'Manage Members', 'is_admin_permission' => false]);
        ModelsPermission::create(['code' => 'can_manage_settings', 'description' => 'Manage Settings', 'is_admin_permission' => false]);
    }
}
