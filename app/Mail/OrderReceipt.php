<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Order;

class OrderReceipt extends Mailable
{
    use Queueable, SerializesModels;

    public Order $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        // Ensure the order and needed relations are loaded when rendering the email.
        // This handles both sync sends and queued sends where the model may be re-hydrated without relations.
        try {
            $orderId = $this->order->id ?? null;
            if ($orderId) {
                $this->order = \App\Models\Order::with(['items.product', 'shippingAddress', 'billingAddress', 'user'])->find($orderId) ?: $this->order;
            }
        } catch (\Throwable $e) {
            // If anything goes wrong, log and continue — the view will fall back to available attributes.
            \Illuminate\Support\Facades\Log::warning('OrderReceipt: failed to eagerly load relations for order: ' . ($this->order->id ?? 'unknown') . ' - ' . $e->getMessage());
        }

        return $this
            ->subject('Your receipt for order #' . ($this->order->id ?? ''))
            ->markdown('emails.orders.receipt')
            ->with(['order' => $this->order]);
    }
}
