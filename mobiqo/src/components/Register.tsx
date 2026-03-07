import { useState } from 'react';

interface RegisterProps {
    onNavigate: (page: 'home' | 'login' | 'cart' | 'compare' | 'warranty', data?: any) => void;
    onLoginSuccess: (token: string, userName: string, email: string) => void;
}

export function Register({ onNavigate, onLoginSuccess }: RegisterProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!fullName || !email || !mobile || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!agreed) {
            setError('You must agree to the terms and conditions.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: fullName, email, mobile, password })
            });

            const data = await res.json();
            if (res.ok && data.status === 'success') {
                // Now automatically log them in
                const loginRes = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const loginData = await loginRes.json();

                if (loginRes.ok && loginData.status === 'success') {
                    onLoginSuccess(loginData.token, loginData.user_name, email);
                } else {
                    // Fail fallback to login page
                    onNavigate('login');
                }
            } else {
                setError(data.message || 'Registration failed.');
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
                        Join Our Enterprise Network & Secure Your Devices Today
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

            {/* Right Panel - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto max-h-screen">
                <div className="absolute top-6 right-6">
                    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                        <span className="material-symbols-outlined font-variation-fill">dark_mode</span>
                    </button>
                </div>

                <div className="w-full max-w-md page-enter py-12">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl p-3 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-3xl">shield_person</span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-[#1f93f6] mb-2">Create Account</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Join our Enterprise Network</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm font-bold">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="FULL NAME"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#1f93f6]/20 focus:border-[#1f93f6] transition-all"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="EMAIL ADDRESS"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#1f93f6]/20 focus:border-[#1f93f6] transition-all"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="MOBILE NUMBER"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#1f93f6]/20 focus:border-[#1f93f6] transition-all"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="PASSWORD"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#1f93f6]/20 focus:border-[#1f93f6] transition-all pr-12"
                            />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl cursor-pointer">visibility_off</span>
                        </div>
                        {password && (
                            <div className="flex items-center gap-2 mt-2 px-2">
                                <div className="h-1 flex-1 bg-purple-500 rounded-full"></div>
                                <div className="h-1 flex-1 bg-purple-100 rounded-full"></div>
                                <div className="h-1 flex-1 bg-purple-100 rounded-full"></div>
                                <span className="text-xs text-slate-400 font-medium">Password strength: Moderate</span>
                            </div>
                        )}

                        <div className="relative">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="CONFIRM PASSWORD"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#1f93f6]/20 focus:border-[#1f93f6] transition-all pr-12"
                            />
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl cursor-pointer">visibility_off</span>
                        </div>

                        <div className="flex items-start gap-3 mt-4 px-2">
                            <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="peer w-5 h-5 appearance-none rounded border-2 border-slate-300 checked:bg-[#1f93f6] checked:border-[#1f93f6] transition-colors cursor-pointer"
                                />
                                <span className="material-symbols-outlined absolute pointer-events-none text-white text-sm scale-0 peer-checked:scale-100 font-variation-fill transition-transform">check</span>
                            </div>
                            <p className="text-sm font-bold text-slate-700">
                                I agree to the <a href="#" className="text-[#1f93f6] hover:underline">Terms & Conditions</a> and <a href="#" className="text-[#1f93f6] hover:underline">Privacy Policy</a>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 py-4 bg-[#1f93f6] hover:bg-[#157ad2] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 btn-press disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-slate-500">
                        Already have an account?{' '}
                        <button onClick={() => onNavigate('login')} className="font-bold text-[#1f93f6] hover:underline">
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </main>
    );
}
