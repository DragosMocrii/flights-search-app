<?php

namespace Tests\Feature;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AuthControllerTest extends TestCase {

    //use RefreshDatabase;

    /**
     * Test authentication validations
     *
     * @return void
     */
    public function testAuthValidations() {
        //missing credentials
        $response = $this->postJson( '/api/users', [] );
        $response->assertStatus( 422 );
        $response->assertJsonCount( 2, 'errors' );
    }

    /**
     * Test when authentication passes
     */
    public function testAuthSuccessful() {
        $credentials = [ 'email' => 'good@email.com', 'password' => 'goodpass' ];
        $response    = $this->postJson( '/api/users', $credentials );
        $response->assertStatus( 200 );
        $response = $this->getJson( '/api/auth?' . http_build_query( $credentials ) );
        $response->assertStatus( 200 );
        $response->assertJsonStructure( [ 'token' ] );
        User::where( 'email', '=', 'good@email.com' )->delete();
    }

    /**
     * Test when can't authenticate user
     */
    public function testAuthUnsuccessful() {
        $credentials = [ 'email' => 'bad@email.com', 'password' => 'badpass' ];
        $response    = $this->getJson( '/api/auth?' . http_build_query( $credentials ) );
        $response->assertStatus( 401 );
    }
}
