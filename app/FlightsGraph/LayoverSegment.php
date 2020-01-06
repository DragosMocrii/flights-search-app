<?php

namespace App\FlightsGraph;

class LayoverSegment extends FlightSegment {

    public static function makeFrom( FlightSegment $segment1, FlightSegment $segment2 ) {
        $start_time = $segment1->endsAt();
        $end_time   = $segment2->startsAt();

        $instance = new static();
        $instance->setStartsAt( $start_time )
                 ->setEndsAt( $end_time );

        return $instance;
    }

    public function price() {
        return 0;
    }

    /**
     * @inheritDoc
     */
    public function type() {
        return 'layover';
    }
}
