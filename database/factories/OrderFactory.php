<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 50, 1000);
        $tax      = $subtotal * 0.1; // 10% tax
        $shipping = fake()->randomFloat(2, 5, 50);

        return [
            'user_id'            => \App\Models\User::factory(),
            'order_number'       => 'ORD-' . fake()->unique()->numerify('########'),
            'order_status'       => fake()->randomElement(['pending', 'processing', 'shipped', 'delivered']),
            'payment_status'     => fake()->randomElement(['pending', 'paid', 'failed']),
            'subtotal'           => $subtotal,
            'tax_amount'         => $tax,
            'shipping_amount'    => $shipping,
            'total_amount'       => $subtotal + $tax + $shipping,
            'currency_code'      => 'USD',
            'payment_method'     => fake()->randomElement(['credit_card', 'paypal', 'cash_on_delivery']),
            'shipping_address_id'=> \App\Models\CustomerAddress::factory(),
            'billing_address_id' => \App\Models\CustomerAddress::factory(),
        ];
    }
}
