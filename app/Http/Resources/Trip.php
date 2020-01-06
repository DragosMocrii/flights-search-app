<?php

namespace App\Http\Resources;

use Carbon\CarbonInterval;
use Illuminate\Http\Resources\Json\JsonResource;

class Trip extends JsonResource {

    use PresentRouteSegmentsTrait;

    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     * @throws \Exception
     */
    public function toArray( $request ) {
        $flight_date = new \DateTimeImmutable( $this->depart_at );

        return [
            'trip_id'        => $this->id,
            'depart_at'      => $this->depart_at,
            'route_segments' => $this->presentRouteSegments( $this->routes, $flight_date->format( 'Y-m-d' ) ),
        ];
    }
}
