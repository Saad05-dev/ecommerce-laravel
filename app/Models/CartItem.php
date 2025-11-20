<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'product_id',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    // Relationship: User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship: Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Helper: Calculate subtotal for this cart item
    public function getSubtotalAttribute()
    {
        return $this->quantity * $this->product->price;
    }
}
