<?php

namespace App\FlightsGraph;

use DateInterval;
use DateTimeImmutable;
use DateTimeInterface;
use DateTimeZone;

class FlyingSegment extends FlightSegment {

    private $flight_route_id;

    /**
     * @param string $start_date
     * @param Edge $edge
     *
     * @param DateTimeInterface|null $previous_segment_end_time
     *
     * @return static
     * @throws \Exception
     */
    public static function makeFrom( $start_date, Edge $edge, DateTimeInterface $previous_segment_end_time = NULL ) {
        $departure_time     = $edge->getAttr( 'depart_at' );
        $departure_datetime = sprintf( "%s %s", $start_date, $departure_time );
        $departure_timezone = $edge->getAttr( 'from_timezone' );
        $segment_time_start = DateTimeImmutable::createFromFormat( 'Y-m-d H:i:s', $departure_datetime,
            new DateTimeZone( $departure_timezone ) );

        // if the start date is less than previous segment, it means the layover was too long,
        // making the new segment start the next day
        if ( NULL !== $previous_segment_end_time && $segment_time_start < $previous_segment_end_time ) {
            $segment_time_start = $segment_time_start->add( new DateInterval( "P1D" ) );
        }

        $end_timezone     = $edge->getAttr( 'to_timezone' );
        $segment_duration = $edge->getAttr( 'duration' );
        $segment_time_end = $segment_time_start->setTimezone( new DateTimeZone( $end_timezone ) );
        $segment_time_end = $segment_time_end->add( new DateInterval( "PT{$segment_duration}M" ) );

        $price = $edge->getAttr( 'price' );

        $instance = new static();
        $instance->setStartsAt( $segment_time_start )
                 ->setEndsAt( $segment_time_end )
                 ->setPrice( $price );
        $instance->flight_route_id = $edge->getAttr( 'flight_id' );

        return $instance;
    }

    /**
     * @inheritDoc
     */
    public function type() {
        return 'flying';
    }

    /**
     * Get the flight route ID
     *
     * @return mixed
     */
    public function getFlightRouteId() {
        return $this->flight_route_id;
    }
}
