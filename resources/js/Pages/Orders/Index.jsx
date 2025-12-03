import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, Link} from '@inertiajs/react';

export default function OrderIndex({ orders }) {

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">My Orders</h2>}
        >
            <Head title="My Orders" />

            <div className="overflow-x-auto rounded bg-white p-4 shadow">
                <table className="min-w-full text-left text-sm">
                    <thead>
                        <tr>
                            <th className="px-3 py-2">Order #</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2">Total</th>
                            <th className="px-3 py-2">Items</th>
                            <th className="px-3 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-t">
                                <td className="px-3 py-2">
                                    <Link
                                        href={route('orders.show', order.order_number)}
                                        className="text-indigo-600 hover:underline"
                                    >
                                        {order.order_number}
                                    </Link>
                                </td>
                                <td className="px-3 py-2">{order.order_status}</td>
                                <td className="px-3 py-2">${order.total_amount}</td>
                                <td className="px-3 py-2">{order.items_count}</td>
                                <td className="px-3 py-2">
                                    {order.created_at && new Date(order.created_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    )
}