<?php

use App\Airline;
use App\Airport;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FlightRouteSeeder extends Seeder {

    const BATCH_SIZE = 1000;

    private $batch_entries = [];

    private $airlines = [];
    private $airports = [];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $this->warmUpCache();
        $this->processImport();
    }

    protected function warmUpCache() {
        $airlines = Airline::all();

        foreach ( $airlines as $airline ) {
            $this->airlines[ $airline->iata_code ] = $airline->id;
        }

        unset( $airlines, $airline );

        $airports = Airport::all();

        foreach ( $airports as $airport ) {
            $this->airports[ $airport->iata_code ] = $airport->id;
        }
    }

    /**
     * Processes importing entries from CSV
     */
    protected function processImport() {
        $routes_csv = resource_path( 'flight-datasets/routes.csv' );
        $handle     = fopen( $routes_csv, 'r' );

        while ( ( $data = fgetcsv( $handle, 0, ',' ) ) !== FALSE ) {
            $entry = $this->csvLine( $data );

            if ( $this->isValidEntry( $entry ) ) {
                $this->batchEntry( $entry );
            }

            $this->maybeBatchInsert();
        }

        $this->maybeBatchInsert( 1 );

        fclose( $handle );
    }

    /**
     * Re-maps single csv entry
     *
     * @param $data
     *
     * @return array
     */
    protected function csvLine( $data ) {
        return [
            'airline_iata_code' => $data[ 0 ],
            'from_iata_code'    => $data[ 2 ],
            'to_iata_code'      => $data[ 4 ],
            'is_not_codeshare'  => ( 'Y' !== $data[ 6 ] ),
            'is_direct_flight'  => ( 0 == $data[ 7 ] ),
        ];
    }

    /**
     * Checks if all entry fields are set
     *
     * @param $entry
     *
     * @return bool
     */
    protected function isValidEntry( $entry ) {
        return
            count( $entry ) === count( array_filter( $entry, function ( $val ) {
                // \N marks a missing field in the CSV
                return ! ! $val && ( '\N' !== $val ) && ( '-' !== $val );
            } ) )
            && strlen( $entry[ 'airline_iata_code' ] ) === 2
            && strlen( $entry[ 'from_iata_code' ] ) === 3
            && strlen( $entry[ 'to_iata_code' ] ) === 3;
    }

    /**
     * Add entry to a batch queue
     *
     * @param $entry
     */
    protected function batchEntry( $entry ) {
        $airline_id      = $this->airlines[ $entry[ 'airline_iata_code' ] ] ?? NULL;
        $from_airport_id = $this->airports[ $entry[ 'from_iata_code' ] ] ?? NULL;
        $to_airport_id   = $this->airports[ $entry[ 'to_iata_code' ] ] ?? NULL;

        if ( empty( $airline_id ) || empty( $from_airport_id ) || empty( $to_airport_id ) ) {
            return;
        }

        // trying to batch inserts, hence the unprepared statements
        $this->batch_entries[] = sprintf( "
            INSERT IGNORE INTO flight_routes (airline_id, from_airport_id, to_airport_id) VALUES (%d, %d, %d)",
            $airline_id, $from_airport_id, $to_airport_id
        );
    }

    /**
     * Process the batch queue if min threshold is met
     * Threshold represents minimum number of entries needed to process batch queue
     *
     * @param int $batch_threshold
     */
    protected function maybeBatchInsert( $batch_threshold = self::BATCH_SIZE ) {
        if ( count( $this->batch_entries ) >= $batch_threshold ) {
            DB::beginTransaction();
            DB::unprepared( implode( '; ', $this->batch_entries ) );
            DB::commit();
            $this->batch_entries = [];
        }
    }

}
