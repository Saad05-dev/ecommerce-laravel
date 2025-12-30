import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ product }) {
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    const handleAddToCart = () => {
        if (quantity < 1 || quantity > product.stock_quantity) return;
        
        setAddingToCart(true);
        router.post(route('cart.store'), {
            product_id: product.id,
            quantity: quantity,
        }, {
            preserveScroll: true,
            onFinish: () => setAddingToCart(false),
        });
    };

    const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
    const otherImages = product.images?.filter(img => img.id !== primaryImage?.id) || [];

    return (
        <PublicLayout>
            <Head title={product.name} />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    href={route('products.index')}
                    className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                    ← Back to Products
                </Link>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Product Images */}
                    <div>
                        <div className="aspect-square overflow-hidden rounded-lg bg-gray-200">
                            {primaryImage ? (
                                <img
                                    src={primaryImage.image_url}
                                    alt={primaryImage.alt_text || product.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400">
                                    <svg className="h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        
                        {otherImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-4 gap-4">
                                {otherImages.slice(0, 4).map((image) => (
                                    <div key={image.id} className="aspect-square overflow-hidden rounded-lg bg-gray-200">
                                        <img
                                            src={image.image_url}
                                            alt={image.alt_text || product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">{product.name}</h1>
                        
                        {product.category && (
                            <p className="mb-4 text-sm text-gray-500">
                                Category: {product.category.name}
                            </p>
                        )}

                        <div className="mb-6">
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-bold text-gray-900">
                                    ${parseFloat(product.price).toFixed(2)}
                                </span>
                                {product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price) && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through">
                                            ${parseFloat(product.compare_price).toFixed(2)}
                                        </span>
                                        <span className="rounded bg-red-100 px-2 py-1 text-sm font-medium text-red-800">
                                            Save {Math.round(((parseFloat(product.compare_price) - parseFloat(product.price)) / parseFloat(product.compare_price)) * 100)}%
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700">{product.description}</p>
                        </div>

                        <div className="mb-6 space-y-2">
                            <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-700">Stock:</span>
                                <span className={`ml-2 text-sm ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of Stock'}
                                </span>
                            </div>
                            {product.weight && (
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-700">Weight:</span>
                                    <span className="ml-2 text-sm text-gray-600">{product.weight} kg</span>
                                </div>
                            )}
                        </div>

                        {product.stock_quantity > 0 && (
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Quantity
                                </label>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={product.stock_quantity}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1)))}
                                        className="w-20 rounded-md border border-gray-300 px-3 py-2 text-center"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                        className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart || product.stock_quantity === 0}
                            className="w-full rounded-md bg-gray-800 px-6 py-3 text-lg font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {addingToCart ? 'Adding to Cart...' : product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

