<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->boolean('is_recurring')->default(false);
            $table->integer('frequency')->nullable();
            $table->string('frequency_unit')->nullable();
            $table->boolean('require_fixed_amounts')->default(false);
            $table->boolean('allow_installments')->default(false);
            $table->double('penalty_when_missed')->default(0);
            $table->boolean('status')->default(true);
            $table->integer('scheme_id')->nullable();
            $table->foreign('scheme_id')->references('id')->on('schemes');
            $table->integer('created_by');
            $table->foreign('created_by')->references('id')->on('users');
            $table->integer('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('users');
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
        Schema::dropIfExists('projects');
    }
}
