<?php

namespace Tests\Feature;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase {

    //use RefreshDatabase;

    /**
     * Test user registration validations
     *
     * @return void
     */
    public function testUserRegistrationValidations() {
        //test no user data provided
        $response = $this->postJson( '/api/users', [] );
        $response->assertStatus( 422 );

        //test missing password
        $response = $this->postJson( '/api/users', [ 'email' => 'dragosmocrii@gmail.com' ] );
        $response->assertStatus( 422 );
        $response->assertJsonCount( 2, 'errors' );

        //test missing email
        $response = $this->postJson( '/api/users', [ 'password' => 'goodpass' ] );
        $response->assertStatus( 422 );
        $response->assertJsonCount( 1, 'errors' );

        //test invalid email, invalid password
        $response = $this->postJson( '/api/users', [ 'email' => 'dragosmocrii', 'password' => 'short' ] );
        $response->assertStatus( 422 );
        $response->assertJsonCount( 2, 'errors' );

        //test existing email in database
        $dupe_credentials = [ 'email' => 'good@email.com', 'password' => 'goodpass' ];
        $response         = $this->postJson( '/api/users', $dupe_credentials );
        $response->assertStatus( 200 );
        $response = $this->postJson( '/api/users', $dupe_credentials );
        $response->assertStatus( 422 );

        User::where( 'email', '=', 'good@email.com' )->delete();
    }

    /**
     * Test successful registration flow
     */
    public function testUserRegistrationSuccessful() {
        $response = $this->postJson( '/api/users', [ 'email' => 'good@email.com', 'password' => 'goodpass' ] );
        $response->assertStatus( 200 );
        $this->assertNotEmpty( $response->json( 'token' ) );

        User::where( 'email', '=', 'good@email.com' )->delete();
    }
}
