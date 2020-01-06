<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFlightRoutesTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create( 'flight_routes', function ( Blueprint $table ) {
            $table->bigIncrements( 'id' );

            $table->unsignedBigInteger( 'airline_id' );
            $table->foreign( 'airline_id' )
                  ->references( 'id' )->on( 'airlines' )
                  ->onDelete( 'cascade' );

            $table->unsignedBigInteger( 'from_airport_id' );
            $table->foreign( 'from_airport_id' )
                  ->references( 'id' )->on( 'airports' )
                  ->onDelete( 'cascade' );

            $table->unsignedBigInteger( 'to_airport_id' );
            $table->foreign( 'to_airport_id' )
                  ->references( 'id' )->on( 'airports' )
                  ->onDelete( 'cascade' );

            $table->string( 'from_timezone' )->nullable();
            $table->string( 'to_timezone' )->nullable();

            $table->time( 'depart_at', 0 )->nullable();
            $table->time( 'arrive_at', 0 )->nullable();
            // in Km
            $table->float( 'distance', 10, 3 )->nullable();
            // in minutes
            $table->unsignedSmallInteger( 'flight_duration' )->nullable();
            $table->decimal( 'price', 8, 2 )->nullable();
        } );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists( 'flight_routes' );
    }
}
