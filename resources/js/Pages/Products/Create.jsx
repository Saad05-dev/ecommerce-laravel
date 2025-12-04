import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        weight: '',
        category_id: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Add Product</h2>}
        >
            <Head title="Add Product" />

            <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 w-full rounded border px-3 py-2 text-sm"
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="mt-1 w-full rounded border px-3 py-2 text-sm"
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium">Price</label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        className="mt-1 w-full rounded border px-3 py-2 text-sm"
                    />
                    {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                </div>

                {/* Stock */}
                <div>
                    <label className="block text-sm font-medium">Stock Quantity</label>
                    <input
                        type="number"
                        value={data.stock_quantity}
                        onChange={(e) => setData('stock_quantity', e.target.value)}
                        className="mt-1 w-full rounded border px-3 py-2 text-sm"
                    />
                    {errors.stock_quantity && (
                        <p className="text-sm text-red-600">{errors.stock_quantity}</p>
                    )}
                </div>

                {/* Weight */}
                <div>
                    <label className="block text-sm font-medium">Weight</label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.weight}
                        onChange={(e) => setData('weight', e.target.value)}
                        className="mt-1 w-full rounded border px-3 py-2 text-sm"
                    />
                    {errors.weight && <p className="text-sm text-red-600">{errors.weight}</p>}
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium">Category</label>
                    <select
                        value={data.category_id}
                        onChange={(e) => setData('category_id', e.target.value || '')}
                        className="mt-1 w-full rounded border px-3 py-2 text-sm"
                    >
                        <option value="">None</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && (
                        <p className="text-sm text-red-600">{errors.category_id}</p>
                    )}
                </div>

                {/* Active */}
                <div className="flex items-center space-x-2">
                    <input
                        id="is_active"
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                    />
                    <label htmlFor="is_active" className="text-sm">
                        Active
                    </label>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}