import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function OrdersShow({ order }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Order Details</h2>}
        >
            <Head title={`Order ${order.order_number}`} />

            <div className="space-y-6">
                <section className="rounded bg-white p-4 shadow">
                    <h3 className="mb-2 text-lg font-semibold">Summary</h3>
                    <p>Order #: {order.order_number}</p>
                    <p>Status: {order.order_status}</p>
                    <p>Payment: {order.payment_status}</p>
                    <p>Subtotal: ${order.subtotal}</p>
                    <p>Tax: ${order.tax_amount}</p>
                    <p>Shipping: ${order.shipping_amount}</p>
                    <p className="font-bold">Total: ${order.total_amount}</p>
                </section>

                <section className="rounded bg-white p-4 shadow">
                    <h3 className="mb-2 text-lg font-semibold">Items</h3>
                    <ul className="space-y-2">
                        {order.items.map((item) => (
                            <li key={item.id} className="flex justify-between border-b pb-1">
                                <span>
                                    {item.product ? item.product.name : 'Product deleted'} x {item.quantity}
                                </span>
                                <span>${item.total_price}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <div className="rounded bg-white p-4 shadow">
                        <h3 className="mb-2 text-lg font-semibold">Shipping Address</h3>
                        {order.shipping_address ? (
                            <>
                                <p>{order.shipping_address.address_line1}</p>
                                <p>
                                    {order.shipping_address.city},{' '}
                                    {order.shipping_address.state_province}{' '}
                                    {order.shipping_address.postal_code}
                                </p>
                                <p>{order.shipping_address.country}</p>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">No shipping address.</p>
                        )}
                    </div>

                    <div className="rounded bg-white p-4 shadow">
                        <h3 className="mb-2 text-lg font-semibold">Billing Address</h3>
                        {order.billing_address ? (
                            <>
                                <p>{order.billing_address.address_line1}</p>
                                <p>
                                    {order.billing_address.city},{' '}
                                    {order.billing_address.state_province}{' '}
                                    {order.billing_address.postal_code}
                                </p>
                                <p>{order.billing_address.country}</p>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">No billing address.</p>
                        )}
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}