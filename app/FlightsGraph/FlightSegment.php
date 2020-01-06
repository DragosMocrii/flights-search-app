<?php

namespace App\FlightsGraph;

use DateTime;
use DateTimeImmutable;
use DateTimeInterface;

abstract class FlightSegment {
    /** @var float */
    protected $price;
    /** @var DateTimeImmutable */
    protected $starts_at;
    /** @var DateTimeImmutable */
    protected $ends_at;

    /**
     * Creates a new instance of self
     *
     * @return static
     */
    public static function make() {
        return new static();
    }

    /**
     * Set segment start time
     *
     * @param DateTimeInterface $date_time
     *
     * @return FlightSegment
     */
    public function setStartsAt( DateTimeInterface $date_time ) {
        if ( $date_time instanceof DateTime ) {
            $this->starts_at = DateTimeImmutable::createFromMutable( $date_time );
        } else {
            $this->starts_at = $date_time;
        }

        return $this;
    }

    /**
     * Get segment start time
     *
     * @return DateTimeImmutable
     */
    public function startsAt() {
        return $this->starts_at;
    }

    /**
     * Set segment end time
     *
     * @param DateTimeInterface $date_time
     *
     * @return FlightSegment
     */
    public function setEndsAt( DateTimeInterface $date_time ) {
        if ( $date_time instanceof DateTime ) {
            $this->ends_at = DateTimeImmutable::createFromMutable( $date_time );
        } else {
            $this->ends_at = $date_time;
        }

        return $this;
    }

    /**
     * Get segment end time
     *
     * @return DateTimeImmutable
     */
    public function endsAt() {
        return $this->ends_at;
    }

    /**
     * Set segment price
     *
     * @param float $price
     *
     * @return FlightSegment
     */
    public function setPrice( float $price ) {
        $this->price = $price;

        return $this;
    }

    /**
     * Returns segment price
     *
     * @return float
     */
    public function price() {
        return $this->price;
    }

    /**
     * Return segment duration in minutes
     *
     * @return int
     */
    public function duration() {
        return intval( abs( $this->endsAt()->getTimestamp() - $this->startsAt()->getTimestamp() ) / 60 );
    }

    /**
     * Return type of segment
     *
     * @return string
     */
    abstract public function type();
}
