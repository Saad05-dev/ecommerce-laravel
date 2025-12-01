<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $electronics = Category::firstOrCreate(
            ['slug' => 'electronics'],
            [
                'name'        => 'Electronics',
                'description' => 'Electronic devices and gadgets',
                'is_active'   => true,
                'parent_id'   => null,
            ]
        );

        $clothing = Category::firstOrCreate(
            ['slug' => 'clothing'],
            [
                'name'        => 'Clothing',
                'description' => 'Apparel and clothing items',
                'is_active'   => true,
                'parent_id'   => null,
            ]
        );

        // Sub Categories (these can safely create new rows each run)
        Category::factory()->count(3)->create([
            'parent_id' => $electronics->id,
        ]);

        Category::factory()->count(3)->create([
            'parent_id' => $clothing->id,
        ]);
    }
}
