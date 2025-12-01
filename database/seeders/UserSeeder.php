<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\CustomerAddress;
use App\Models\User;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'first_name' => 'Admin',
                'last_name'  => 'User',
                'name'       => 'Admin User',
                'password'   => Hash::make('password'), // Easy password for testing
                'phone'      => '1234567890',
                'is_active'  => true,
            ]
        );

        // 2. Create 10 random customers with addresses
        User::factory(10)
            ->has(CustomerAddress::factory()->count(2), 'addresses') // Relationship defined in Model
            ->create();
    }
}
