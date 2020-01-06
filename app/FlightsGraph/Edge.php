<?php

namespace App\FlightsGraph;

class Edge {

    protected $from;
    protected $to;
    protected $attrs;

    public function __construct( Node $from, Node $to, $attrs = [] ) {
        $this->from  = $from;
        $this->to    = $to;
        $this->attrs = $attrs;

        $from->addEdge( $this );
        $to->addEdge( $this );
    }

    /**
     * @return Node
     */
    public function getNodeFrom() {
        return $this->from;
    }

    /**
     * @return Node
     */
    public function getNodeTo() {
        return $this->to;
    }

    /**
     * @param $name
     *
     * @return mixed|null
     */
    public function getAttr( $name ) {
        return $this->attrs[ $name ] ?? NULL;
    }

}
