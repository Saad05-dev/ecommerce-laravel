<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;

class ProductsController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->active()->orderBy('name')->get();
        return Inertia::render('Products/Index',[
            'products' => $products
        ]);
    }

    public function show(Product $product)
    {
        $product->load([
            'category',
            'images',
            'reviews.user'
        ]);

        $product->average_rating = $product->averageRating;
        $product->in_stock = $product->stock_quantity > 0;
        $product->reviews_count = $product->reviews->count();

        $relatedProducts = Product::with('primaryImage')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->active()
            ->limit(4)
            ->get();

        return Inertia::render('Products/Show',[
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
