<?php

namespace App\FlightsGraph;

use App\FlightRoute;

class Route extends Edge {
    public function __construct( Node $from, Node $to, FlightRoute $flight_route ) {
        parent::__construct( $from, $to, [
            'flight_id'     => $flight_route->id,
            'depart_at'     => $flight_route->depart_at,
            'duration'      => $flight_route->flight_duration,
            'from_timezone' => $flight_route->from_timezone,
            'to_timezone'   => $flight_route->to_timezone,
            'price'         => $flight_route->price,
            'airline_id'    => $flight_route->airline_id,
        ] );
    }
}
