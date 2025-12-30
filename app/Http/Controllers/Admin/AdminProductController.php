<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminProductController extends Controller
{
    /**
     * Display a listing of all products for admin management
     * 
     * Returns all products with their category and primary image
     * Used in the admin dashboard products table
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Get all products with their relationships
        $products = Product::with(['category', 'images'])
            ->withCount('orderItems')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($product) {
                // Find the primary image or use the first available image
                $primaryImage = $product->images->where('is_primary', true)->first()
                    ?? $product->images->first();

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'price' => $product->price,
                    'stock_quantity' => $product->stock_quantity,
                    'category' => $product->category ? $product->category->name : 'No Category',
                    'category_id' => $product->category_id,
                    'is_active' => $product->is_active,
                    'image_url' => $primaryImage ? $primaryImage->image_url : null,
                    'description' => $product->description,
                    'compare_price' => $product->compare_price,
                    'cost' => $product->cost,
                    'weight' => $product->weight,
                    'order_items_count' => $product->order_items_count,
                    'has_orders' => $product->order_items_count > 0,
                ];
            });

        return response()->json($products);
    }

    /**
     * Store a newly created product in the database
     * 
     * Handles:
     * - Product creation with all fields
     * - Automatic slug generation from product name
     * - Image upload and storage
     * - Primary image creation
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:products,sku',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // Max 10MB
        ]);

        try {
            DB::beginTransaction();

            // Generate a unique slug from the product name
            $slug = Str::slug($validated['name']);
            $originalSlug = $slug;
            $counter = 1;

            // Ensure slug is unique by appending a number if necessary
            while (Product::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            // Create the product
            $product = Product::create([
                'name' => $validated['name'],
                'slug' => $slug,
                'sku' => $validated['sku'],
                'description' => $validated['description'] ?? null,
                'price' => $validated['price'],
                'compare_price' => $validated['compare_price'] ?? null,
                'cost' => $validated['cost'] ?? null,
                'stock_quantity' => $validated['stock_quantity'],
                'weight' => $validated['weight'] ?? null,
                'category_id' => $validated['category_id'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Handle image upload if provided
            if ($request->hasFile('image')) {
                $image = $request->file('image');

                // Generate unique filename: timestamp-random-originalname
                $filename = time() . '-' . Str::random(10) . '.' . $image->getClientOriginalExtension();

                // Store in public/storage/products directory
                $path = $image->storeAs('products', $filename, 'public');

                // Create product image record with the primary flag set to true
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => '/storage/' . $path,
                    'alt_text' => $product->name,
                    'is_primary' => true,
                    'sort_order' => 0,
                ]);
            }

            DB::commit();

            // Return the created product with its relationships
            $product->load('category', 'images');

            return response()->json([
                'message' => 'Product created successfully',
                'product' => $product
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified product in the database
     * 
     * Uses route model binding
     * 
     * Handles:
     * - Updating all product fields
     * - Regenerating slug if name changes
     * - Replacing primary image if new image is uploaded
     * - Deleting old image file from storage
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Product $product)
    {
        // Validate incoming request data
        // SKU must be unique except for the current product
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:products,sku,' . $product->id,
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'weight' => 'nullable|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        try {
            DB::beginTransaction();

            // Regenerate slug if product name has changed
            if ($product->name !== $validated['name']) {
                $slug = Str::slug($validated['name']);
                $originalSlug = $slug;
                $counter = 1;

                // Ensure new slug is unique
                while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                    $slug = $originalSlug . '-' . $counter;
                    $counter++;
                }

                $validated['slug'] = $slug;
            }

            // Remove 'image' from validated data as it's not a product table column
            // Images are stored separately in the product_images table
            unset($validated['image']);

            // Update product with validated data
            $product->update($validated);

            // Handle new image upload if provided
            if ($request->hasFile('image')) {
                // Get the current primary image
                $oldImage = $product->images()->where('is_primary', true)->first();

                // Delete old image file from storage if it exists
                if ($oldImage && $oldImage->image_url) {
                    $oldPath = str_replace('/storage/', '', $oldImage->image_url);
                    Storage::disk('public')->delete($oldPath);
                    $oldImage->delete();
                }

                // Upload and store new image
                $image = $request->file('image');
                $filename = time() . '-' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('products', $filename, 'public');

                // Create new primary image record
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => '/storage/' . $path,
                    'alt_text' => $product->name,
                    'is_primary' => true,
                    'sort_order' => 0,
                ]);
            }

            DB::commit();

            // Return updated product with relationships
            $product->load('category', 'images');

            return response()->json([
                'message' => 'Product updated successfully',
                'product' => $product
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified product from the database
     * 
     * Uses route model binding
     * 
     * Handles:
     * - Checking if product has order history
     * - Preventing deletion if product has been ordered
     * - Deleting all associated product images from storage
     * - Deleting product image records
     * - Deleting the product (cascade will handle other relationships)
     * 
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Product $product)
    {
        try {
            // DEBUG: Log detailed information
            Log::info("=== Product Deletion Attempt ===");
            Log::info("Product ID: {$product->id}");
            Log::info("Product Name: {$product->name}");
            Log::info("Product SKU: {$product->sku}");

            // Check order items count using relationship
            $orderItemsCount = $product->orderItems()->count();
            Log::info("Order Items Count (via relationship): {$orderItemsCount}");

            // Check order items count directly from DB for comparison
            $directCount = DB::table('order_items')->where('product_id', $product->id)->count();
            Log::info("Order Items Count (direct DB query): {$directCount}");

            // If counts don't match, there's a problem
            if ($orderItemsCount !== $directCount) {
                Log::warning("MISMATCH: Relationship count ({$orderItemsCount}) != DB count ({$directCount})");
            }

            // Check if product has any order items
            // Products with order history cannot be deleted due to foreign key constraints
            if ($product->orderItems()->count() > 0) {
                Log::info("Deletion BLOCKED: Product has {$product->orderItems()->count()} order items");
                Log::info("=== End Product Deletion Attempt ===\n");

                return response()->json([
                    'message' => 'Cannot delete this product because it has been ordered. You can deactivate it instead.',
                    'hasOrders' => true,
                    'orderItemsCount' => $product->orderItems()->count()
                ], 400);
            }

            Log::info("Deletion ALLOWED: Product has 0 order items");

            DB::beginTransaction();

            // Delete all associated image files from storage
            foreach ($product->images as $image) {
                if ($image->image_url) {
                    $path = str_replace('/storage/', '', $image->image_url);
                    Storage::disk('public')->delete($path);
                }
            }

            // Delete associated cart items (cascade will handle this, but we're being explicit)
            $product->cartItems()->delete();

            // Delete associated reviews (cascade will handle this too)
            $product->reviews()->delete();

            // Delete product (cascade will delete product_images records)
            $product->delete();

            DB::commit();

            Log::info("Deletion SUCCESSFUL: Product deleted");
            Log::info("=== End Product Deletion Attempt ===\n");

            return response()->json([
                'message' => 'Product deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to delete product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle product active status (activate/deactivate)
     * 
     * Uses route model binding
     * 
     * This is a safe alternative to deletion for products with order history.
     * Deactivated products are hidden from the storefront but retain all data.
     * 
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleActive(Product $product)
    {
        try {
            // Toggle the active status
            $newStatus = !$product->is_active;
            $product->update(['is_active' => $newStatus]);

            $statusText = $newStatus ? 'activated' : 'deactivated';

            Log::info("Product {$statusText}: ID={$product->id}, Name={$product->name}");

            return response()->json([
                'message' => "Product {$statusText} successfully",
                'is_active' => $newStatus
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update product status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}