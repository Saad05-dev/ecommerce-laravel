import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ category, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        description: category.description || '',
        parent_id: category.parent_id || '',
        is_active: category.is_active,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('categories.update', category.slug));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Category</h2>}
        >
            <Head title={`Edit ${category.name}`} />

            <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 w-full rounded border px-3 py-2 text-sm"
                        required
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
                        rows="4"
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                </div>

                {/* Parent Category */}
                <div>
                    <label className="block text-sm font-medium">Parent Category</label>
                    <select
                        value={data.parent_id}
                        onChange={(e) => setData('parent_id', e.target.value || '')}
                        className="mt-1 w-full rounded border px-3 py-2 text-sm"
                    >
                        <option value="">None (Top Level)</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.parent_id && (
                        <p className="text-sm text-red-600">{errors.parent_id}</p>
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

                <div className="flex space-x-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Update Category'}
                    </button>
                    <a
                        href={route('categories.index')}
                        className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                    >
                        Cancel
                    </a>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}