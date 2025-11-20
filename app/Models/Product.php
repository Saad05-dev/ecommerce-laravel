<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
     use HasFactory;

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

    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'cost' => 'decimal:2',
        'weight' => 'decimal:3',
        'stock_quantity' => 'integer',
        'is_active' => 'boolean',
    ];

    // Relationship: Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relationship: Product images
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    // Relationship: Primary image
    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    // Relationship: Reviews
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // Relationship: Order items
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Relationship: Cart items
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    // Scope: Active products only
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope: In stock
    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    // Helper: Check if product is on sale
    public function getIsOnSaleAttribute()
    {
        return $this->compare_price && $this->compare_price > $this->price;
    }

    // Helper: Calculate discount percentage
    public function getDiscountPercentageAttribute()
    {
        if (!$this->is_on_sale) {
            return 0;
        }
        return round((($this->compare_price - $this->price) / $this->compare_price) * 100);
    }

    // Helper: Average rating
    public function getAverageRatingAttribute()
    {
        return $this->reviews()->where('is_active', true)->avg('rating') ?? 0;
    }
}
