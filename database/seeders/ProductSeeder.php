<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use App\Models\Category;


class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::whereNotNull('parent_id')->get();

        foreach ($categories as $category) {
            // Create 5 products per category
            Product::factory(5)
                ->for($category) // Assign to this category
                ->create()
                ->each(function ($product) {
                    // 1. Create Product Images (Manually using DB facade or Model)
                    DB::table('product_images')->insert([
                        [
                            'product_id' => $product->id,
                            'image_url' => 'https://placehold.co/600x400?text=' . urlencode($product->name),
                            'is_primary' => true,
                            'created_at' => now(), 
                            'updated_at' => now()
                        ],
                        [
                            'product_id' => $product->id,
                            'image_url' => 'https://placehold.co/600x400?text=Back+View',
                            'is_primary' => false,
                            'created_at' => now(), 
                            'updated_at' => now()
                        ]
                    ]);
    
                    // 2. Create Reviews (Randomly)
                    if (rand(0, 1)) {
                        DB::table('reviews')->insert([
                            'product_id' => $product->id,
                            'user_id' => \App\Models\User::inRandomOrder()->first()?->id ?? 1,
                            'rating' => rand(3, 5),
                            'review_title' => fake()->sentence(3),
                            'review_text' => 'Great product!',
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                });
        }
    }
}
