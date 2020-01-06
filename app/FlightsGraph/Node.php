<?php

namespace App\FlightsGraph;

class Node {

    /**
     * @var int
     */
    private $id;
    /**
     * @var Edge[]
     */
    private $edges = [];

    public function __construct( $id ) {
        $this->id = $id;
    }

    public function getId() {
        return $this->id;
    }

    /**
     * @param Node $node
     * @param array $edge_attrs
     *
     * @return Edge
     */
    public function addEdgeTo( $node, $edge_attrs = [] ) {
        return new Edge( $this, $node, $edge_attrs );
    }

    /**
     * @param Edge $edge
     */
    public function addEdge( $edge ) {
        $this->edges[] = $edge;
    }

    /**
     * @return \Generator|Edge[]
     */
    public function getEdgesOut() {
        foreach ( $this->edges as $edge ) {
            if ( $edge->getNodeFrom() === $this ) {
                yield( $edge );
            }
        }
    }

    /**
     * @return \Generator|Edge[]
     */
    public function getEdgesIn() {
        foreach ( $this->edges as $edge ) {
            if ( $edge->getNodeTo() === $this ) {
                yield( $edge );
            }
        }
    }

}
