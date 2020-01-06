<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Trip extends Model {
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'routes' => 'array',
    ];

    public function scopeOnlyParents( $query ) {
        return $query->whereNull( 'related_trip_id' );
    }

    public function user() {
        return $this->belongsTo( 'App\User' );
    }

}
