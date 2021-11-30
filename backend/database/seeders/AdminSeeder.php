<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Permission;
use App\Models\Role;
use App\Models\RolePermissionAssoc;
use Exception;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        try {
            $role = Role::create(['name' => 'Super Admin', 'is_admin_role' => false]);
            $admin = Admin::updateOrCreate(
                [
                    'email' => 'bash@gmail.com'
                ],
                [
                    'first_name' => 'Bashir',
                    'phone' => '256704655303',
                    'last_name' => 'Saidi',
                    'email' => 'bash@gmail.com',
                    'password' => Hash::make('Aa123456'),
                    'role_id' => $role->id,
                    'status' => true
                ]
            );

            $admin->save();
            //Assign Super Amin Permissions
            $permissions = Permission::all();
            for ($i = 0; $i < sizeof($permissions); $i++) {
                RolePermissionAssoc::create(['created_by' => $admin->id, 'role_id' => $role->id, 'permission_id' => $permissions[$i]->id]);
            }
            $this->command->info('Super Admin account migrated successfully:');
            $this->command->info('bash@gmail.com, Password:Aa123456');
        } catch (Exception $ex) {
            $this->command->error('Unable to migrate super admin account : ' . $ex->getMessage());
        }
    }
}
