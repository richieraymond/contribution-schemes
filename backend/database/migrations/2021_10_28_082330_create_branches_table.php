<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBranchesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('branches', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('contact_person')->nullable();
            $table->string('location')->nullable();
            $table->string('phone')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->string('email')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->integer('scheme_id');
            $table->foreign('scheme_id')->references('id')->on('schemes');
            $table->integer('hierarchy_id')->nullable();
            $table->foreign('hierarchy_id')->references('id')->on('scheme_hierarchies');
            $table->integer('parent_branch')->nullable();
            $table->foreign('parent_branch')->references('id')->on('branches');
            $table->integer('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins');
            $table->integer('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins');
            $table->boolean('status')->default(true);
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
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
        Schema::dropIfExists('branches');
    }
}
