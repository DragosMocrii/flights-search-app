<?php

namespace App\Http\Controllers\API;

use App\FlightRoute;
use App\Http\Controllers\Controller;
use App\SearchResult;
use App\Trip;
use App\Http\Resources\Trip as TripResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TripController extends Controller {
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index() {
        $trips = Auth::user()->trips()->onlyParents()->orderBy( 'depart_at', 'ASC' )->get( [
            'id',
            'name',
            'depart_at',
        ] );

        return response()->json( [ 'data' => $trips ] );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function store( Request $request ) {
        $itinerary = $request->get( 'trip_itinerary' );
        $validator = Validator::make( $itinerary, [
            '*.id' => 'exists:search_results,id',
        ] );

        if ( $validator->fails() ) {
            return response()->json( [ 'errors' => $validator->errors()->all() ], 422 );
        }

        $parent_trip_id = NULL;

        foreach ( $itinerary as $key => $item ) {
            /** @var SearchResult $search_result */
            $search_result   = Auth::user()->search_results()->find( $item[ 'result_id' ] );
            $trip            = new Trip();
            $trip->depart_at = $search_result->departs_at;
            $trip->routes    = $search_result->routes;

            if ( $key == 0 ) {
                $airport_from = FlightRoute::find( $search_result->routes[ 0 ] )->airport_from;
                $airport_to   = FlightRoute::find( $search_result->routes[ array_key_last( $search_result->routes ) ] )->airport_to;
                $trip_name    = count( $itinerary ) > 1 ? 'Roundtrip' : 'One-way';
                $trip_name    .= ' flight from ' . $airport_from->city . ' to ' . $airport_to->city;
                $trip->name   = $trip_name;
            } else {
                $trip->related_trip_id = $parent_trip_id;
            }

            $trip->user()->associate( Auth::user() );
            $trip->save();

            if ( $key == 0 ) {
                $parent_trip_id = $trip->id;
            }

        }

        return response()->json( [ 'data' => [ 'trip_id' => $parent_trip_id ] ] );
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show( $id ) {
        $trips = Auth::user()->trips()
                     ->where( 'id', '=', $id )
                     ->orWhere( 'related_trip_id', '=', $id )
                     ->get();

        if ( $trips->isEmpty() ) {
            return response()->json( [ 'errors' => [ 'Cannot find trip #' . $id ] ] );
        }

        return response()->json( [
            'data' => [
                'trip_name' => $trips->first()->name,
                'itinerary' => TripResource::collection( $trips ),
            ],
        ] );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy( $id ) {
        $trip = Auth::user()->trips()->find( $id );

        if ( $deleted = $trip->delete() ) {
            return response()->json( [ 'data' => [ 'deleted' => $deleted ] ] );
        } else {
            return response()->json( [ 'errors' => [ 'Could not delete trip.' ] ] );
        }
    }
}
