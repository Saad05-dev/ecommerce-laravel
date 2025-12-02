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
}
