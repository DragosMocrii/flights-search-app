<?php

namespace Tests\Unit;

use App\FlightsGraph\Edge;
use PHPUnit\Framework\TestCase;
use App\FlightsGraph\Node;

class NodeTest extends TestCase {
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testNodeCreate() {
        $node = new Node( 123 );

        $this->assertEquals( 123, $node->getId() );
    }

    public function testNodeEdges() {
        $node1 = new Node( 1 );
        $node2 = new Node( 2 );

        $node1->addEdgeTo( $node2, [ 'meta' => 13 ] );

        /** @var Edge[] $edges */
        $edges = [];

        foreach ( $node1->getEdgesIn() as $edge ) {
            $edges[] = $edge;
        }

        $this->assertCount( 0, $edges );

        $edges = [];

        foreach ( $node1->getEdgesOut() as $edge ) {
            $edges[] = $edge;
        }

        $this->assertCount( 1, $edges );
        $this->assertEquals( 13, $edges[ 0 ]->getAttr( 'meta' ) );
        $this->assertEquals( $edges[ 0 ]->getNodeFrom(), $node1 );
    }
}
