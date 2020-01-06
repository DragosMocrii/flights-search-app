<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run() {
        $this->call( UsersTableSeeder::class );
        $this->call( AirportSeeder::class );
        $this->call( AirlineSeeder::class );
        $this->call( FlightRouteSeeder::class );
        $this->call( FlightRoutesAdjustmentsSeeder::class );
    }
}
