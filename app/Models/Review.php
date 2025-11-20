<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'user_id',
        'rating',
        'review_title',
        'review_text',
        'is_verified_purchase',
        'helpful_count',
        'is_active',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_verified_purchase' => 'boolean',
        'helpful_count' => 'integer',
        'is_active' => 'boolean',
    ];

    // Relationship: Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Relationship: User (reviewer)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scope: Active reviews only
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope: Verified purchases only
    public function scopeVerified($query)
    {
        return $query->where('is_verified_purchase', true);
    }

    // Scope: Filter by rating
    public function scopeRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }
}
