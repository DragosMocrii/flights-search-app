<?php

use App\Airport;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AirportSeeder extends Seeder {

    const BATCH_SIZE = 1000;

    private $batch_entries = [];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $airports_csv = resource_path( 'flight-datasets/airports.csv' );
        $handle       = fopen( $airports_csv, 'r' );

        while ( ( $data = fgetcsv( $handle, 0, ',' ) ) !== FALSE ) {
            $entry = $this->csvLine( $data );

            if ( $this->isValidEntry( $entry ) ) {
                unset( $entry[ 'is_airport' ] );
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
            'name'       => $data[ 1 ],
            'city'       => $data[ 2 ],
            'country'    => $data[ 3 ],
            'iata_code'  => $data[ 4 ],
            'lat'        => $data[ 6 ],
            'lon'        => $data[ 7 ],
            'timezone'   => $data[ 11 ],
            'is_airport' => ( 'airport' === $data[ 12 ] ),
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
                return ! ! $val && ( '\N' !== $val );
            } ) )
            && in_array( $entry[ 'timezone' ], timezone_identifiers_list() );
    }

    /**
     * Add entry to a batch queue
     *
     * @param $entry
     */
    protected function batchEntry( $entry ) {
        $this->batch_entries[] = $entry;
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
            Airport::insert( $this->batch_entries );
            DB::commit();
            $this->batch_entries = [];
        }
    }
}
