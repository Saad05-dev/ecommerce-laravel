<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard with statistics
     * 
     * This method fetches key metrics for the admin dashboard:
     * - Total number of products
     * - Total revenue from completed orders
     * - Total number of orders
     * - Products with low stock (less than 10 items)
     * - Recent orders (last 5)
     * 
     * @return \Inertia\Response
     */
    public function dashboard()
    {
        // Get total number of active products
        $totalProducts = Product::where('is_active', true)->count();
        
        // Calculate total revenue from paid/delivered orders
        $totalRevenue = Order::whereIn('payment_status', ['paid'])
            ->sum('total_amount');
        
        // Get total number of orders
        $totalOrders = Order::count();
        
        // Get products with low stock (less than 10 items)
        $lowStockCount = Product::where('stock_quantity', '<', 10)
            ->where('is_active', true)
            ->count();
        
        // Get recent orders with user information
        $recentOrders = Order::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->user->name,
                    'total_amount' => $order->total_amount,
                    'order_status' => $order->order_status,
                    'created_at' => $order->created_at->format('M d, Y'),
                ];
            });
        
        // Get low stock products for alerts
        $lowStockProducts = Product::where('stock_quantity', '<', 10)
            ->where('is_active', true)
            ->orderBy('stock_quantity', 'asc')
            ->limit(5)
            ->get()
            ->map(function($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'stock_quantity' => $product->stock_quantity,
                    'sku' => $product->sku,
                ];
            });
        
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalRevenue' => number_format($totalRevenue, 2),
                'totalOrders' => $totalOrders,
                'lowStockCount' => $lowStockCount,
            ],
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}