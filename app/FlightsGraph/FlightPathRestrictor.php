<?php

namespace App\FlightsGraph;

use Illuminate\Support\Str;

class FlightPathRestrictor {
    /** @var array */
    private $validations = [];

    public static function make() {
        return new static();
    }

    public static function makeFrom( $rules ) {
        $instance = new static();

        foreach ( $rules as $rule_name => $rule_val ) {
            $rule_method = Str::camel( 'ensure_' . $rule_name );

            if ( method_exists( static::class, $rule_method ) ) {
                $instance->{$rule_method}( $rule_val );
            }
        }

        return $instance;
    }

    protected function enqueueRestriction( callable $callback ) {
        $this->validations[] = $callback;
    }

    public function ensureMaxLayovers( $max_layovers = 3 ) {
        $this->enqueueRestriction( function ( FlightPath $path ) use ( $max_layovers ) {
            return $path->getLayoversCount() <= $max_layovers;
        } );

        return $this;
    }

    public function ensureRestrictedAirline( $airline_id ) {
        $this->enqueueRestriction( function ( FlightPath $path ) use ( $airline_id ) {
            $last_edge_airline_id = $path->getLastFlightAirlineId();

            if ( $last_edge_airline_id ) {
                return $last_edge_airline_id == $airline_id;
            }

            return TRUE;
        } );

        return $this;
    }

    public function ensureMinDepartAt( $timestamp ) {
        if ( ! $timestamp ) {
            return TRUE;
        }

        $this->enqueueRestriction( function ( FlightPath $path ) use ( $timestamp ) {
            return $path->getFlightTime()->getTimestamp() >= $timestamp;
        } );

        return $this;
    }

    public function ensureMaxDuration( $max_duration = ( 40 * 60 ) ) {
        $this->enqueueRestriction( function ( FlightPath $path ) use ( $max_duration ) {
            return $path->getTotalDuration() <= $max_duration;
        } );

        return $this;
    }

    public function ensureNoLongLayover( $max_wait = 360 ) {
        $this->enqueueRestriction( function ( FlightPath $path ) use ( $max_wait ) {
            return $path->getLastLayoverDuration() <= $max_wait;
        } );

        return $this;
    }

    public function ensureReasonableConnection( $min_time = 90 ) {
        $this->enqueueRestriction( function ( FlightPath $path ) use ( $min_time ) {
            if ( $path->hasLayovers() ) {
                return $path->getLastLayoverDuration() >= $min_time;
            }

            return TRUE;
        } );

        return $this;
    }

    /**
     * Checks if validator passes
     *
     * @param FlightPath $path
     *
     * @return bool
     */
    public function passesRestrictions( FlightPath $path ) {
        foreach ( $this->validations as $validation_callback ) {
            if ( $validation_callback( $path ) === FALSE ) {
                return FALSE;
            }
        }

        return TRUE;
    }

}
