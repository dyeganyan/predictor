<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WalletController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/wallet/balance",
     *     summary="Get User Balance",
     *     tags={"Wallet"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Current Balance",
     *         @OA\JsonContent(
     *             @OA\Property(property="balance", type="number", format="float")
     *         )
     *     )
     * )
     */
    public function getBalance(Request $request)
    {
        return response()->json([
            'balance' => (float) $request->user()->balance
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/wallet/deposit",
     *     summary="Add Funds",
     *     tags={"Wallet"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"amount"},
     *             @OA\Property(property="amount", type="number", format="float", example=10.00),
     *             @OA\Property(property="payment_method_id", type="string", description="Stripe Payment Method ID")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Funds added",
     *         @OA\JsonContent(
     *             @OA\Property(property="balance", type="number", format="float"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function deposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            // payment_method_id is required if we have a stripe secret, but optional for mock
        ]);

        $user = $request->user();
        $amount = $request->amount;
        $stripeSecret = config('services.stripe.secret');

        try {
            if ($stripeSecret && $request->payment_method_id) {
                \Stripe\Stripe::setApiKey($stripeSecret);

                // Create and confirm PaymentIntent immediately (simplified flow)
                $paymentIntent = \Stripe\PaymentIntent::create([
                    'amount' => (int)($amount * 100),
                    'currency' => 'usd',
                    'payment_method' => $request->payment_method_id,
                    'confirm' => true,
                    'description' => "Wallet Deposit for User #{$user->id}",
                    'automatic_payment_methods' => [
                        'enabled' => true,
                        'allow_redirects' => 'never'
                    ],
                ]);

                if ($paymentIntent->status !== 'succeeded') {
                    return response()->json(['error' => 'Payment failed or requires action.'], 400);
                }
            } else {
                // Mock Mode: If no Stripe key is configured, just add funds
                // This allows the app to work in dev environments without keys
                Log::info("Mocking deposit of $amount for user {$user->id}");
            }

            // Update Balance
            $user->balance += $amount;
            $user->save();

            return response()->json([
                'message' => 'Funds deposited successfully',
                'balance' => (float) $user->balance
            ]);

        } catch (\Exception $e) {
            Log::error("Payment Error: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
