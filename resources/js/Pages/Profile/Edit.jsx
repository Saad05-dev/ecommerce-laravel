import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { User, Package, MapPin, Heart, Settings, LogOut, Lock, Trash2 } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { useState } from 'react';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                        <User className="w-10 h-10 text-gray-500" />
                                    </div>
                                    <h2 className="font-semibold text-lg">{auth.user.name}</h2>
                                    <p className="text-sm text-gray-600">{auth.user.email}</p>
                                </div>
                                
                                <nav className="space-y-1">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                            activeTab === 'profile' ? 'bg-gray-50 font-medium' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <User className="w-5 h-5" />
                                        <span>Profile</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('password')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                            activeTab === 'password' ? 'bg-gray-50 font-medium' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <Lock className="w-5 h-5" />
                                        <span>Password</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('delete')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                            activeTab === 'delete' ? 'bg-gray-50 font-medium' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        <span>Delete Account</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                                        <Package className="w-5 h-5" />
                                        <span>Orders</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                                        <MapPin className="w-5 h-5" />
                                        <span>Addresses</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                                        <Heart className="w-5 h-5" />
                                        <span>Wishlist</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                                        <Settings className="w-5 h-5" />
                                        <span>Settings</span>
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Profile Information Tab */}
                            {activeTab === 'profile' && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                    <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-full"
                                    />
                                </div>
                            )}

                            {/* Password Tab */}
                            {activeTab === 'password' && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                    <h3 className="text-xl font-semibold mb-6">Update Password</h3>
                                    <UpdatePasswordForm className="max-w-full" />
                                </div>
                            )}

                            {/* Delete Account Tab */}
                            {activeTab === 'delete' && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                    <h3 className="text-xl font-semibold mb-6">Delete Account</h3>
                                    <DeleteUserForm className="max-w-full" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}