<?php

namespace App\FlightsGraph;

/**
 * Made of segments/edges. Connects two nodes
 *
 * Class Path
 * @package App\FlightsGraph
 */
class Path {

    /** @var Node */
    private $from;
    /** @var Node */
    private $to;
    /** @var Edge[] */
    private $edges = [];
    /** @var Node[] */
    private $visited_nodes = [];
    /** @var Node */
    private $current_node;

    public function __construct( Node $from, Node $to ) {
        $this->from = $from;
        $this->to   = $to;
        $this->addVisited( $from );
    }

    /**
     * Adds a path segment
     *
     * @param Edge $edge
     */
    public function addEdge( Edge $edge ) {
        $this->edges[] = $edge;
        $this->addVisited( $edge->getNodeTo() );
    }

    /**
     * Returns the current node
     *
     * @return Node
     */
    public function currentNode() {
        return $this->current_node;
    }

    /**
     * Mark node as visited on path
     *
     * @param Node $node
     */
    public function addVisited( Node $node ) {
        $this->visited_nodes[ $node->getId() ] = TRUE;
        $this->current_node                    = $node;
    }

    /**
     * Check if node exists in path
     *
     * @param Node $node
     *
     * @return bool
     */
    public function isVisited( Node $node ) {
        return isset( $this->visited_nodes[ $node->getId() ] );
    }

    /**
     * Get number of segments in path. 1 segment means direct connection
     *
     * @return int
     */
    public function totalSegments() {
        return count( $this->edges );
    }

    /**
     * Checks if path is complete, that is path connects
     * start node to end node
     *
     * @return bool
     */
    public function isPathComplete() {
        if ( isset( $this->edges[ 0 ] )
             && $this->edges[ 0 ]->getNodeFrom()->getId() === $this->from->getId()
             && $this->edges[ array_key_last( $this->edges ) ]->getNodeTo()->getId() === $this->to->getId()
        ) {
            return TRUE;
        }

        return FALSE;
    }

    /**
     * Creates a clone of current path, that can be sent safely to recursive functions
     *
     * @return $this
     */
    public function diverge() {
        return clone $this;
    }

    /**
     * Returns a list of edges that make up a path in a graph
     *
     * @return Edge[]
     */
    public function getEdges() {
        return $this->edges;
    }

    /**
     * Get the last edge, if it exists, false otherwise
     *
     * @return Edge|false
     */
    public function getLastEdge() {
        if ( empty( $this->edges ) ) {
            return FALSE;
        }

        return $this->edges[ array_key_last( $this->edges ) ];
    }

}
