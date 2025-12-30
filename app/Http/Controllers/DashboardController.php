<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Calculate total revenue from completed orders
        $totalRevenue = Order::whereIn('order_status', ['delivered', 'shipped', 'processing'])
            ->sum('total_amount');

        // Count total orders
        $totalOrders = Order::count();

        // Count total customers (users who placed orders)
        $totalCustomers = User::whereHas('orders')->count();

        // Count total products sold from order_items
        $totalProductsSold = \DB::table('order_items')->sum('quantity');

        // Weekly sales data (last 7 days) - SQLite version
        $weeklyData = Order::whereIn('order_status', ['delivered', 'shipped', 'processing'])
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->selectRaw("strftime('%w', created_at) as day_num, 
                        CASE strftime('%w', created_at)
                            WHEN '0' THEN 'Sun'
                            WHEN '1' THEN 'Mon'
                            WHEN '2' THEN 'Tue'
                            WHEN '3' THEN 'Wed'
                            WHEN '4' THEN 'Thu'
                            WHEN '5' THEN 'Fri'
                            WHEN '6' THEN 'Sat'
                        END as name,
                        SUM(total_amount) as sales, 
                        COUNT(*) as orders")
            ->groupBy('day_num')
            ->orderBy('day_num')
            ->get();

        // Monthly revenue (last 6 months) - SQLite version
        $monthlyData = Order::whereIn('order_status', ['delivered', 'shipped', 'processing'])
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->selectRaw("strftime('%m', created_at) as month_num,
                        CASE strftime('%m', created_at)
                            WHEN '01' THEN 'Jan'
                            WHEN '02' THEN 'Feb'
                            WHEN '03' THEN 'Mar'
                            WHEN '04' THEN 'Apr'
                            WHEN '05' THEN 'May'
                            WHEN '06' THEN 'Jun'
                            WHEN '07' THEN 'Jul'
                            WHEN '08' THEN 'Aug'
                            WHEN '09' THEN 'Sep'
                            WHEN '10' THEN 'Oct'
                            WHEN '11' THEN 'Nov'
                            WHEN '12' THEN 'Dec'
                        END as month,
                        SUM(total_amount) as revenue")
            ->groupBy('month_num')
            ->orderBy('month_num')
            ->get();

        // Top selling products
        // Top selling products
        $topProducts = \DB::table('order_items')
        ->join('products', 'order_items.product_id', '=', 'products.id')
        ->select(
            'products.name',
            \DB::raw('SUM(order_items.quantity) as sales'),
            \DB::raw('"$" || CAST(SUM(order_items.total_price) AS INTEGER) as revenue')
        )
        ->groupBy('products.id', 'products.name')
        ->orderByDesc('sales')
        ->limit(5)
        ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'revenue' => '$' . number_format($totalRevenue, 0),
                'orders' => $totalOrders,
                'customers' => number_format($totalCustomers),
                'productsSold' => number_format($totalProductsSold),
            ],
            'salesData' => $weeklyData,
            'monthlyData' => $monthlyData,
            'topProducts' => $topProducts,
        ]);
    }
}