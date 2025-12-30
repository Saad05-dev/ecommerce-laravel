@component('mail::message')
# Order Receipt — Order #{{ $order->id }}

Thanks for your order, {{ optional($order->user)->name ?? $order->billing_name ?? 'Customer' }}!

@component('mail::table')
| Item | Qty | Line Total |
| :--- | ---:| ---: |
@foreach($order->items as $item)
| {{ $item->product->name ?? 'Product' }} | {{ $item->quantity }} | ${{ number_format($item->total_price ?? ($item->quantity * $item->unit_price),2) }} |
@endforeach
@endcomponent

**Subtotal:** ${{ number_format($order->subtotal ?? 0, 2) }}  
**Shipping:** ${{ number_format($order->shipping_amount ?? 0, 2) }}  
**Total:** ${{ number_format($order->total_amount ?? ($order->subtotal + ($order->tax_amount ?? 0) + ($order->shipping_amount ?? 0)), 2) }}

@component('mail::button', ['url' => route('orders.show', $order)])
View order details
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
