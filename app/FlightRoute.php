<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FlightRoute extends Model {
    /**
     * The attributes that are not mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    public function airline() {
        return $this->belongsTo( 'App\Airline' );
    }

    public function airport_from() {
        return $this->belongsTo( 'App\Airport', 'from_airport_id' );
    }

    public function airport_to() {
        return $this->belongsTo( 'App\Airport', 'to_airport_id' );
    }
}
