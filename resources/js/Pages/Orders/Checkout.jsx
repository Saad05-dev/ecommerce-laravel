import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function Checkout({ cartItems, subtotal, tax, shipping, total, addresses }) {
    const [showNewAddress, setShowNewAddress] = useState(addresses.length === 0);
    const [creatingAddress, setCreatingAddress] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        shipping_address_id: addresses.find(a => a.is_default)?.id || addresses[0]?.id || '',
        billing_address_id: addresses.find(a => a.is_default)?.id || addresses[0]?.id || '',
        payment_method: 'credit_card',
        // New address fields
        address_line1: '',
        address_line2: '',
        city: '',
        state_province: '',
        postal_code: '',
        country: 'United States',
        recipient_name: '',
        recipient_phone: '',
    });

    const handleCreateAddress = async () => {
        setCreatingAddress(true);
        try {
            const response = await axios.post(route('addresses.store'), {
                address_line1: data.address_line1,
                address_line2: data.address_line2,
                city: data.city,
                state_province: data.state_province,
                postal_code: data.postal_code,
                country: data.country,
                recipient_name: data.recipient_name,
                recipient_phone: data.recipient_phone,
            });
            
            setData({
                ...data,
                shipping_address_id: response.data.id,
                billing_address_id: response.data.id,
            });
            setShowNewAddress(false);
            router.reload({ only: ['addresses'] });
        } catch (error) {
            console.error('Failed to create address:', error);
        } finally {
            setCreatingAddress(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    return (
        <PublicLayout>
            <Head title="Checkout" />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>

                <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Shipping Address</h2>
                            
                            {!showNewAddress && addresses.length > 0 && (
                                <div className="space-y-2">
                                    {addresses.map((address) => (
                                        <label key={address.id} className="flex items-start space-x-3 rounded border p-3 hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="shipping_address_id"
                                                value={address.id}
                                                checked={data.shipping_address_id == address.id}
                                                onChange={(e) => setData('shipping_address_id', e.target.value)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">
                                                    {address.recipient_name || 'Address'}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {address.address_line1}
                                                    {address.address_line2 && `, ${address.address_line2}`}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {address.city}, {address.state_province} {address.postal_code}
                                                </p>
                                                <p className="text-sm text-gray-600">{address.country}</p>
                                            </div>
                                        </label>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setShowNewAddress(true)}
                                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        + Add New Address
                                    </button>
                                </div>
                            )}

                            {showNewAddress && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.recipient_name}
                                            onChange={(e) => setData('recipient_name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Address Line 1 *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.address_line1}
                                            onChange={(e) => setData('address_line1', e.target.value)}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Address Line 2
                                        </label>
                                        <input
                                            type="text"
                                            value={data.address_line2}
                                            onChange={(e) => setData('address_line2', e.target.value)}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                State/Province
                                            </label>
                                            <input
                                                type="text"
                                                value={data.state_province}
                                                onChange={(e) => setData('state_province', e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                value={data.postal_code}
                                                onChange={(e) => setData('postal_code', e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Country *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.country}
                                                onChange={(e) => setData('country', e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            value={data.recipient_phone}
                                            onChange={(e) => setData('recipient_phone', e.target.value)}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        />
                                    </div>
                                    {addresses.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowNewAddress(false)}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            ← Use Existing Address
                                        </button>
                                    )}
                                    {showNewAddress && (
                                        <button
                                            type="button"
                                            onClick={handleCreateAddress}
                                            disabled={creatingAddress || !data.address_line1 || !data.city || !data.country}
                                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {creatingAddress ? 'Saving...' : 'Save Address'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Billing Address */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Billing Address</h2>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={data.billing_address_id === data.shipping_address_id}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setData('billing_address_id', data.shipping_address_id);
                                        }
                                    }}
                                />
                                <span className="text-sm text-gray-700">Same as shipping address</span>
                            </label>
                            
                            {data.billing_address_id !== data.shipping_address_id && (
                                <div className="mt-4">
                                    {addresses.map((address) => (
                                        <label key={address.id} className="flex items-start space-x-3 rounded border p-3 hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="billing_address_id"
                                                value={address.id}
                                                checked={data.billing_address_id == address.id}
                                                onChange={(e) => setData('billing_address_id', e.target.value)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">
                                                    {address.recipient_name || 'Address'}
                                                </p>
                                                <p className="text-sm text-gray-600">{address.formatted_address}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment Method</h2>
                            <select
                                value={data.payment_method}
                                onChange={(e) => setData('payment_method', e.target.value)}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="credit_card">Credit Card</option>
                                <option value="paypal">PayPal</option>
                                <option value="cash_on_delivery">Cash on Delivery</option>
                            </select>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
                            
                            <div className="space-y-2 border-b border-gray-200 pb-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {item.product.name} x {item.quantity}
                                        </span>
                                        <span className="text-gray-900">
                                            ${(item.quantity * parseFloat(item.product.price)).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 space-y-2 border-b border-gray-200 pb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax (10%)</span>
                                    <span className="text-gray-900">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-900">${shipping.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-between border-b border-gray-200 pb-4">
                                <span className="text-lg font-semibold text-gray-900">Total</span>
                                <span className="text-lg font-semibold text-gray-900">
                                    ${total.toFixed(2)}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !data.shipping_address_id || !data.billing_address_id}
                                className="mt-6 w-full rounded-md bg-gray-800 px-4 py-3 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Placing Order...' : 'Place Order'}
                            </button>

                            {errors.shipping_address_id && (
                                <p className="mt-2 text-sm text-red-600">{errors.shipping_address_id}</p>
                            )}
                            {errors.billing_address_id && (
                                <p className="mt-2 text-sm text-red-600">{errors.billing_address_id}</p>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}

