<?php

namespace App\Http\Controllers\API;

use App\Airport;
use App\Http\Controllers\Controller;
use App\Jobs\ProcessSearchQuery;
use App\SearchQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\SearchResult as SearchResultResource;

class SearchController extends Controller {
    public function store( Request $request ) {
        $data      = $request->only( [ 'from', 'to', 'date', 'filters' ] );
        $validator = Validator::make( $data, [
            'from'                       => [ 'required', 'exists:airports,id' ],
            'to'                         => [ 'required', 'exists:airports,id' ],
            'date'                       => [
                'required',
                'date_format:Y-m-d',
                function ( $attribute, $value, $fail ) use ( &$data ) {
                    if ( empty( $data[ 'from' ] ) ) {
                        return;
                    }

                    $airport_from = Airport::find( $data[ 'from' ] );

                    if ( $airport_from ) {
                        $current_time = new \DateTimeImmutable( 'now', new \DateTimeZone( $airport_from->timezone ) );
                        //minimum buffer time allowed to book flight: 90minutes
                        $min_depart_at = $current_time->add( new \DateInterval( 'PT90M' ) );
                        $max_depart_at = $current_time->add( new \DateInterval( 'P365D' ) );

                        //@todo: this looks like magic, and should be reworked
                        if ( $min_depart_at->getTimestamp() > $data[ 'filters' ][ 'min_depart_at' ]
                        ) {
                            $data[ 'filters' ][ 'min_depart_at' ] = $min_depart_at->getTimestamp();
                        }

                        if ( $min_depart_at->format( 'Y-m-d' ) > $value ) {
                            return $fail( 'Minimum 90 minutes before flight. Choose a future date.' );
                        }

                        if ( $value > $max_depart_at->format( 'Y-m-d' ) ) {
                            return $fail( 'Maximum departure date is 365 from now.' );
                        }
                    }
                },
            ],
            'filters.max_duration'       => [ 'numeric', 'min:1', 'max:2880' ],
            'filters.max_layovers'       => [ 'numeric', 'min:0', 'max:3' ],
            'filters.min_depart_at'      => [ 'nullable', 'numeric' ],
            'filters.restricted_airline' => [ 'nullable', 'exists:airlines,id' ],
        ] );

        if ( $validator->fails() ) {
            return response()->json( [ 'errors' => $validator->errors()->all() ], 422 );
        }

        $search_query                  = new SearchQuery();
        $search_query->from_airport_id = $data[ 'from' ];
        $search_query->to_airport_id   = $data[ 'to' ];
        $search_query->flight_date     = $data[ 'date' ];
        $search_query->user()->associate( Auth::user() );
        $search_query->restrictions = $data[ 'filters' ];
        $search_query->save();

        ProcessSearchQuery::dispatch( $search_query )->onConnection( 'redis' );

        return response()->json( [ 'search_hash' => $search_query->getIdHash() ] );
    }

    public function show( Request $request, $hash_id ) {
        $search_query   = SearchQuery::findByHash( $hash_id );
        $last_result_id = (int) $request->get( 'last_result_id' );

        if ( $search_query ) {
            $search_results = $search_query->search_results()
                                           ->where( 'id', '>', $last_result_id )
                                           ->get();

            return response()->json( [
                'data'             => SearchResultResource::collection( $search_results ),
                'last_result_id'   => $search_results->last()->id ?? $last_result_id,
                'search_completed' => $search_query->is_processed,
            ] );
        }

        return response()->json( [ 'errors' => [ 'Search request not found.' ] ] );
    }
}
