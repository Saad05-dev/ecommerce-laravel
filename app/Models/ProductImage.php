<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
     use HasFactory;

    protected $fillable = [
        'product_id',
        'image_url',
        'alt_text',
        'is_primary',
        'sort_order',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Relationship: Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Scope: Primary images only
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    // Scope: Order by sort_order
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}
