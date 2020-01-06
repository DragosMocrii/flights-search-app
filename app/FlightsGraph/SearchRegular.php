<?php

namespace App\FlightsGraph;

use SplQueue;

class SearchRegular {

    /** @var Graph */
    private $graph;
    /** @var Node */
    private $node_from;
    /** @var Node */
    private $node_to;
    /** @var string Y-m-d */
    private $start_date;
    /** @var FlightPathRestrictor */
    private $restrictor;

    public function __construct( Graph $graph ) {
        $this->graph = $graph;
    }

    /**
     * Creates search instance from graph
     *
     * @param Graph $graph
     *
     * @return static
     */
    public static function graph( Graph $graph ) {
        return new static( $graph );
    }

    /**
     * Set start node
     *
     * @param $node_id
     *
     * @return SearchRegular
     */
    public function fromAirportId( $node_id ) {
        $this->node_from = $this->graph->getNodeById( $node_id );

        return $this;
    }

    /**
     * Set end node
     *
     * @param $node_id
     *
     * @return SearchRegular
     */
    public function toAirportId( $node_id ) {
        $this->node_to = $this->graph->getNodeById( $node_id );

        return $this;
    }

    /**
     * Set start date
     *
     * @param string $start_date
     *
     * @return SearchRegular
     */
    public function startDate( $start_date ) {
        //Y-m-d format
        $this->start_date = $start_date;

        return $this;
    }

    /**
     * Add flight restriction class, basically a flight path filter
     *
     * @param FlightPathRestrictor $flight_path_restrictor
     *
     * @return SearchRegular
     */
    public function addRestrictor( FlightPathRestrictor $flight_path_restrictor ) {
        $this->restrictor = $flight_path_restrictor;

        return $this;
    }

    /**
     * Perform search
     *
     * @return \Generator|FlightPath
     */
    public function find() {
        yield from $this->findBreadthPaths( $this->node_from, $this->node_to, $this->start_date );
        //yield from $this->findDeepPaths( $this->node_from, $this->node_to, $this->start_date );
    }

    /**
     * Finds flight paths
     * Breadth search works better for flight searching, since it will find the shortest paths first,
     * unlike Depth First Search, which will recurse into deep paths first (most likely)
     *
     * @param Node $node_from
     * @param Node $node_to
     * @param string $flight_date
     *
     * @return \Generator
     */
    public function findBreadthPaths( Node $node_from, Node $node_to, $flight_date ) {
        $path_search = new FlightPath( $node_from, $node_to, $flight_date );
        $queue       = new SplQueue();
        $queue->enqueue( $path_search );

        while ( ! $queue->isEmpty() ) {
            /** @var FlightPath $path */
            $path = $queue->dequeue();

            if ( $path->isPathComplete() ) {
                yield $path;
            } else {
                foreach ( $path->currentNode()->getEdgesOut() as $edge ) {
                    if ( ! $path->isVisited( $edge->getNodeTo() ) ) {
                        $new_path = $path->diverge();
                        $new_path->addEdge( $edge );

                        if ( $this->pathPassesRestrictions( $new_path ) ) {
                            $queue->enqueue( $new_path );
                        } else {
                            unset( $new_path );
                        }
                    }
                }
            }
        }
    }

    /**
     * Depth first search algorithm
     *
     * @param Node $node_from
     * @param Node $node_to
     * @param string $flight_date
     *
     * @return \Generator
     */
    public function findDeepPaths( Node $node_from, Node $node_to, $flight_date ) {
        $path_search    = new FlightPath( $node_from, $node_to, $flight_date );
        $path_generator = $this->findDeepRecursive( $path_search );

        /** @var FlightPath $path */
        foreach ( $path_generator as $path ) {
            yield $path;
        }
    }

    /**
     * @param Path $path
     *
     * @return \Generator
     */
    protected function findDeepRecursive( Path $path ) {
        if ( ! $this->pathPassesRestrictions( $path ) ) {
            return;
        }

        if ( $path->isPathComplete() ) {
            yield $path;
        } else {
            foreach ( $path->currentNode()->getEdgesOut() as $edge ) {
                if ( ! $path->isVisited( $edge->getNodeTo() ) ) {
                    $new_path = $path->diverge();
                    $new_path->addEdge( $edge );
                    yield from $this->findDeepRecursive( $new_path );
                }
            }
        }
    }

    /**
     * Checks if current path passes constraints
     *
     * @param Path $path
     *
     * @return bool
     */
    protected function pathPassesRestrictions( FlightPath $path ) {
        //if no restrictor was registered, just return true
        if ( ! isset( $this->restrictor ) ) {
            return TRUE;
        }

        return $this->restrictor->passesRestrictions( $path );
    }

}
