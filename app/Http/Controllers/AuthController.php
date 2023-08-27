<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class AuthController extends Controller
{
    public function doSignUp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|unique:users',
        ]);

        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors()->messages());
        }

        $input = $request->all();
        $input['code'] = rand(1000,9999);
        $input['password'] = bcrypt($input['password']);
        $currentDateTime = Carbon::now();
        $dateTimeInOneHour = $currentDateTime->copy()->addHour();
        $input['code_expires_at'] = $dateTimeInOneHour->format('Y-m-d H:i:s');

        //create user
        $user = User::create($input);
        $this->sendVerificationEmail($input);
        unset($user->code);
        $success['token'] = $user->createToken('CodeGuru')->accessToken;
        $success['user'] = $user;

        return $this->sendResponse($success, 'Confirmation code has been sent to your email. Please verify your email.');
    }

    /**
     * Send email with the template
     * @param $user
     */
    private function sendVerificationEmail($user) {
        Mail::send('user-verification', $user, function ($message) use ($user) {
            $message->to($user['email'], $user['name'])
                ->subject('Please Verify your Account')
                ->from(env("MAIL_USERNAME"), 'Email Verification');
        });
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function doLogin(Request $request): JsonResponse
    {
        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){
            $user = Auth::user();
            $success['token'] =  $user->createToken('pinzzit')-> accessToken;
            $success['user'] =  $user;

            return $this->sendResponse($success, 'User login successfully.');
        }
        else{
            return $this->sendError('Unauthorised.', ['error'=>'Unauthorised'], 401);
        }
    }

    /**
     * logout
     * @return JsonResponse
     */
    public function logout(): JsonResponse
    {
        Auth::logout();
        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * @return JsonResponse
     */
    public function reSendVerificationEmail(): JsonResponse
    {
        if (Auth::check()) {
            $user = User::where('email', Auth::user()->email)->first();
            $user->code = rand(1000, 9999);
            $user->code_expires_at = Carbon::now()->addHour();
            $user->update();
            $this->sendVerificationEmail($user);
            return $this->sendResponse([], 'The code has been sent to your email');
        } else {
            return $this->sendError('Unauthorised.', ['error'=>'Unauthorised'], ResponseAlias::HTTP_METHOD_NOT_ALLOWED);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function verifyEmail(Request $request): JsonResponse
    {
        if (Auth::check()) {
            $user = User::where('email', Auth::user()->email)->first();
            if (!Auth::user()->email_verified_at) {
                if ($user->code_expires_at > Carbon::now()){
                    if ($user->code === $request->otp) {
                        $user->email_verified_at = date('Y-m-d H:i:s');
                        $user->code = null;
                        $user->code_expires_at = null;
                        $user->update();
                        $message = 'Your account has been verified';
                        return $this->sendResponse($user, $message );
                    } else {
                        $message = 'Wrong Code Entered.';
                    }
                } else {
                    $message = 'Time Expired for code. Please resend verification email';
                }
            } else {
                $message = 'User is already verified.';
            }
            return $this->sendError($message, [], ResponseAlias::HTTP_FORBIDDEN);
        } else {
            return $this->sendError('Unauthorised.', ['error'=>'Unauthorised'], ResponseAlias::HTTP_METHOD_NOT_ALLOWED);
        }
    }
}
