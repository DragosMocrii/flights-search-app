<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSearchQueriesTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create( 'search_queries', function ( Blueprint $table ) {
            $table->bigIncrements( 'id' );
            $table->unsignedBigInteger( 'user_id' );
            $table->foreign( 'user_id' )
                  ->references( 'id' )
                  ->on( 'users' )
                  ->onDelete( 'cascade' );
            $table->timestamps();
            $table->unsignedBigInteger( 'from_airport_id' );
            $table->unsignedBigInteger( 'to_airport_id' );
            $table->date( 'flight_date' );
            $table->json( 'restrictions' )->nullable();
            $table->boolean( 'is_processed' )->default( FALSE );
        } );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists( 'search_queries' );
    }
}
