<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $baseName = fake()->words(3, true);   // e.g. "Incredible Steel Chair"
        $name = ucfirst($baseName) . ' ' . fake()->unique()->numberBetween(1, 1000);
        $price = fake()->randomFloat(2, 10, 500);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'sku' => 'SKU-' . fake()->unique()->bothify('#####-?????'),
            'description' => fake()->paragraph(),
            'price' => $price,
            'compare_price' => fake()->boolean(30) ? $price * 1.2 : null,
            'stock_quantity' => fake()->numberBetween(0, 100),
            'is_active' => true,
            // category_id will be assigned in the seeder
        ];
    }
}
