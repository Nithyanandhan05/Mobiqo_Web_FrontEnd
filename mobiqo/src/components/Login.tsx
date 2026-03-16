import { useState } from 'react';

// --- STRICT REGEX ---
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@(gmail\.com|email\.com|saveetha\.com)$/;

// 🚀 THE FIX: Use localhost/127.0.0.1 for local web development so it never breaks when Wi-Fi changes!
// (Change this back to your Wi-Fi IP only if you are testing on a real mobile phone)
const API_URL = "http://127.0.0.1:5000";

interface LoginProps {
    onNavigate: (page: 'home' | 'register' | 'cart' | 'compare' | 'warranty' | 'forgot-password', data?: any) => void;
    onLoginSuccess: (token: string, userName: string, email: string) => void;
}

export function Login({ onNavigate, onLoginSuccess }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    // 🚀 DYNAMIC INSTANT VALIDATION (No state lag)
    const emailError = email.length > 0 && !EMAIL_REGEX.test(email)
        ? "Must be @gmail.com, @email.com, or @saveetha.com"
        : null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');

        if (!email || !password) {
            setApiError('Please fill in both email and password.');
            return;
        }

        if (emailError) {
            setApiError('Please fix the validation errors before submitting.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password: password.trim() })
            });

            const data = await res.json();
            if (res.ok && data.status === 'success') {
                onLoginSuccess(data.token, data.user_name, email);
            } else {
                setApiError(data.message || 'Invalid credentials.');
            }
        } catch (err) {
            setApiError('Unable to connect to server. Please check if your backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 min-h-screen bg-white flex w-full">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-[#4ea5f5] to-[#124cb1] w-1/2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <div className="relative z-10 text-center max-w-md">
                    <div className="w-40 h-40 mx-auto mb-8 bg-white/95 backdrop-blur-md rounded-3xl p-4 flex items-center justify-center shadow-2xl border border-white/20">
                        <img src="/logo.png" alt="Mobiqo Logo" className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4 tracking-tight drop-shadow-lg">Mobiqo</h1>
                    <p className="text-lg text-blue-50/90 font-medium leading-relaxed drop-shadow-md">
                        Tech-Driven Electronics Advisory & Secure Warranty Management
                    </p>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                <div className="w-full max-w-md">

                    {/* College Logos Row */}
                    <div className="flex justify-between items-start w-full mb-10">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQzSASJ8CW7h0pmb79FrMdRMp73kQ96SnFPg&s"
                            alt="College Logo Left"
                            className="h-14 sm:h-16 w-auto object-contain"
                        />
                        <img
                            src="https://simatscgpa.netlify.app/logo2.png"
                            alt="College Logo Right"
                            className="h-14 sm:h-16 w-auto object-contain"
                        />
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
                    <p className="text-slate-500 font-medium mb-8">Sign in to manage your warranties and devices.</p>

                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm font-bold">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* EMAIL FIELD */}
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="EMAIL ADDRESS"
                                className={`w-full py-4 px-5 bg-white border rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all pr-12 ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1f93f6] focus:ring-[#1f93f6]/20'}`}
                            />
                            <span className={`material-symbols-outlined absolute right-4 top-[22px] text-xl ${emailError ? 'text-red-400' : 'text-slate-400'}`}>mail</span>
                            {emailError && <p className="text-red-500 text-xs font-bold mt-1 px-2">{emailError}</p>}
                        </div>

                        {/* PASSWORD FIELD */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="PASSWORD"
                                className="w-full py-4 px-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1f93f6]/20 focus:border-[#1f93f6] transition-all pr-12"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="material-symbols-outlined absolute right-4 top-[22px] text-slate-400 text-xl cursor-pointer hover:text-slate-600"
                            >
                                {showPassword ? "visibility" : "visibility_off"}
                            </span>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => onNavigate('forgot-password')}
                                className="text-sm font-bold text-[#1f93f6] hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !!emailError || !email || !password}
                            className="w-full py-4 bg-[#1f93f6] hover:bg-[#157ad2] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Login"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-slate-500">
                        Don't have an account?{' '}
                        <button onClick={() => onNavigate('register')} className="font-bold text-[#1f93f6] hover:underline">
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </main>
    );
}