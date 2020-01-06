<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SearchResult extends Model {
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'routes' => 'array',
    ];

    public function search_query() {
        return $this->belongsTo( 'App\SearchQuery', 'search_id' );
    }

}
