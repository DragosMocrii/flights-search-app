<?php

namespace App\FlightsGraph;

use App\FlightRoute;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Collection;

class FlightPath extends Path {

    /** @var string Y-m-d */
    private $flight_date;
    /** @var FlightSegment[] */
    private $segments = [];

    public function __construct( Node $from, Node $to, $flight_date ) {
        parent::__construct( $from, $to );

        $this->flight_date = $flight_date;
    }

    /**
     * @param Collection $routes
     * @param string $flight_date Y-m-d
     *
     * @return FlightPath
     * @throws \Exception
     */
    public static function makeFromRoutes( $routes, $flight_date ) {
        if ( $routes->getQueueableClass() !== FlightRoute::class ) {
            throw new \LogicException( 'Expected collection of FlightRoute objects.' );
        }

        $flight_graph = new FlightsGraph();
        $node_from    = $flight_graph->addAirport( new Airport( $routes->first()->from_airport_id ) );
        $node_to      = $flight_graph->addAirport( new Airport( $routes->last()->to_airport_id ) );

        $instance = new static( $node_from, $node_to, $flight_date );

        foreach ( $routes as $route ) {
            $node_from = $flight_graph->addAirport( new Airport( $route->from_airport_id ) );
            $node_to   = $flight_graph->addAirport( new Airport( $route->to_airport_id ) );
            $instance->addEdge( new Route( $node_from, $node_to, $route ) );
        }

        return $instance;
    }

    /**
     * Checks if the path has segments
     *
     * @return bool
     */
    public function hasSegments() {
        return isset( $this->segments[ 0 ] );
    }

    /**
     * Returns flight date, Y-m-d format
     *
     * @return string
     */
    public function getFlightDate() {
        return $this->flight_date;
    }

    /**
     * Get start time of flight, including timezone
     *
     * @return DateTimeInterface|false
     */
    public function getFlightTime() {
        if ( $this->hasSegments() ) {
            return $this->segments[ 0 ]->startsAt();
        } else {
            return FALSE;
        }
    }

    /**
     * Returns total duration (flying + layover)
     *
     * @return int
     */
    public function getTotalDuration() {
        return array_reduce( $this->segments, function ( $acc, FlightSegment $segment ) {
            $acc += $segment->duration();

            return $acc;
        }, 0 );
    }

    /**
     * Counts total number of layovers
     *
     * @return int
     */
    public function getLayoversCount() {
        return array_reduce( $this->segments, function ( $acc, FlightSegment $segment ) {
            if ( $segment->type() === 'layover' ) {
                $acc ++;
            }

            return $acc;
        }, 0 );
    }

    /**
     * Returns total flight path price
     *
     * @return int
     */
    public function getTotalPrice() {
        return array_reduce( $this->segments, function ( $acc, FlightSegment $segment ) {
            $acc += $segment->price();

            return $acc;
        }, 0 );
    }

    /**
     * Get path list of route IDs
     *
     * @return array
     */
    public function getRoutes() {
        $path   = $this->getEdges();
        $routes = array_map( function ( Edge $edge ) {
            return $edge->getAttr( 'flight_id' );
        }, $path );

        return $routes;
    }

    /**
     * Returns the list of segments making path
     *
     * @return FlightSegment[]
     */
    public function getSegments() {
        return $this->segments;
    }

    /**
     * Checks if path has connections, ie has a layover
     *
     * @return bool
     */
    public function hasLayovers() {
        foreach ( $this->segments as $segment ) {
            if ( $segment->type() === 'layover' ) {
                return TRUE;
            }
        }

        return FALSE;
    }

    /**
     * Return last layover duration (if exists), zero otherwise
     *
     * @return int
     */
    public function getLastLayoverDuration() {
        if ( ! $this->hasLayovers() ) {
            return 0;
        }

        //there is always another segment after a layover
        $last_segment = $this->segments[ array_key_last( $this->segments ) - 1 ];

        if ( $last_segment->type() === 'layover' ) {
            return $last_segment->duration();
        } else {
            return 0;
        }
    }

    /**
     * Return last flying segment Airline ID
     *
     * @return bool|mixed|null
     */
    public function getLastFlightAirlineId() {
        $last_edge = $this->getLastEdge();

        if ( $last_edge ) {
            return $last_edge->getAttr( 'airline_id' );
        }

        return FALSE;
    }

    public function addEdge( Edge $edge ) {
        parent::addEdge( $edge );

        $this->addFlightSegment( $edge );
    }

    /**
     * Adds flight segment, and maybe layover segment if necessary
     *
     * @param Edge $edge
     *
     * @throws \Exception
     */
    protected function addFlightSegment( Edge $edge ) {
        if ( ! $this->hasSegments() ) {
            $this->segments[] = FlyingSegment::makeFrom( $this->getFlightDate(), $edge );
        } else {
            $prev_segment     = $this->segments[ array_key_last( $this->segments ) ];
            $next_segment     = FlyingSegment::makeFrom( $prev_segment->endsAt()->format( 'Y-m-d' ), $edge,
                $prev_segment->endsAt() );
            $this->segments[] = LayoverSegment::makeFrom( $prev_segment, $next_segment );
            $this->segments[] = $next_segment;
        }
    }

}
