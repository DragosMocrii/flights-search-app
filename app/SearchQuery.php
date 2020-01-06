<?php

namespace App;

use DateTime;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SearchQuery extends Model {

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'restrictions' => 'array',
    ];

    public function user() {
        return $this->belongsTo( 'App\User' );
    }

    public function search_results() {
        return $this->hasMany( 'App\SearchResult', 'search_id' );
    }

    /**
     * Finds model by hash
     *
     * @param $hash
     *
     * @return static
     */
    public static function findByHash( $hash ) {
        $data = decrypt( $hash );

        if ( is_array( $data ) && isset( $data[ 'id' ] ) ) {
            return static::find( $data[ 'id' ] );
        } else {
            throw ( new ModelNotFoundException )->setModel(
                static::class, $data[ 'id' ]
            );
        }
    }

    /**
     * Generates ID hash to be used safely on frontend
     *
     * @return string
     */
    public function getIdHash() {
        return encrypt( [ 'id' => $this->id ] );
    }

    public function markProcessed() {
        $this->is_processed = TRUE;
        $this->save();
    }

    public function fromAirportId() {
        return $this->from_airport_id;
    }

    public function toAirportId() {
        return $this->to_airport_id;
    }

    /**
     * Y-m-d date format
     *
     * @return mixed
     */
    public function flightDate() {
        return $this->flight_date;
    }
}
