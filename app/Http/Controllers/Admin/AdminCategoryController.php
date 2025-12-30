<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AdminCategoryController extends Controller
{
    /**
     * Display a listing of all categories
     * 
     * Returns all categories with product count for each category
     * Used in the admin dashboard category management section
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Get all categories with product count
        $categories = Category::withCount(['products', 'children'])
            ->orderBy('name')
            ->get()
            ->map(function($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'is_active' => $category->is_active,
                    'products_count' => $category->products_count,
                    'children_count' => $category->children_count,
                    'parent_id' => $category->parent_id,
                ];
            });
        
        return response()->json($categories);
    }

    /**
     * Store a newly created category in the database
     * 
     * Handles:
     * - Category creation with name, description, and active status
     * - Automatic slug generation from category name
     * - Ensures slug uniqueness
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        try {
            // Generate a unique slug from the category name
            $slug = Str::slug($validated['name']);
            $originalSlug = $slug;
            $counter = 1;
            
            // Ensure slug is unique by appending a number if necessary
            while (Category::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            // Create the category
            $category = Category::create([
                'name' => $validated['name'],
                'slug' => $slug,
                'description' => $validated['description'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
                'parent_id' => $validated['parent_id'] ?? null,
            ]);

            return response()->json([
                'message' => 'Category created successfully',
                'category' => $category
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified category in the database
     * 
     * Uses route model binding
     * 
     * Handles:
     * - Updating category name, description, and active status
     * - Regenerating slug if name changes
     * - Ensuring slug uniqueness
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Category $category)
    {
        // Validate incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        try {
            // Prevent category from being its own parent
            if (isset($validated['parent_id']) && $validated['parent_id'] == $category->id) {
                return response()->json([
                    'message' => 'A category cannot be its own parent',
                ], 422);
            }

            // Regenerate slug if category name has changed
            if ($category->name !== $validated['name']) {
                $slug = Str::slug($validated['name']);
                $originalSlug = $slug;
                $counter = 1;
                
                // Ensure new slug is unique (excluding current category)
                while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                    $slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
                
                $validated['slug'] = $slug;
            }

            // Update category with validated data
            $category->update($validated);

            return response()->json([
                'message' => 'Category updated successfully',
                'category' => $category
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified category from the database
     * 
     * Uses route model binding
     * 
     * Handles:
     * - Checking if category has products
     * - Preventing deletion if products exist (to maintain data integrity)
     * - Deleting category if no products are associated
     * 
     * Note: Products with this category will have their category_id set to null
     * due to the 'onDelete('set null')' constraint in the migration
     * 
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Category $category)
    {
        try {
            // Check if category has products
            $productsCount = $category->products()->count();
            
            if ($productsCount > 0) {
                return response()->json([
                    'message' => 'Cannot delete category with existing products. Please reassign or delete the products first.',
                    'products_count' => $productsCount
                ], 422);
            }

            // Check if category has child categories
            $childrenCount = $category->children()->count();
            
            if ($childrenCount > 0) {
                return response()->json([
                    'message' => 'Cannot delete category with subcategories. Please delete or reassign the subcategories first.',
                    'children_count' => $childrenCount
                ], 422);
            }

            // Delete category
            $category->delete();

            return response()->json([
                'message' => 'Category deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete category',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}