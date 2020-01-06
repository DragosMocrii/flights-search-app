<?php

namespace Tests\Unit;

use App\FlightsGraph\Edge;
use App\FlightsGraph\FlightSegment;
use App\FlightsGraph\FlyingSegment;
use App\FlightsGraph\LayoverSegment;
use App\FlightsGraph\Node;
use PHPUnit\Framework\TestCase;

class FlightSegmentTest extends TestCase {
    public function testFlightSegment() {
        $stub = $this->getMockForAbstractClass( FlightSegment::class );

        $segment = $stub::make();

        $this->assertInstanceOf( FlightSegment::class, $segment );

        $start_at = new \DateTime( '2019-12-30' );

        $this->assertEquals( $segment, $segment->setStartsAt( $start_at ) );
        $this->assertEquals( $segment->startsAt()->getTimestamp(), $start_at->getTimestamp() );
        $this->assertNotEquals( get_class( $start_at ), get_class( $segment->startsAt() ) );

        $ends_at = new \DateTime( '2019-12-31' );

        $this->assertEquals( $segment, $segment->setEndsAt( $ends_at ) );
        $this->assertEquals( $segment->endsAt()->getTimestamp(), $ends_at->getTimestamp() );
        $this->assertNotEquals( get_class( $ends_at ), get_class( $segment->endsAt() ) );


        $price = 153.13;
        $segment->setPrice( $price );

        $this->assertEquals( $price, $segment->price() );

        $this->assertEquals( 24 * 60, $segment->duration() );
    }

    public function testFlyingSegment() {
        $start_at = ( new \DateTime( '2019-12-30' ) )->format( 'Y-m-d' );
        $edge     = new Edge( new Node( 1 ), new Node( 2 ), [
            'depart_at'     => '08:00:00',
            'duration'      => 120,
            'from_timezone' => 'America/Toronto',
            'to_timezone'   => 'America/Toronto',
            'price'         => 150,
            'airline_id'    => 1,
        ] );

        $segment = FlyingSegment::makeFrom( $start_at, $edge );

        $this->assertInstanceOf( FlyingSegment::class, $segment );
        $this->assertEquals( '08:00', $segment->startsAt()->format( 'H:i' ) );
        $this->assertEquals( 120, $segment->duration() );
        $this->assertEquals( 150, $segment->price() );
        $this->assertEquals( '10:00', $segment->endsAt()->format( 'H:i' ) );
    }

    public function testLayoverSegment() {
        $start_at = ( new \DateTime( '2019-12-30' ) )->format( 'Y-m-d' );
        $node1    = new Node( 1 );
        $node2    = new Node( 2 );
        $node3    = new Node( 3 );

        $edge1 = new Edge( $node1, $node2, [
            'depart_at'     => '08:00:00',
            'duration'      => 120,
            'from_timezone' => 'America/Toronto',
            'to_timezone'   => 'America/Toronto',
            'price'         => 150,
            'airline_id'    => 1,
        ] );
        $edge2 = new Edge( $node2, $node3, [
            'depart_at'     => '14:00:00',
            'duration'      => 120,
            'from_timezone' => 'America/Toronto',
            'to_timezone'   => 'America/Halifax',
            'price'         => 150,
            'airline_id'    => 1,
        ] );

        $flight_segment1 = FlyingSegment::makeFrom( $start_at, $edge1 );
        $flight_segment2 = FlyingSegment::makeFrom( $flight_segment1->endsAt()->format( 'Y-m-d' ), $edge2 );

        $segment = LayoverSegment::makeFrom( $flight_segment1, $flight_segment2 );

        $this->assertInstanceOf( LayoverSegment::class, $segment );
        $this->assertEquals( 4 * 60, $segment->duration() );
        $this->assertEquals( 0, $segment->price() );
        $this->assertEquals( '10:00', $segment->startsAt()->format( 'H:i' ) );
        $this->assertEquals( '14:00', $segment->endsAt()->format( 'H:i' ) );
    }
}
