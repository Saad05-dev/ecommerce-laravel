<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\CartItem;
use App\Models\CustomerAddress;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Mail\OrderReceipt;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        $orders = Order::with('items.product')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Show the checkout page
     * 
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function checkout()
    {
        $cartItems = CartItem::with('product')
            ->where('user_id', Auth::id())
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty!');
        }

        // Validate all products are still active and in stock
        foreach ($cartItems as $item) {
            if (!$item->product->is_active) {
                return redirect()->route('cart.index')
                    ->withErrors(['cart' => "Product '{$item->product->name}' is no longer available."]);
            }
            
            if ($item->product->stock_quantity < $item->quantity) {
                return redirect()->route('cart.index')
                    ->withErrors(['cart' => "Not enough stock for '{$item->product->name}'."]);
            }
        }

        $subtotal = $cartItems->sum(function($item) {
            return $item->quantity * $item->product->price;
        });

        $tax = $subtotal * 0.1; // 10% tax
        $shipping = 10.00; // Fixed shipping
        $total = $subtotal + $tax + $shipping;

        $addresses = CustomerAddress::where('user_id', Auth::id())->get();

        return Inertia::render('Orders/Checkout', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => $total,
            'addresses' => $addresses,
        ]);
    }

    /**
     * Place an order
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address_id' => 'required|exists:customer_addresses,id',
            'billing_address_id' => 'required|exists:customer_addresses,id',
            'payment_method' => 'required|string',
        ]);

        $cartItems = CartItem::with('product')
            ->where('user_id', Auth::id())
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty!');
        }

        DB::beginTransaction();
        try {
            // Final stock check before creating order
            foreach ($cartItems as $item) {
                if ($item->product->stock_quantity < $item->quantity) {
                    DB::rollBack();
                    return back()->withErrors(['stock' => "Insufficient stock for {$item->product->name}"]);
                }
            }

            $subtotal = $cartItems->sum(function($item) {
                return $item->quantity * $item->product->price;
            });

            $tax = $subtotal * 0.1;
            $shipping = 10.00;
            $total = $subtotal + $tax + $shipping;

            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'order_status' => 'pending',
                'payment_status' => 'pending',
                'subtotal' => $subtotal,
                'tax_amount' => $tax,
                'shipping_amount' => $shipping,
                'total_amount' => $total,
                'currency_code' => 'USD',
                'payment_method' => $request->payment_method,
                'shipping_address_id' => $request->shipping_address_id,
                'billing_address_id' => $request->billing_address_id,
            ]);

            foreach ($cartItems as $cartItem) {
                $order->items()->create([
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->product->price,
                    'total_price' => $cartItem->quantity * $cartItem->product->price,
                ]);

                // Update product stock
                $cartItem->product->decrement('stock_quantity', $cartItem->quantity);
            }

            // Clear cart
            CartItem::where('user_id', Auth::id())->delete();

            DB::commit();

            // Attempt to send order receipt email immediately; fall back to queue on failure
            $recipient = $order->user?->email ?? null;
            $mailSent = false;
            if ($recipient) {
                try {
                    // Try synchronous send so customer gets immediate feedback
                    Mail::to($recipient)->send(new OrderReceipt($order));
                    Log::info("Sent OrderReceipt synchronously for order {$order->id} -> {$recipient}");
                    $mailSent = true;
                } catch (\Exception $e) {
                    Log::warning("Synchronous send failed for order {$order->id}: " . $e->getMessage() . ". Attempting to queue.");
                    try {
                        Mail::to($recipient)->queue(new OrderReceipt($order));
                        Log::info("Queued OrderReceipt for order {$order->id} -> {$recipient} after sync failure");
                        $mailSent = true;
                    } catch (\Exception $e2) {
                        Log::error("Failed to queue order receipt for order {$order->id}: " . $e2->getMessage());
                        $mailSent = false;
                    }
                }
            }

            $flashMessage = 'Order placed successfully!';
            if ($recipient) {
                $flashMessage .= $mailSent ? ' A receipt was sent to your email.' : ' We could not send a receipt right now; it will be retried automatically.';
            }

            return redirect()->route('orders.show', $order)->with('success', $flashMessage);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to place order. Please try again.']);
        }
    }

    /**
     * Display the specified order
     * 
     * Uses route model binding
     * 
     * @param  \App\Models\Order  $order
     * @return \Inertia\Response
     */
    public function show(Order $order)
    {
        // Ensure user can only view their own orders
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $order->load('items.product', 'shippingAddress', 'billingAddress');

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

}