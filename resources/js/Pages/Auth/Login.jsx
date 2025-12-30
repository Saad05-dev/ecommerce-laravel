import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="max-w-md mx-auto">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <div 
                            className="font-extrabold tracking-tight text-center"
                            style={{
                                WebkitTextStroke: '2px black',
                                WebkitTextFillColor: 'transparent',
                                color: 'transparent'
                            }}
                        >
                            <div className="text-4xl leading-tight">SAAD</div>
                            <div className="text-3xl leading-tight">MEHDI</div>
                        </div>
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome back</h1>
                    <p className="text-lg text-gray-500">Sign in to your account to continue</p>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200">
                        <p className="text-sm text-green-700 text-center">{status}</p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={submit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <InputLabel htmlFor="email" value="Email address" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Password Field */}
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center cursor-pointer group">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                Remember me
                            </span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    {/* Submit Button - i forgot about the primary button tfoooo*/}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 px-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {processing ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                {/* Divider */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            href={route('register')}
                            className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>

            {/* Hidden Navigation Links - Collapsible for developers */}
            <details className="mt-8 text-center max-w-md mx-auto">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition-colors select-none">
                    Developer Links
                </summary>
                <div className="mt-3 space-y-1 text-xs bg-gray-50 rounded-xl p-3">
                    <Link href={route('register')} className="block text-gray-500 hover:text-gray-900 py-1">
                        → Register
                    </Link>
                    <Link href={route('verification.notice')} className="block text-gray-500 hover:text-gray-900 py-1">
                        → Verify Email
                    </Link>
                    <Link href={route('password.request')} className="block text-gray-500 hover:text-gray-900 py-1">
                        → Forgot Password
                    </Link>
                    <Link href={route('password.confirm')} className="block text-gray-500 hover:text-black py-1">
                        → Confirm Password
                    </Link>
                    <Link href="/reset-password/test-token-12345?email=test@example.com" className="block text-gray-500 hover:text-gray-900 py-1">
                        → Reset Password (Test)
                    </Link>
                </div>
            </details>
        </GuestLayout>
    );
}