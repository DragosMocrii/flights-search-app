<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\GenerateUserToken;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller {

    use GenerateUserToken;

    public function store( Request $request ) {

        $data      = $request->all();
        $validator = Validator::make( $data, [
            'email'    => [ 'required', 'string', 'email', 'max:255', 'unique:users' ],
            'password' => [ 'required', 'string', 'min:6' ],
        ] );

        if ( $validator->fails() ) {
            return response()->json( [ 'errors' => $validator->errors()->all() ], 422 );
        }

        $user = User::create( [
            'email'    => $data[ 'email' ],
            'password' => Hash::make( $data[ 'password' ] ),
        ] );

        $token = $this->assign_user_token( $user );

        return response()->json( [ 'token' => $token ], 200 );

    }

}
