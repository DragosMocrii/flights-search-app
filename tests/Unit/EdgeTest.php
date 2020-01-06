<?php

namespace Tests\Unit;

use App\FlightsGraph\Node;
use PHPUnit\Framework\TestCase;
use App\FlightsGraph\Edge;

class EdgeTest extends TestCase {
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testEdgeCreate() {
        $node1 = new Node( 123 );
        $node2 = new Node( 321 );

        $edge = new Edge( $node1, $node2, [ 'duration' => 630, 'price' => 253.53 ] );

        $this->assertEquals( $node1, $edge->getNodeFrom() );
        $this->assertEquals( $node2, $edge->getNodeTo() );
        $this->assertEquals( 630, $edge->getAttr( 'duration' ) );
    }
}
