<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminOrderController extends Controller
{
    /**
     * Display a listing of all orders
     * 
     * Returns all orders with customer and status information
     * Used in the admin dashboard order management section
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Order::with('user');

        // Filter by order status if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('order_status', $request->status);
        }

        // Filter by payment status if provided
        if ($request->has('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        // Search by order number or customer name
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->user->name,
                    'customer_email' => $order->user->email,
                    'total_amount' => $order->total_amount,
                    'order_status' => $order->order_status,
                    'payment_status' => $order->payment_status,
                    'payment_method' => $order->payment_method,
                    'created_at' => $order->created_at->format('M d, Y h:i A'),
                ];
            });

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'payment_status', 'search'])
        ]);
    }

    /**
     * Display the specified order
     * 
     * Uses route model binding
     * Shows full order details including items, addresses, and timeline
     * 
     * @param  \App\Models\Order  $order
     * @return \Inertia\Response
     */
    public function show(Order $order)
    {
        $order->load([
            'user',
            'items.product.images',
            'shippingAddress',
            'billingAddress'
        ]);

        // Add primary image to each product
        $order->items->each(function($item) {
            if ($item->product) {
                $item->product->primary_image = $item->product->images->where('is_primary', true)->first() 
                    ?? $item->product->images->first();
            }
        });

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'order_status' => $order->order_status,
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
                'subtotal' => $order->subtotal,
                'tax_amount' => $order->tax_amount,
                'shipping_amount' => $order->shipping_amount,
                'total_amount' => $order->total_amount,
                'currency_code' => $order->currency_code,
                'notes' => $order->notes,
                'shipped_date' => $order->shipped_date?->format('M d, Y h:i A'),
                'delivered_date' => $order->delivered_date?->format('M d, Y h:i A'),
                'created_at' => $order->created_at->format('M d, Y h:i A'),
                'updated_at' => $order->updated_at->format('M d, Y h:i A'),
                'customer' => [
                    'id' => $order->user->id,
                    'name' => $order->user->name,
                    'email' => $order->user->email,
                ],
                'items' => $order->items,
                'shipping_address' => $order->shippingAddress,
                'billing_address' => $order->billingAddress,
            ]
        ]);
    }

    /**
     * Update the order status
     * 
     * Uses route model binding
     * Handles status transitions and timestamps
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'order_status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'nullable|in:pending,paid,failed,refunded',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $updates = [];

            // Update order status
            if (isset($validated['order_status'])) {
                $updates['order_status'] = $validated['order_status'];

                // Set timestamps based on status
                if ($validated['order_status'] === 'shipped' && !$order->shipped_date) {
                    $updates['shipped_date'] = now();
                }
                
                if ($validated['order_status'] === 'delivered' && !$order->delivered_date) {
                    $updates['delivered_date'] = now();
                    
                    // Auto-mark as paid when delivered if not already
                    if ($order->payment_status !== 'paid') {
                        $updates['payment_status'] = 'paid';
                    }
                }

                // If order is cancelled, restore stock
                if ($validated['order_status'] === 'cancelled' && $order->order_status !== 'cancelled') {
                    foreach ($order->items as $item) {
                        $item->product->increment('stock_quantity', $item->quantity);
                    }
                }
            }

            // Update payment status if provided
            if (isset($validated['payment_status'])) {
                $updates['payment_status'] = $validated['payment_status'];
            }

            // Update notes if provided
            if (isset($validated['notes'])) {
                $updates['notes'] = $validated['notes'];
            }

            // Perform the update
            $order->update($updates);

            DB::commit();

            return redirect()->back()->with('success', 'Order status updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Order status update failed: ' . $e->getMessage());
            
            return redirect()->back()->withErrors(['error' => 'Failed to update order status']);
        }
    }

    /**
     * Get order statistics for dashboard
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics()
    {
        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('order_status', 'pending')->count(),
            'processing_orders' => Order::where('order_status', 'processing')->count(),
            'shipped_orders' => Order::where('order_status', 'shipped')->count(),
            'delivered_orders' => Order::where('order_status', 'delivered')->count(),
            'cancelled_orders' => Order::where('order_status', 'cancelled')->count(),
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total_amount'),
            'pending_revenue' => Order::where('payment_status', 'pending')->sum('total_amount'),
        ];

        return response()->json($stats);
    }
}