<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSchemesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schemes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('contact_person');
            $table->string('location');
            $table->string('phone');
            $table->timestamp('phone_verified_at')->nullable();
            $table->string('email');
            $table->timestamp('email_verified_at')->nullable();
            $table->integer('category_id');
            $table->foreign('category_id')->references('id')->on('scheme_types');
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
        Schema::dropIfExists('schemes');
    }
}
