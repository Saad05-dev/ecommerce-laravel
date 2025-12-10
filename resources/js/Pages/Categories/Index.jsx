import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ categories }) {
    const handleDelete = (category) => {
        if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
            router.delete(route('categories.destroy', category.slug));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Categories</h2>
                    <Link
                        href={route('categories.create')}
                        className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        Add Category
                    </Link>
                </div>
            }
        >
            <Head title="Categories" />
            
            <div className="space-y-4">
                {categories.length === 0 ? (
                    <p className="text-gray-500">No categories found. Create your first category!</p>
                ) : (
                    categories.map((category) => (
                        <div key={category.id} className="rounded border bg-white p-4 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold">{category.name}</h3>
                                        {!category.is_active && (
                                            <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-600">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    {category.description && (
                                        <p className="mt-1 text-sm text-gray-600">{category.description}</p>
                                    )}
                                    {category.children && category.children.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-xs font-medium text-gray-500">Subcategories:</p>
                                            <ul className="mt-1 list-disc pl-5 text-sm">
                                                {category.children.map((child) => (
                                                    <li key={child.id} className="text-gray-700">
                                                        {child.name}
                                                        {!child.is_active && (
                                                            <span className="ml-2 text-xs text-gray-500">(Inactive)</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="ml-4 flex space-x-2">
                                    <Link
                                        href={route('categories.edit', category.slug)}
                                        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category)}
                                        className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AuthenticatedLayout>
    );
}