import { useState, useEffect } from 'react';

// 🚀 STRICT MOBILE IP
const API_URL = "http://10.79.196.213:5000";

// 🚀 EXACT SAME REGEX FROM ANDROID/REGISTER
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

// 🚀 NAMED EXPORT (Fixes the Vite Uncaught SyntaxError)
export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 🚀 DYNAMIC INSTANT VALIDATION
    const passwordError = newPassword.length > 0 && !PASSWORD_REGEX.test(newPassword)
        ? "8-16 chars, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Char"
        : null;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setEmail(params.get('email') || '');
        setToken(params.get('token') || '');
    }, []);

    // Calculate dynamic password strength exactly like Android
    const getPasswordStrength = () => {
        if (!newPassword) return { percent: 0, color: 'bg-slate-200', text: '' };
        let strength = 0;
        if (newPassword.length >= 8) strength += 25;
        if (/[A-Z]/.test(newPassword)) strength += 25;
        if (/\d/.test(newPassword)) strength += 25;
        if (/[@$!%*?&]/.test(newPassword)) strength += 25;

        if (strength <= 25) return { percent: 25, color: 'bg-red-500', text: 'Weak' };
        if (strength === 50) return { percent: 50, color: 'bg-orange-500', text: 'Moderate' };
        if (strength === 75) return { percent: 75, color: 'bg-yellow-500', text: 'Good' };
        return { percent: 100, color: 'bg-green-500', text: 'Strong' };
    };

    const strengthData = getPasswordStrength();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (passwordError) {
            setError("Please enter a valid, strong password.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/reset_password_with_link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, new_password: newPassword })
            });
            const data = await res.json();

            if (res.ok && data.status === 'success') {
                setMessage("Password updated successfully! You can now log in.");
                setNewPassword('');
            } else {
                setError(data.message || "Failed to reset password. Link may be expired.");
            }
        } catch (err) {
            setError("Cannot connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 w-full">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl p-3 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#1f93f6] text-3xl">lock_reset</span>
                    </div>
                </div>

                <h2 className="text-2xl font-black text-center text-slate-900 mb-6">Set New Password</h2>

                {message && <div className="p-4 bg-green-50 text-green-700 rounded-xl mb-6 text-sm font-bold text-center border border-green-200">{message}</div>}
                {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-sm font-bold text-center border border-red-200">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase tracking-wider">Account Email</label>
                        <input
                            type="text"
                            value={email}
                            disabled
                            className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl py-3 px-4 text-sm font-bold cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase tracking-wider">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new 8+ char password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={`w-full bg-white border rounded-xl py-3 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all pr-12 ${passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1f93f6] focus:ring-[#1f93f6]/20'}`}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="material-symbols-outlined absolute right-4 top-[10px] text-slate-400 text-xl cursor-pointer hover:text-slate-600"
                            >
                                {showPassword ? "visibility" : "visibility_off"}
                            </span>
                        </div>

                        {/* Dynamic Password Strength Meter */}
                        {newPassword && (
                            <div className="flex flex-col mt-2 px-2">
                                <div className="flex h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${strengthData.color} transition-all duration-500`}
                                        style={{ width: `${strengthData.percent}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-slate-500 font-bold mt-1.5">
                                    Password strength: <span className={strengthData.color.replace('bg-', 'text-')}>{strengthData.text}</span>
                                </span>
                            </div>
                        )}
                        {passwordError && <p className="text-red-500 text-xs font-bold mt-1.5 px-1">{passwordError}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !token || !email || !newPassword || passwordError !== null}
                        className="w-full mt-4 py-4 bg-[#1f93f6] hover:bg-[#157ad2] text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Save New Password"}
                    </button>

                    <a href="/" className="block text-center mt-6 text-sm text-slate-500 hover:text-[#1f93f6] font-bold transition-colors">
                        Return to Home
                    </a>
                </form>
            </div>
        </div>
    );
}