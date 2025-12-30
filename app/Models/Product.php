<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Product Model
 * 
 * Represents a product in the e-commerce platform
 * Handles relationships with categories, images, and reviews
 */
class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * 
     * These fields can be filled using create() or update() methods
     * 
     * @var array
     */
    protected $fillable = [
        'category_id',
        'sku',
        'name',
        'slug',
        'description',
        'price',
        'compare_price',
        'cost',
        'stock_quantity',
        'weight',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     * 
     * Automatically converts these fields to the specified types
     * 
     * @var array
     */
    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'cost' => 'decimal:2',
        'weight' => 'decimal:3',
        'stock_quantity' => 'integer',
        'is_active' => 'boolean',
    ];

    // ==================== RELATIONSHIPS ====================

    /**
     * Get the category that owns the product
     * 
     * A product belongs to one category
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get all images for the product
     * 
     * A product can have multiple images
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Get all reviews for the product
     * 
     * A product can have multiple reviews from different users
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get all cart items for this product
     * 
     * A product can be in multiple carts
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get all order items for this product
     * 
     * A product can be in multiple orders
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // ==================== QUERY SCOPES ====================

    /**
     * Scope a query to only include active products
     * 
     * Usage: Product::active()->get()
     * 
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include products with low stock
     * 
     * Low stock is defined as less than 10 items
     * Usage: Product::lowStock()->get()
     * 
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLowStock($query)
    {
        return $query->where('stock_quantity', '<', 10);
    }

    /**
     * Scope a query to only include out of stock products
     * 
     * Usage: Product::outOfStock()->get()
     * 
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOutOfStock($query)
    {
        return $query->where('stock_quantity', 0);
    }

    /**
     * Scope a query to filter by category
     * 
     * Usage: Product::inCategory($categoryId)->get()
     * 
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int  $categoryId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeInCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    // ==================== HELPER METHODS ====================

    /**
     * Get the product's primary image
     * 
     * Returns the first image marked as primary, or the first image if none are primary
     * 
     * @return \App\Models\ProductImage|null
     */
    public function getPrimaryImage()
    {
        return $this->images()->where('is_primary', true)->first() 
            ?? $this->images()->first();
    }

    /**
     * Check if product is in stock
     * 
     * @return bool
     */
    public function isInStock()
    {
        return $this->stock_quantity > 0;
    }

    /**
     * Check if product has low stock
     * 
     * @return bool
     */
    public function hasLowStock()
    {
        return $this->stock_quantity < 10 && $this->stock_quantity > 0;
    }

    /**
     * Get discount percentage if compare_price exists
     * 
     * @return float|null
     */
    public function getDiscountPercentage()
    {
        if ($this->compare_price && $this->compare_price > $this->price) {
            return round((($this->compare_price - $this->price) / $this->compare_price) * 100);
        }
        return null;
    }
}