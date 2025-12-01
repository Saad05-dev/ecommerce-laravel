<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => \App\Models\Product::factory(),
            'user_id' => \App\Models\User::factory(),
            'rating' => fake()->numberBetween(1, 5),
            'review_title' => fake()->sentence(4),
            'review_text' => fake()->paragraph(),
            'is_verified_purchase' => fake()->boolean(70),
            'helpful_count' => fake()->numberBetween(0, 50),
            'is_active' => true,
        ];
    }
}
