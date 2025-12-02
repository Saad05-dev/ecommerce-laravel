import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';

export default function Index({categories}) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Categories</h2>} >
                <Head title="Categories" />
                <div className='space-y-4'>
                    {categories.map((category) =>(
                        <div key={category.id} className='rounded border p-4'>
                            <h3 className='text-lg font-semibold'>{category.name}</h3>
                            <p className='text-sm text-gray-600'>{category.description}</p>
                            {category.children.length > 0 && (
                                <ul className='mt-2 list-disc pl-5 text-sm'>
                                    {category.children.map((child) => (
                                        <li key={child.id}>{child.name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </AuthenticatedLayout>
    )
}