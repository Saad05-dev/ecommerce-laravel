import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ShoppingBag, Heart, Eye } from 'lucide-react';

export default function Index({ products }) {
    const [addingToCart, setAddingToCart] = useState(null);
    const [hoveredProduct, setHoveredProduct] = useState(null);

    const handleAddToCart = (productId) => {
        setAddingToCart(productId);
        router.post(route('cart.store'), {
            product_id: productId,
            quantity: 1,
        }, {
            preserveScroll: true,
            onFinish: () => setAddingToCart(null),
        });
    };

    return (
        <PublicLayout>
            <Head title="Products" />
            <div className="min-h-screen bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-16 text-center">
                        <h1 className="text-5xl md:text-6xl font-light text-gray-900 tracking-tight mb-4">
                            Our Products
                        </h1>
                        <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
                            Carefully curated pieces that blend timeless design with modern craftsmanship
                        </p>
                    </div>
                    
                    {products.length === 0 ? (
                        <div className="py-24 text-center">
                            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
                            <p className="text-gray-500 text-lg font-light">No products available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="group relative rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:shadow-2xl"
                                    onMouseEnter={() => setHoveredProduct(product.id)}
                                    onMouseLeave={() => setHoveredProduct(null)}
                                >
                                    {/* Product Image - Clickable */}
                                    <Link href={route('products.show', product.id)}>
                                        <div className="relative w-full h-80 bg-gray-50 overflow-hidden cursor-pointer">
                                            {product.primary_image ? (
                                                <>
                                                    <img
                                                        src={product.primary_image.image_url}
                                                        alt={product.primary_image.alt_text || product.name}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    {/* Overlay on hover */}
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                                                </>
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-gray-300">
                                                    <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Stock badge */}
                                            {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                                                <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                                                    Only {product.stock_quantity} left
                                                </div>
                                            )}

                                            {product.stock_quantity === 0 && (
                                                <div className="absolute top-4 left-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                                                    Out of Stock
                                                </div>
                                            )}

                                            {/* Quick action buttons */}
                                            <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${hoveredProduct === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        // Add wishlist functionality here
                                                    }}
                                                    className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                                                >
                                                    <Heart className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        // Add quick view functionality here
                                                    }}
                                                    className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                                                >
                                                    <Eye className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                            
                                    {/* Product Info */}
                                    <div className="p-5">
                                        {/* Product Name - Clickable */}
                                        <Link href={route('products.show', product.id)}>
                                            <h3 className="text-base font-medium mb-2 text-gray-900 hover:text-gray-700 transition-colors cursor-pointer">
                                                {product.name}
                                            </h3>
                                        </Link>
                                
                                        <div className="flex items-center gap-2 mb-4">
                                            <p className="text-xl font-semibold text-gray-900">
                                                ${parseFloat(product.price).toFixed(2)}
                                            </p>
                                            {product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price) && (
                                                <p className="text-sm text-gray-400 line-through font-light">
                                                    ${parseFloat(product.compare_price).toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                
                                        <button
                                            onClick={() => handleAddToCart(product.id)}
                                            disabled={addingToCart === product.id || product.stock_quantity === 0}
                                            className="w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                                        >
                                            {addingToCart === product.id
                                                ? 'Adding...'
                                                : product.stock_quantity === 0
                                                    ? 'Out of Stock'
                                                    : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>                        
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}