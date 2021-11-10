<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSchemeIdToHierarchies extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('scheme_hierarchies', function (Blueprint $table) {
            $table->integer('scheme_id');
            $table->foreign('scheme_id')->references('id')->on('schemes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('scheme_hierarchies', function (Blueprint $table) {
            $table->dropColumn('scheme_id');
        });
    }
}
