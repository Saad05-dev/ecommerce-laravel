import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ orders, filters }) {
    const items = orders?.data ?? orders ?? [];

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Orders</h2>}
        >
            <Head title="Orders" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        <th className="pb-2">Order #</th>
                                        <th className="pb-2">Customer</th>
                                        <th className="pb-2">Total</th>
                                        <th className="pb-2">Status</th>
                                        <th className="pb-2">Date</th>
                                        <th className="pb-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(order => (
                                        <tr key={order.id} className="border-t">
                                            <td className="py-2">{order.order_number}</td>
                                            <td className="py-2">{order.customer_name}</td>
                                            <td className="py-2">${order.total_amount}</td>
                                            <td className="py-2">{order.order_status}</td>
                                            <td className="py-2">{order.created_at}</td>
                                            <td className="py-2">
                                                <Link href={`/admin/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination basic links if provided */}
                            {orders?.links && (
                                <div className="mt-4">{/* Server-side pagination links will be rendered by Inertia link HTML if provided */}
                                    <div dangerouslySetInnerHTML={{ __html: orders.links }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
