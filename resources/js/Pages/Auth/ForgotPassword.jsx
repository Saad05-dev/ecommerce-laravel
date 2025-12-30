import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="max-w-md mx-auto">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <a href="/" className="inline-block">
                        <div
                            className="font-extrabold tracking-tight text-center"
                            style={{
                                WebkitTextStroke: '2px black',
                                WebkitTextFillColor: 'transparent',
                                color: 'transparent',
                            }}
                        >
                            <div className="text-4xl leading-tight">SAAD</div>
                            <div className="text-3xl leading-tight">MEHDI</div>
                        </div>
                    </a>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Forgot your password?</h1>
                    <p className="text-lg text-gray-500">Enter your email and we'll send a reset link.</p>
                </div>

                {status && (
                    <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200">
                        <p className="text-sm text-green-700 text-center">{status}</p>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 px-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {processing ? 'Sending...' : 'Email Password Reset Link'}
                    </button>

                    <div className="mt-2 pt-6 border-t border-gray-200">
                        <p className="text-center text-gray-600">
                            Remembered your password?{' '}
                            <a href="/login" className="font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                                Sign in
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
