import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Show({ product, relatedProducts }) {
    const { post, processing } = useForm({ quantity: 1 });

    const handleBuyNow = (e) => {
        e.preventDefault();
        post(route('orders.buy', product.slug));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Product Details</h2>}
        >
            <Head title={product.name} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="col-span-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <div className="mt-4">{product.description}</div>
                    <div className="mt-4">Price: {product.price}</div>
                    <div className="mt-4">Stock: {product.stock_quantity}</div>
                    <div className="mt-4">
                        Category: {product.category ? product.category.name : 'Uncategorized'}
                    </div>
                    <div className="mt-4">Average Rating: {product.average_rating}</div>
                    <div className="mt-4">Reviews Count: {product.reviews_count}</div>
                    <div className="mt-4">In Stock: {product.in_stock ? 'Yes' : 'No'}</div>

                    {/* Buy Now */}
                    {product.stock_quantity > 0 && (
                        <form onSubmit={handleBuyNow} className="mt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Placing order...' : 'Buy Now'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}