<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTripsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create( 'trips', function ( Blueprint $table ) {
            $table->bigIncrements( 'id' );
            $table->timestamps();
            $table->string( 'name' )->nullable();
            $table->unsignedBigInteger( 'user_id' );
            $table->foreign( 'user_id' )
                  ->references( 'id' )
                  ->on( 'users' )
                  ->onDelete( 'cascade' );
            $table->unsignedBigInteger( 'related_trip_id' )->nullable();
            $table->foreign( 'related_trip_id' )
                  ->references( 'id' )
                  ->on( 'trips' )
                  ->onDelete( 'cascade' );
            $table->dateTimeTz( 'depart_at' );
            $table->json( 'routes' );
        } );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists( 'trips' );
    }
}
