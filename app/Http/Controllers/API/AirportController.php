<?php

namespace App\Http\Controllers\API;

use App\Airport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AirportController extends Controller {
    public function index( Request $request ) {
        if ( $request->has( 'search' ) ) {
            $airports = Airport::where( 'iata_code', 'LIKE', "%{$request->get('search')}%" )
                               ->orWhere( 'name', 'LIKE', "%{$request->get('search')}%" )
                               ->get( [ 'id', 'name', 'iata_code' ] );

            return response()->json( [ 'data' => $airports ] );
        } else {
            return response()->json( [ 'data' => Airport::all( [ 'id', 'name', 'iata_code' ] ) ] );
        }
    }
}
