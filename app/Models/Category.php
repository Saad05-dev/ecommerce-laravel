<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relationship: Parent category
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // Relationship: Child categories (subcategories)
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Relationship: Products in this category
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    // Scope: Get only active categories
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope: Get only parent categories
    public function scopeParents($query)
    {
        return $query->whereNull('parent_id');
    }
}
