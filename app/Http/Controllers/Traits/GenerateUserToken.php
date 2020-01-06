<?php

namespace App\Http\Controllers\Traits;

use App\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Str;

trait GenerateUserToken {

    /**
     * Generates and assigns an access token to a user
     *
     * @param User|Authenticatable $user
     *
     * @return string
     */
    protected function assign_user_token( $user ) {
        $token = Str::random( 80 );

        // to avoid api_token collision with existing values, we should assign the token separately
        // to be able to catch DB constraint errors, and loop until a unique value is found
        // however, given the entropy is large enough, and for the sake of keeping things simple, this was not implemented

        $user->forceFill( [
            'api_token' => hash( 'sha256', $token ),
        ] )->save();

        return $token;
    }

}
