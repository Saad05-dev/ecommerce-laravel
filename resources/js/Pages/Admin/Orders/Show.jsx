import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Show({ order }) {
    if (!order) return null;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Order #{order.order_number}</h2>}
        >
            <Head title={`Order ${order.order_number}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-4">
                            <div>
                                <strong>Customer:</strong> {order.customer_name} ({order.customer_email})
                            </div>
                            <div>
                                <strong>Status:</strong> {order.order_status} — <strong>Payment:</strong> {order.payment_status}
                            </div>
                            <div>
                                <strong>Total:</strong> ${order.total_amount}
                            </div>

                            <div>
                                <h3 className="font-semibold">Items</h3>
                                <ul className="list-disc pl-6">
                                    {order.items && order.items.map(item => (
                                        <li key={item.id}>{item.product_name} × {item.quantity} — ${item.total_price}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold">Shipping Address</h3>
                                <div>{order.shipping_address?.address_line_1}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
