<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAirportsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create( 'airports', function ( Blueprint $table ) {
            $table->bigIncrements( 'id' );
            $table->string( 'name' );
            $table->string( 'iata_code' )->unique();
            $table->string( 'country' );
            $table->string( 'city' );
            $table->string( 'timezone' );
            // https://stackoverflow.com/a/12504340/976720 : Lat/Lon data type
            $table->decimal( 'lat', 10, 8 );
            $table->decimal( 'lon', 11, 8 );

            $table->index( 'country' );
            $table->index( 'city' );
        } );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists( 'airports' );
    }
}
