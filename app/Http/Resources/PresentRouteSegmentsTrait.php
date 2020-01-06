<?php

namespace App\Http\Resources;

use App\FlightRoute;
use App\FlightsGraph\FlightPath;
use App\FlightsGraph\FlightSegment;
use Carbon\CarbonInterval;
use Illuminate\Support\Facades\DB;

trait PresentRouteSegmentsTrait {
    /**
     * @param $route_ids
     *
     * @param $flight_date
     *
     * @return array
     * @throws \Exception
     */
    private function presentRouteSegments( $route_ids, $flight_date ) {
        $flight_routes = FlightRoute::with( [ 'airline', 'airport_from', 'airport_to' ] )
                                    ->whereIn( 'id', $route_ids )
                                    ->orderBy( DB::raw( 'FIELD(`id`, ' . implode( ',', $route_ids ) . ')' ) )
                                    ->get();

        $flight_path = FlightPath::makeFromRoutes( $flight_routes, $flight_date );
        $segments    = [];

        /** @var FlightSegment $segment */
        foreach ( $flight_path->getSegments() as $segment ) {
            $segment_data                          = [];
            $segment_data[ 'type' ]                = $segment->type();
            $segment_data[ 'starts_at' ]           = $segment->startsAt()->format( 'h:ia D M d' );
            $segment_data[ 'ends_at' ]             = $segment->endsAt()->format( 'h:ia D M d' );
            $segment_data[ 'starts_at_timestamp' ] = $segment->startsAt()->getTimestamp();
            $segment_data[ 'ends_at_timestamp' ]   = $segment->endsAt()->getTimestamp();
            $segment_data[ 'duration' ]            = CarbonInterval::minutes( $segment->duration() )->cascade()->forHumans();

            if ( $segment->type() === 'flying' ) {
                $flight_id    = $segment->getFlightRouteId();
                $flight_route = $flight_routes->find( $flight_id );
                $airline      = $flight_route->airline;
                $airport_from = $flight_route->airport_from;
                $airport_to   = $flight_route->airport_to;

                $segment_data[ 'airline_name' ]  = $airline->name;
                $segment_data[ 'flight_code' ]   = $airline->iata_code . ' ' . $flight_id;
                $segment_data[ 'location_from' ] = $airport_from->city . ', ' . $airport_from->country;
                $segment_data[ 'location_to' ]   = $airport_to->city . ', ' . $airport_to->country;
            }

            $segments[] = $segment_data;
        }

        return $segments;
    }
}
