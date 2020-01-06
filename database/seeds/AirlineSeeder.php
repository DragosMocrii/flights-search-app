<?php

use App\Airline;
use Illuminate\Database\Seeder;

class AirlineSeeder extends Seeder {

    const BATCH_SIZE = 1000;

    private $batch_entries = [];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $airlines_csv = resource_path( 'flight-datasets/airlines.csv' );
        $handle       = fopen( $airlines_csv, 'r' );

        while ( ( $data = fgetcsv( $handle, 0, ',' ) ) !== FALSE ) {
            $entry = $this->csvLine( $data );

            if ( $this->isValidEntry( $entry ) ) {
                unset( $entry[ 'is_active' ] );
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
            'name'      => $data[ 1 ],
            'iata_code' => $data[ 3 ],
            'is_active' => $data[ 7 ],
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
            && 'Y' === $entry[ 'is_active' ]
            && ! preg_match( '/^[0-9]+$/Uis', $entry[ 'iata_code' ] ); //not all numeric
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
            // on duplicate keys, just ignore duplicates
            Airline::insertOrIgnore( $this->batch_entries );
            $this->batch_entries = [];
        }
    }
}
