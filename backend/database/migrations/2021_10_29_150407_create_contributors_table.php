<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContributorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contributors', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->integer('scheme_id');
            $table->foreign('scheme_id')->references('id')->on('schemes');
            $table->integer('branch_id')->nullable();
            $table->foreign('branch_id')->references('id')->on('branches');
            $table->integer('title')->nullable();
            $table->foreign('title')->references('id')->on('titles');
            $table->integer('education_level')->nullable();
            $table->foreign('education_level')->references('id')->on('education_levels');
            $table->string('gender');
            $table->date('dob');
            $table->integer('maritalstatus')->nullable();
            $table->foreign('maritalstatus')->references('id')->on('marital_statuses');
            $table->string('other_phone')->nullable();
            $table->string('home_parish');
            $table->string('center');
            $table->string('residence');
            $table->string('biological_mother');
            $table->string('biological_father');
            $table->string('spouse')->nullable();
            $table->string('next_of_kin');
            $table->string('kin_telephone');
            $table->string('other_kin_telephone')->nullable();
            $table->string('kin_email');
            $table->string('other_kin_email')->nullable();
            $table->integer('created_by');
            $table->foreign('created_by')->references('id')->on('users');
            $table->integer('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('users');
            $table->text('profile_pic')->nullable();
            $table->boolean('status')->default(true);
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->rememberToken();
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
        Schema::dropIfExists('contributors');
    }
}
