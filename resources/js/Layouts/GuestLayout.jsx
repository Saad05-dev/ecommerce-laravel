import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-indigo-600 via-purple-600 to-slate-900 text-slate-100">
    {/* Header with Logo */}
    <header className="px-8 py-6">
        <Link href="/" className="flex items-center gap-3">
            <ApplicationLogo className="h-10 w-10 text-white" />
            <span className="text-lg font-semibold tracking-tight">
                Saad Commerce
            </span>
        </Link>
    </header>

    {/* Main Content - Centered */}
    <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                Manage your ecommerce store with confidence.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-slate-100/80">
                Modern Laravel + React stack, seeded demo data, and a clean admin
                interface to manage products, categories, and orders.
            </p>
        </div>

        <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl shadow-black/40 backdrop-blur">
            {children}
        </div>
    </main>

    {/* Footer */}
    <footer className="px-8 py-6 text-center">
        <p className="text-xs text-slate-100/60">
            © {new Date().getFullYear()} Saad Commerce. All rights reserved.
        </p>
    </footer>
</div>
    );
}
