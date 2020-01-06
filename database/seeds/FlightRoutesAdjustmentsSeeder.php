<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Location\Coordinate;
use Location\Distance\Haversine;

class FlightRoutesAdjustmentsSeeder extends Seeder {

    // avg plane speed in km/h
    const AVG_PLANE_SPEED = 800;
    // flight time overhead for takeoff + landing
    const FLIGHT_OVERHEAD_MINUTES = 40;
    // price per KM
    const PRICE_KM = 0.1;
    // price per flight minute
    const PRICE_MINUTE = 2;

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        // First we take all Airports, to build departure flight times
        $airports = DB::select( 'SELECT * FROM airports' );

        DB::beginTransaction();

        foreach ( $airports as $from_airport ) {
            $flight_routes = DB::select(
                'SELECT fr.id AS flight_route_id, da.timezone, da.lon, da.lat
                FROM flight_routes AS fr
                INNER JOIN airports AS da ON fr.to_airport_id = da.id
                WHERE from_airport_id = ?',
                [ $from_airport->id ]
            );

            $total_airport_dep_flights = count( $flight_routes );

            if ( $total_airport_dep_flights < 1 ) {
                continue;
            }

            // one interval is 5 min
            $interval      = 5;
            $day_intervals = 24 * 60 / $interval;
            // interval between departure flights
            $flight_interval            = floor( max( $day_intervals / $total_airport_dep_flights, 1 ) );
            $first_flight_of_the_day    = mt_rand( 0, $day_intervals - 1 ) * $interval;
            $next_flight_departure_time = $first_flight_of_the_day;

            foreach ( $flight_routes as $flight_route ) {
                $flight_distance = $this->calculateDistance(
                    $from_airport->lat, $from_airport->lon,
                    $flight_route->lat, $flight_route->lon
                );
                $flight_duration = $this->calculateDuration( $flight_distance );
                $flight_price    = $this->calculatePrice( $flight_distance, $flight_duration );

                $formatted_departure_time = $this->formatMinutes( $next_flight_departure_time );
                // if it throws exception, let it crash
                $flight_time = new DateTime( '2019-08-01 ' . $formatted_departure_time,
                    new DateTimeZone( $from_airport->timezone ) );
                $flight_time->setTimezone( new DateTimeZone( $flight_route->timezone ) );
                $flight_time->add( new DateInterval( "PT{$flight_duration}M" ) );

                $formatted_arrival_time = $flight_time->format( 'H:i:s' );

                DB::update(
                    'UPDATE flight_routes
                    SET depart_at = ?, arrive_at = ?, price = ?, distance = ?, flight_duration = ?, from_timezone = ?, to_timezone = ?
                    WHERE id = ?',
                    [
                        $formatted_departure_time,
                        $formatted_arrival_time,
                        $flight_price,
                        $flight_distance,
                        $flight_duration,
                        $from_airport->timezone,
                        $flight_route->timezone,
                        $flight_route->flight_route_id,
                    ]
                );

                // make sure next flight stays in bound of one day hour format
                // if there are more flights that the airport can handle at 5 minute intervals, let's just
                // assume that there are multiple departure lanes :)
                $next_flight_departure_time = ( $next_flight_departure_time + $flight_interval * $interval ) % ( 24 * 60 );
            }
        }

        DB::commit();
    }

    /**
     * Converts minutes to time format
     *
     * @param $minutes
     * @param string $format
     *
     * @return string
     */
    protected function formatMinutes( $minutes ) {
        $format  = '%02d:%02d:00';
        $hours   = floor( $minutes / 60 );
        $minutes = ( $minutes % 60 );

        return sprintf( $format, $hours, $minutes );
    }

    /**
     * Calculates estimated flight price
     *
     * @param $distance
     * @param $duration
     *
     * @return float|int
     */
    protected function calculatePrice( $distance, $duration ) {
        return ( $distance * self::PRICE_KM + $duration * self::PRICE_MINUTE ) * ( mt_rand( 75, 100 ) / 100 );
    }

    /**
     * Calculates estimated flight duration in minutes
     *
     * @param $distance
     *
     * @return false|float|int
     */
    protected function calculateDuration( $distance ) {
        return self::FLIGHT_OVERHEAD_MINUTES + floor( ( ( $distance / self::AVG_PLANE_SPEED ) * 60 ) );
    }

    /**
     * Calculates estimated flight distance, in Km
     *
     * @param $from_lat
     * @param $from_lon
     * @param $to_lat
     * @param $to_lon
     *
     * @return float|int
     */
    protected function calculateDistance( $from_lat, $from_lon, $to_lat, $to_lon ) {
        $from_coordinate = new Coordinate( $from_lat, $from_lon );
        $to_coordinate   = new Coordinate( $to_lat, $to_lon );
        $flight_distance = $from_coordinate->getDistance( $to_coordinate, new Haversine() ) / 1000; // in Km

        return $flight_distance;
    }
}
