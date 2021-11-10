<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContributionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contributions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('contributor_id');
            $table->foreign('contributor_id')->references('id')->on('contributors');
            $table->integer('scheme_id');
            $table->foreign('scheme_id')->references('id')->on('schemes');
            $table->integer('branch_id')->nullable();
            $table->foreign('branch_id')->references('id')->on('branches');
            $table->integer('project_id');
            $table->foreign('project_id')->references('id')->on('projects');
            $table->double('amount');
            $table->integer('sasula_reference')->nullable();
            $table->string('payer_phone')->nullable();
            $table->string('payment_channel')->nullable();
            $table->boolean('status')->default(false);
            $table->string('channel_tran_id')->nullable();
            $table->date('channel_tran_date')->nullable();
            $table->string('teal_id')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
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
        Schema::dropIfExists('contributions');
    }
}
