<?php

namespace App\Http\Controllers\API;

use App\Airline;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AirlineController extends Controller {
    public function index( Request $request ) {
        if ( $request->has( 'search' ) ) {
            $airlines = Airline::where( 'iata_code', 'LIKE', "%{$request->get('search')}%" )
                               ->orWhere( 'name', 'LIKE', "%{$request->get('search')}%" )
                               ->get( [ 'id', 'name', 'iata_code' ] );

            return response()->json( [ 'data' => $airlines ] );
        } else {
            return response()->json( [ 'data' => Airline::all( [ 'id', 'name', 'iata_code' ] ) ] );
        }
    }
}
