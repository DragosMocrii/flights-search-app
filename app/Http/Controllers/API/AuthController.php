<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\GenerateUserToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller {

    use GenerateUserToken;

    public function show( Request $request ) {

        $credentials = $request->only( 'email', 'password' );
        $validator   = Validator::make( $credentials, [
            'email'    => [ 'required', 'string' ],
            'password' => [ 'required', 'string' ],
        ] );

        if ( $validator->fails() ) {
            return response()->json( [ 'errors' => $validator->errors()->all() ], 422 );
        }

        if ( Auth::once( $credentials ) ) {
            $user  = Auth::user();
            $token = $this->assign_user_token( $user );

            return response()->json( [ 'token' => $token ], 200 );
        } else {
            return response()->json( [ 'errors' => [ 'Authentication failed.' ] ], 401 );
        }

    }

}
