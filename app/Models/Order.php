<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'order_status',
        'payment_status',
        'subtotal',
        'tax_amount',
        'shipping_amount',
        'total_amount',
        'currency_code',
        'payment_method',
        'shipping_address_id',
        'billing_address_id',
        'notes',
        'shipped_date',
        'delivered_date',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'shipped_date' => 'datetime',
        'delivered_date' => 'datetime',
    ];

    // Relationship: User (customer)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship: Order items
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Relationship: Shipping address
    public function shippingAddress()
    {
        return $this->belongsTo(CustomerAddress::class, 'shipping_address_id');
    }

    // Relationship: Billing address
    public function billingAddress()
    {
        return $this->belongsTo(CustomerAddress::class, 'billing_address_id');
    }

    // Scope: Filter by status
    public function scopeStatus($query, $status)
    {
        return $query->where('order_status', $status);
    }

    // Scope: Pending orders
    public function scopePending($query)
    {
        return $query->where('order_status', 'pending');
    }

    // Scope: Completed orders
    public function scopeCompleted($query)
    {
        return $query->where('order_status', 'delivered');
    }

    // Helper: Check if order is paid
    public function getIsPaidAttribute()
    {
        return $this->payment_status === 'paid';
    }

    // Helper: Check if order can be cancelled
    public function getCanBeCancelledAttribute()
    {
        return in_array($this->order_status, ['pending', 'processing']);
    }
}
