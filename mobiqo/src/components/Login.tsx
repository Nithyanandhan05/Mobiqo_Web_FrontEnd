import { useState } from 'react';

interface LoginProps {
    onNavigate: (page: 'home' | 'register' | 'cart' | 'compare' | 'warranty' | 'forgot-password', data?: any) => void;
    onLoginSuccess: (token: string, userName: string, email: string) => void;
}

export function Login({ onNavigate, onLoginSuccess }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please fill in both email and password.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok && data.status === 'success') {
                onLoginSuccess(data.token, data.user_name, email);
            } else {
                setError(data.message || 'Invalid credentials.');
            }
        } catch (err) {
            setError('Unable to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 min-h-screen bg-white flex w-full">
            {/* Left Panel - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-[#4ea5f5] to-[#124cb1] w-1/2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <div className="relative z-10 text-center max-w-md">
                    <div className="w-40 h-40 mx-auto mb-8 bg-white/95 backdrop-blur-md rounded-3xl p-4 flex items-center justify-center shadow-2xl border border-white/20 page-enter">
                        <img src="/logo.png" alt="Mobiqo Logo" className="w-full h-full object-contain drop-shadow-md" />
                    </div>

                    <h1 className="text-4xl font-black text-white mb-4 tracking-tight drop-shadow-lg page-enter" style={{ animationDelay: '100ms' }}>Mobiqo</h1>
                    <p className="text-lg text-blue-50/90 font-medium leading-relaxed drop-shadow-md page-enter" style={{ animationDelay: '200ms' }}>
                        Tech-Driven Electronics Advisory & Secure Warranty Management
                    </p>

                    <div className="grid grid-cols-3 gap-6 mt-16 pt-12 border-t border-white/10 page-enter" style={{ animationDelay: '300ms' }}>
                        <div>
                            <p className="text-2xl font-black text-white">256-bit</p>
                            <p className="text-[10px] uppercase tracking-widest text-blue-100/70 font-bold mt-1">Encryption</p>
                        </div>
                        <div className="border-x border-white/10">
                            <p className="text-2xl font-black text-white">24/7</p>
                            <p className="text-[10px] uppercase tracking-widest text-blue-100/70 font-bold mt-1">Monitoring</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">99.9%</p>
                            <p className="text-[10px] uppercase tracking-widest text-blue-100/70 font-bold mt-1">Uptime</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                <div className="absolute top-6 right-6">
                    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                        <span className="material-symbols-outlined font-variation-fill">dark_mode</span>
                    </button>
                </div>

                <div className="w-full max-w-md page-enter">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl p-3 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-3xl">shield_person</span>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
                    <p className="text-slate-500 font-medium mb-8">Sign in to manage your warranties and devices.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm font-bold">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="EMAIL ADDRESS"
                                className="w-full py-4 px-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12"
                            />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="PASSWORD"
                                className="w-full py-4 px-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12"
                            />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl cursor-pointer hover:text-slate-600">visibility_off</span>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => onNavigate('forgot-password')}
                                className="text-sm font-bold text-primary hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#1f93f6] hover:bg-[#157ad2] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 btn-press disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Login
                                    <span className="material-symbols-outlined text-sm">login</span>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-slate-500">
                        Don't have an account?{' '}
                        <button onClick={() => onNavigate('register')} className="font-bold text-[#1f93f6] hover:underline">
                            Sign Up
                        </button>
                    </p>

                    <div className="mt-12 flex justify-center gap-6 text-xs text-slate-400 font-medium">
                        <a href="#" className="hover:text-slate-600">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-600">Terms of Service</a>
                        <a href="#" className="hover:text-slate-600">Support</a>
                    </div>
                </div>
            </div>
        </main>
    );
}