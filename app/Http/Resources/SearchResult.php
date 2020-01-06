<?php

namespace App\Http\Resources;

use Carbon\CarbonInterval;
use Illuminate\Http\Resources\Json\JsonResource;

class SearchResult extends JsonResource {

    use PresentRouteSegmentsTrait;

    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function toArray( $request ) {
        $data = [
            'result_id'            => $this->id,
            'flight_date'          => $this->flight_date,
            'total_duration'       => $this->total_duration,
            'total_duration_human' => CarbonInterval::minutes( $this->total_duration )->cascade()->forHumans(),
            'total_price'          => $this->total_price,
            'total_layovers'       => $this->total_layovers,
            'route_segments'       => $this->presentRouteSegments( $this->routes, $this->flight_date ),
        ];

        if ( ! empty( $data[ 'route_segments' ] ) ) {
            $data[ 'ends_at_timestamp' ] = $data[ 'route_segments' ][ array_key_last( $data[ 'route_segments' ] ) ][ 'ends_at_timestamp' ];
        }

        return $data;
    }

}
