<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePasswordChangesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('password_changes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('contact')->index();
            $table->string('model');
            $table->boolean('use_phone')->default(false);
            $table->boolean('status')->default(false);
            $table->string('token');
            $table->timestamp('expiry_date')->default(Carbon::now()->addHour());
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
        Schema::dropIfExists('password_changes');
    }
}
