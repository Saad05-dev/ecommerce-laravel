<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;

class ProductsController extends Controller
{
    /**
     * Display a listing of all active products
     * 
     * @return \Inertia\Response
     */
    public function index()
    {
        $products = Product::with('category', 'images')->active()->orderBy('name')->get();
        
        // Add primary_image to each product
        $products->each(function($product) {
            $product->primary_image = $product->images->where('is_primary', true)->first() 
                ?? $product->images->first();
        });
        
        return Inertia::render('Products/Index', [
            'products' => $products
        ]);
    }

    /**
     * Display the specified product
     * 
     * Uses route model binding - Laravel automatically finds the product
     * 
     * @param  \App\Models\Product  $product
     * @return \Inertia\Response
     */
    public function show(Product $product)
    {
        // Load relationships
        $product->load('category', 'images', 'reviews.user');
        
        // Only show if product is active
        if (!$product->is_active) {
            abort(404, 'Product not found or is no longer available.');
        }
        
        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}