import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ orders }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">My Orders</h2>}
        >
            <Head title="My Orders" />
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {orders.length === 0 ? (
                    <div className="rounded-lg bg-white p-12 text-center shadow">
                        <p className="text-gray-500">You haven't placed any orders yet.</p>
                        <Link
                            href={route('products.index')}
                            className="mt-4 inline-block rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="rounded-lg bg-white p-6 shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Link
                                            href={route('orders.show', order.id)}
                                            className="text-lg font-semibold text-gray-900 hover:text-gray-600"
                                        >
                                            Order #{order.order_number}
                                        </Link>
                                        <p className="text-sm text-gray-500">
                                            Placed on {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
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
                                
                                <div className="mt-4 border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                        </div>
                                        <Link
                                            href={route('orders.show', order.id)}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

