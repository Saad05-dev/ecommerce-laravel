<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CustomerAddress>
 */
class CustomerAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Each address belongs to a user (required by migration)
            'user_id' => \App\Models\User::factory(),

            'address_line1'     => fake()->streetAddress(),
            'city'              => fake()->city(),
            'state_province'    => fake()->state(),
            'postal_code'       => fake()->postcode(),
            'country'           => fake()->country(),
            'address_type'      => fake()->randomElement(['billing', 'shipping', 'both']),
            'is_default'        => fake()->boolean(20),

            // Optional fields in migration
            'address_line2'     => null,
            'recipient_name'    => fake()->name(),
            'recipient_phone'   => fake()->phoneNumber(),
        ];
    }
}
