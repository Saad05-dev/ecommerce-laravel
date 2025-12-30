<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Category Model
 * 
 * Represents a product category in the e-commerce platform
 * Supports hierarchical categories (parent-child relationships)
 */
class Category extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     * 
     * @var array
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ==================== RELATIONSHIPS ====================

    /**
     * Get all products in this category
     * 
     * A category can have multiple products
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the parent category
     * 
     * A category can belong to a parent category (for subcategories)
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Get all child categories (subcategories)
     * 
     * A category can have multiple child categories
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // ==================== QUERY SCOPES ====================

    /**
     * Scope a query to only include active categories
     * 
     * Usage: Category::active()->get()
     * 
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include parent categories (no parent_id)
     * 
     * Usage: Category::parents()->get()
     * 
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeParents($query)
    {
        return $query->whereNull('parent_id');
    }

    // ==================== HELPER METHODS ====================

    /**
     * Check if category has products
     * 
     * @return bool
     */
    public function hasProducts()
    {
        return $this->products()->count() > 0;
    }

    /**
     * Check if this is a parent category
     * 
     * @return bool
     */
    public function isParent()
    {
        return is_null($this->parent_id);
    }

    /**
     * Check if this is a child category
     * 
     * @return bool
     */
    public function isChild()
    {
        return !is_null($this->parent_id);
    }

    /**
     * Get the full category path (for breadcrumbs)
     * Example: "Electronics > Phones > Smartphones"
     * 
     * @return string
     */
    public function getFullPath()
    {
        $path = [$this->name];
        $parent = $this->parent;
        
        while ($parent) {
            array_unshift($path, $parent->name);
            $parent = $parent->parent;
        }
        
        return implode(' > ', $path);
    }
}