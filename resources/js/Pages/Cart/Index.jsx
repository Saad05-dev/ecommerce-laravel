import React, { useState } from 'react';
import { ShoppingBag, Facebook, Instagram, Youtube, Twitter, Sparkles, Minus, Plus, X } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, router, Link } from '@inertiajs/react';

export default function Index({ cartItems, total, auth }) {
    const [updating, setUpdating] = useState(null);
    const [removing, setRemoving] = useState(null);

    const handleCheckout = () => {
        if (!auth?.user) {
            // Redirect to login if not authenticated
            router.visit(route('login'), {
                data: { intended: route('orders.checkout') }
            });
        } else {
            // Navigate to checkout if authenticated
            router.visit(route('orders.checkout'));
        }
    };

    const handleUpdateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdating(itemId);
        router.patch(route('cart.update', itemId), {
            quantity: newQuantity,
        }, {
            preserveScroll: true,
            onFinish: () => setUpdating(null),
        });
    };

    const handleRemove = (itemId) => {
        setRemoving(itemId);
        router.delete(route('cart.destroy', itemId), {
            preserveScroll: true,
            onFinish: () => setRemoving(null),
        });
    };

    // Empty cart state
    if (!cartItems || cartItems.length === 0) {
        return (
            <PublicLayout>
                <Head title="Shopping Cart" />

                <div className="min-h-screen bg-white">

                    {/* 1. Enhanced Empty State Section */}
                    <div className="py-32 text-center px-4 relative overflow-hidden">
                        {/* Subtle background decoration */}
                        <div className="absolute inset-0 -z-10">
                            <div className="absolute top-20 left-1/4 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                            <div className="absolute top-40 right-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
                        </div>

                        {/* Shopping bag icon */}
                        <div className="mb-8 flex justify-center">
                            <div className="relative">
                                <ShoppingBag className="w-20 h-20 text-gray-300" strokeWidth={1.5} />
                                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-light mb-4 text-gray-900 tracking-tight">
                            Your cart is empty
                        </h1>

                        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto font-light">
                            Looks like you haven't added anything yet. Let's find something special for you.
                        </p>

                        <Link
                            href={route('products.index')}
                            className="inline-block group relative bg-black hover:bg-gray-900 text-white px-12 py-4 rounded-full text-sm font-medium tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
                        >
                            <span className="relative z-10">Explore Products</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="absolute inset-0 flex items-center justify-center text-black font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                Let's Go →
                            </span>
                        </Link>
                    </div>

                    {/* Elegant Divider */}
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="border-t border-gray-200"></div>
                    </div>

                    {/* 2. Enhanced Brand Philosophy Section */}
                    <div className="py-32 text-center max-w-3xl mx-auto px-6">

                        {/* Logo with improved animation */}
                        <div className="mb-12 flex justify-center">
                            <div className="relative group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                                <div className="relative w-20 h-20 bg-black rounded-2xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-all duration-500 shadow-xl group-hover:shadow-2xl">
                                    <span className="text-white text-4xl font-bold font-serif select-none">SM</span>
                                </div>
                            </div>
                        </div>

                        {/* Headline with better spacing */}
                        <h2 className="text-2xl md:text-3xl font-light mb-8 text-gray-900 tracking-wide leading-relaxed">
                            A brand that strives to inspire and push creative culture forward
                        </h2>

                        {/* Description with improved readability */}
                        <p className="text-gray-600 text-base leading-8 mb-16 font-light max-w-2xl mx-auto">
                            We approach our work with the mentality that every product made is a learning experience to
                            improve our craft. We are practitioners and purveyors of creative culture and are inspired
                            by its various forms from art, design, fashion, music, film, food, and more.
                        </p>

                        {/* Enhanced Social Icons */}
                        <div className="flex justify-center gap-6 items-center">
                            <a href="#" className="group relative">
                                <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="relative w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:text-blue-600 hover:border-blue-600 transition-all duration-300 hover:scale-110 bg-white">
                                    <Facebook className="w-5 h-5" />
                                </div>
                            </a>

                            <a href="#" className="group relative">
                                <div className="absolute inset-0 bg-pink-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="relative w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:text-pink-600 hover:border-pink-600 transition-all duration-300 hover:scale-110 bg-white">
                                    <Instagram className="w-5 h-5" />
                                </div>
                            </a>

                            <a href="#" className="group relative">
                                <div className="absolute inset-0 bg-red-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="relative w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:text-red-600 hover:border-red-600 transition-all duration-300 hover:scale-110 bg-white">
                                    <Youtube className="w-5 h-5" />
                                </div>
                            </a>

                            <a href="#" className="group relative">
                                <div className="absolute inset-0 bg-gray-900 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="relative w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:text-gray-900 hover:border-gray-900 transition-all duration-300 hover:scale-110 bg-white">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                </div>
                            </a>

                            <a href="#" className="group relative">
                                <div className="absolute inset-0 bg-sky-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <div className="relative w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:text-sky-500 hover:border-sky-500 transition-all duration-300 hover:scale-110 bg-white">
                                    <Twitter className="w-5 h-5" />
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Bottom spacing */}
                    <div className="pb-16"></div>
                </div>
            </PublicLayout>
        );
    }

    // Cart with items
    return (
        <PublicLayout>
            <Head title="Shopping Cart" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm p-6 flex gap-6">
                                    {/* Product Image */}
                                    <img
                                        src={item.product.primary_image?.image_url || '/placeholder.jpg'}
                                        alt={item.product.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />

                                    {/* Product Details */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-gray-900">{item.product.name}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{item.product.category?.name}</p>
                                        <p className="text-xl font-bold text-gray-900 mt-2">${item.product.price}</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            disabled={removing === item.id}
                                            className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>

                                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                disabled={updating === item.id || item.quantity <= 1}
                                                className="text-gray-600 hover:text-black disabled:opacity-30 transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-semibold text-gray-900 w-8 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                disabled={updating === item.id}
                                                className="text-gray-600 hover:text-black disabled:opacity-30 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-semibold">Free</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center text-black font-semibold py-4 rounded-full transition-colors shadow-sm"
                                >
                                    Proceed to Checkout
                                </button>

                                <Link
                                    href={route('products.index')}
                                    className="block w-full text-center text-gray-600 hover:text-gray-900 font-medium py-3 mt-3 transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}