import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';

export default function Index({products}) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Products</h2>} >
                <Head title="Products" />
                <div className="mb-4">
                <Link
                    href={route('products.create')}
                    className="inline-flex rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                    Add Product
                </Link>
                </div>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {products.map((product) => (
                        <div key={product.id} className='rounded border p-4'>
                            <h3 className='text-lg font-semibold'>
                                <a href={route('products.show', product.slug)}
                                className='text-indigo-600 hover:underline'>
                                    {product.name}
                                </a>
                                </h3>
                            <p className="text-sm text-gray-500">
                            Category: {product.category ? product.category.name : 'Uncategorized'}</p>
                            <p className='text-sm text-gray-600'>{product.description}</p>
                            <p className='text-sm text-gray-600'>Price: {product.price}</p>
                            <p className='text-sm text-gray-600'>Stock: {product.stock_quantity}</p>
                            <p className='text-sm text-gray-600'>Weight: {product.weight}</p>
                        </div>
                    ))}
                </div>
            </AuthenticatedLayout>
    )
}