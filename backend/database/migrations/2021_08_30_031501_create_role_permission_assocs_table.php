<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRolePermissionAssocsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('role_permission_assocs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('role_id');
            $table->foreign('role_id')->references('id')->on('roles');
            $table->integer('permission_id');
            $table->foreign('permission_id')->references('id')->on('permissions');
            $table->boolean('status')->default(true);
            $table->integer('created_by');
            $table->foreign('created_by')->references('id')->on('admins');
            $table->integer('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('role_permission_assocs');
    }
}
