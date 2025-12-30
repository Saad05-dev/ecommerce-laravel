import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ order }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Order Details</h2>}
        >
            <Head title={`Order #${order.order_number}`} />
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <Link
                    href={route('orders.index')}
                    className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                    ← Back to Orders
                </Link>

                <div className="rounded-lg bg-white p-6 shadow">
                    <div className="mb-6 flex items-center justify-between border-b pb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className={`inline-block rounded-full px-4 py-2 text-sm font-medium ${
                                order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {order.order_status}
                            </span>
                            <p className="mt-2 text-lg font-semibold text-gray-900">
                                ${parseFloat(order.total_amount).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Order Items */}
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Items</h3>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{item.product.name}</p>
                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.quantity} × ${parseFloat(item.unit_price).toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            ${parseFloat(item.total_price).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Addresses & Summary */}
                        <div className="space-y-6">
                            {order.shipping_address && (
                                <div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Shipping Address</h3>
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <p className="font-medium text-gray-900">
                                            {order.shipping_address.recipient_name || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {order.shipping_address.address_line1}
                                            {order.shipping_address.address_line2 && `, ${order.shipping_address.address_line2}`}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {order.shipping_address.city}, {order.shipping_address.state_province} {order.shipping_address.postal_code}
                                        </p>
                                        <p className="text-sm text-gray-600">{order.shipping_address.country}</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">Order Summary</h3>
                                <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="text-gray-900">${parseFloat(order.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="text-gray-900">${parseFloat(order.tax_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="text-gray-900">${parseFloat(order.shipping_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 font-semibold">
                                        <span className="text-gray-900">Total</span>
                                        <span className="text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {order.payment_method && (
                                <div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Payment</h3>
                                    <p className="text-sm text-gray-600">
                                        Method: {order.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Status: <span className={`font-medium ${
                                            order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                            {order.payment_status}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

