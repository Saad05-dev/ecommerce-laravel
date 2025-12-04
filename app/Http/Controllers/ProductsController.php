<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductsController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->active()->orderBy('name')->get();
        return Inertia::render('Products/Index',[
            'products' => $products
        ]);
    }

    public function create()
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Products/Create',[
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'description'    => ['nullable', 'string'],
            'price'          => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'weight'         => ['nullable', 'numeric', 'min:0'],
            'category_id'    => ['nullable', 'exists:categories,id'],
            'is_active'      => ['nullable', 'boolean'],
        ]);

        $data['is_active'] = $data['is_active'] ?? true;
        $data['slug'] = Str::slug($data['name']) . '-' . uniqid();
        $data['sku'] = 'SKU-' . Str::upper(Str::random(8));
        
        $product = Product::create($data);

        return redirect()->route('products.show', $product->slug)->with('success','Product created.');
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

    public function edit(Product $product)
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Products/Edit',[
            'product' => $product,
            'categories' => $categories,
        ]);
    }
    public function update(Request $request,Product $product)
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'description'    => ['nullable', 'string'],
            'price'          => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'weight'         => ['nullable', 'numeric', 'min:0'],
            'category_id'    => ['nullable', 'exists:categories,id'],
            'is_active'      => ['nullable', 'boolean'],
        ]);

        $data['is_active'] = $data['is_active'] ?? true;

        if ($product->name !== $data['name']) {
            $data['slug'] = Str::slug($data['name']) . '-' . uniqid();
        }

        $product->update($data);

        return redirect()->route('products.show',$product->slug)->with('success','Product updated.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with('success','Product deleted.');
    }
}
