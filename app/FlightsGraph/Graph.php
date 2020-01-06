<?php

namespace App\FlightsGraph;

/**
 * Class Graph
 * @package App\FlightsGraph
 */
class Graph {

    /** @var Node[] */
    protected $nodes = [];

    /**
     * Add a new node
     *
     * @param Node $node
     *
     * @return Node|null
     */
    public function addNode( Node $node ) {
        if ( ! isset( $this->nodes[ $node->getId() ] ) ) {
            $this->nodes[ $node->getId() ] = $node;
        }

        return $this->getNodeById( $node->getId() );
    }

    /**
     * Fetch node from graph by ID
     *
     * @param $node_id
     *
     * @return Node|null
     */
    public function getNodeById( $node_id ) {
        return $this->nodes[ $node_id ] ?? NULL;
    }

}
