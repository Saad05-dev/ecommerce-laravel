import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

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
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Reset your password</h1>
                    <p className="text-lg text-gray-500">Enter a new password to continue</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="New Password" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                        />

                        <TextInput
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 px-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {processing ? 'Resetting...' : 'Reset Password'}
                    </button>

                    {/* Divider */}
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
