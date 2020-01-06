<?php

namespace App\FlightsGraph;

class FlightsGraph extends Graph {

    /** @var Airport[] */
    protected $nodes = [];

    /**
     * Adds airport to flights graph
     *
     * @param Airport $airport
     *
     * @return Node|null
     */
    public function addAirport( Airport $airport ) {
        return $this->addNode( $airport );
    }

    /**
     * Fetch airport from graph by ID
     *
     * @param $airport_id
     *
     * @return Airport|null
     */
    public function getAirportById( $airport_id ) {
        return $this->nodes[ $airport_id ] ?? NULL;
    }
}
