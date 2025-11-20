<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'address_line1',
        'address_line2',
        'city',
        'state_province',
        'postal_code',
        'country',
        'address_type',
        'is_default',
        'recipient_name',
        'recipient_phone',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    // Relationship: User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship: Orders using this as shipping address
    public function shippingOrders()
    {
        return $this->hasMany(Order::class, 'shipping_address_id');
    }

    // Relationship: Orders using this as billing address
    public function billingOrders()
    {
        return $this->hasMany(Order::class, 'billing_address_id');
    }

    // Scope: Default address
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    // Scope: Filter by type
    public function scopeType($query, $type)
    {
        return $query->where('address_type', $type);
    }

    // Helper: Get formatted address
    public function getFormattedAddressAttribute()
    {
        $parts = array_filter([
            $this->address_line1,
            $this->address_line2,
            $this->city,
            $this->state_province,
            $this->postal_code,
            $this->country,
        ]);

        return implode(', ', $parts);
    }
}
