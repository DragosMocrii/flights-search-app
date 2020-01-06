<?php

namespace App\FlightsGraph;

use App\FlightRoute;

class Airport extends Node {
    /**
     * @param $airport
     * @param FlightRoute $flight_route
     *
     * @return Route
     */
    public function addRouteTo( $airport, FlightRoute $flight_route ) {
        return new Route( $this, $airport, $flight_route );
    }
}
