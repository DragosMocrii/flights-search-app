<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSearchResultsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create( 'search_results', function ( Blueprint $table ) {
            $table->bigIncrements( 'id' );
            $table->unsignedBigInteger( 'search_id' );
            $table->foreign( 'search_id' )
                  ->references( 'id' )
                  ->on( 'search_queries' )
                  ->onDelete( 'cascade' );
            $table->unsignedSmallInteger( 'total_duration' );
            $table->unsignedSmallInteger( 'total_layovers' );
            $table->unsignedSmallInteger( 'total_price' );
            $table->json( 'routes' );
            $table->date( 'flight_date' );
            $table->dateTimeTz( 'departs_at' );
            $table->timestamps();

            $table->index( 'search_id' );
        } );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists( 'search_results' );
    }
}
