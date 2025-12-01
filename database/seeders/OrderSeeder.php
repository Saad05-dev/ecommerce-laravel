<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Order;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Order::factory(20)->create()->each(function ($order) {
            // Add 1-3 items to each order
            $products = Product::inRandomOrder()->take(rand(1, 3))->get();
            $quantity = rand(1, 2);

            foreach ($products as $product) {
                DB::table('order_items')->insert([
                    'order_id'    => $order->id,
                    'product_id'  => $product->id,
                    'quantity'    => $quantity,
                    'unit_price'  => $product->price,
                    'total_price' => $product->price * $quantity,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }
        });
    }
}
