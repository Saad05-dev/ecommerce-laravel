<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('items.product')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Orders/Index',[
            'orders' => $orders,
        ]);
    }
    public function show(Order $order)
    {
        abort_unless($order->user_id === Auth::id(), 403);

        $order->load([
            'items.product',
            'shippingAddress',
            'billingAddress',
        ]);

        return Inertia::render('Orders/Show',[
            'order' => $order,
        ]);
    }

    public function buy(Product $product, Request $request)
    {
        $data = $request->validate([
            'quantity' => ['nullable','integer','min:1'],
        ]);

        $quantity = $data['quantity'] ?? 1;
        $subtotal = $product->price * $quantity;
        $tax = $subtotal * 0.1;
        $shipping = 0;

        $order = Order::create([
            'user_id'          => Auth::id(),
            'order_number'     => 'ORD-' . now()->timestamp . '-' . rand(1000, 9999),
            'order_status'     => 'pending',
            'payment_status'   => 'pending',
            'subtotal'         => $subtotal,
            'tax_amount'       => $tax,
            'shipping_amount'  => $shipping,
            'total_amount'     => $subtotal + $tax + $shipping,
            'currency_code'    => 'USD',
            'payment_method'   => 'cash_on_delivery',
            'shipping_address_id' => null,
            'billing_address_id'  => null,
        ]);
        OrderItem::create([
            'order_id'    => $order->id,
            'product_id'  => $product->id,
            'quantity'    => $quantity,
            'unit_price'  => $product->price,
            'total_price' => $product->price * $quantity,
        ]);
        return redirect()->route('orders.show', $order->order_number)
                         ->with('success','Order placed successfully!');
    }
}
