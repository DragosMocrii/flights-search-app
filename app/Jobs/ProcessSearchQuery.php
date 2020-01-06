<?php

namespace App\Jobs;

use App\FlightRoute;
use App\FlightsGraph\Airport;
use App\FlightsGraph\FlightPath;
use App\FlightsGraph\FlightPathRestrictor;
use App\FlightsGraph\FlightsGraph;
use App\FlightsGraph\SearchRegular;
use App\SearchQuery;
use App\SearchResult;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class ProcessSearchQuery implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var FlightsGraph */
    private $flights_graph;
    /** @var SearchQuery */
    private $search_query;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct( SearchQuery $search_query ) {
        $this->search_query = $search_query->withoutRelations();
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle() {
        $this->loadGraphData();

        $flight_path_restrictor = FlightPathRestrictor::makeFrom( $this->search_query->restrictions )
                                                      ->ensureReasonableConnection( 90 )
                                                      ->ensureNoLongLayover( 360 );

        $search = SearchRegular::graph( $this->flights_graph )
                               ->fromAirportId( $this->search_query->fromAirportId() )
                               ->toAirportId( $this->search_query->toAirportId() )
                               ->startDate( $this->search_query->flightDate() )
                               ->addRestrictor( $flight_path_restrictor );

        $count_results = 0;
        /** @var FlightPath $path */
        foreach ( $search->find() as $path ) {
            $search_result                 = new SearchResult();
            $search_result->total_duration = $path->getTotalDuration();
            $search_result->total_layovers = $path->getLayoversCount();
            $search_result->total_price    = $path->getTotalPrice();
            $search_result->routes         = $path->getRoutes();
            $search_result->flight_date    = $path->getFlightDate();
            $search_result->departs_at     = $path->getFlightTime();
            $search_result->search_query()->associate( $this->search_query );
            $search_result->save();

            if ( ++ $count_results > 25 ) {
                //25 results are good enough :)
                break;
            }
        }

        //finally set search query as processed
        $this->search_query->markProcessed();
    }

    /**
     * Loads the graph in memory
     */
    protected function loadGraphData() {
        $flights_graph = new FlightsGraph();

        $airports = DB::table( 'airports' )->get();

        foreach ( $airports as $airport ) {
            $flights_graph->addAirport( new Airport( $airport->id ) );
        }

        unset( $airports, $airport );

        $flight_routes = FlightRoute::all();

        foreach ( $flight_routes as $flight_route ) {
            $airport_from = $flights_graph->getAirportById( $flight_route->from_airport_id );
            $airport_to   = $flights_graph->getAirportById( $flight_route->to_airport_id );
            $airport_from->addRouteTo( $airport_to, $flight_route );
        }

        unset( $flight_routes, $flight_route, $airport_from, $airport_to );

        $this->flights_graph = $flights_graph;
    }
}
