import { useState } from 'react';
import { validateName, validateEmail, validatePhone, validatePassword } from '../utils/validation';

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

    // UI states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    // OTP Modal States
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');

    // 🚀 DYNAMIC INSTANT VALIDATION (No lag, evaluates every keystroke)
    const nameError = validateName(fullName);
    const emailError = validateEmail(email);
    const mobileError = validatePhone(mobile);
    const passwordError = validatePassword(password);
    const confirmError = confirmPassword.length > 0 && confirmPassword !== password ? "Passwords do not match" : null;

    // Check if the whole form is perfect before allowing submission
    const isFormValid =
        fullName.length > 0 && nameError === null &&
        email.length > 0 && emailError === null &&
        mobile.length > 0 && mobileError === null &&
        password.length > 0 && passwordError === null &&
        confirmPassword === password &&
        agreed;

    // Calculate dynamic password strength exactly like Android
    const getPasswordStrength = () => {
        if (!password) return { percent: 0, color: 'bg-slate-200', text: '' };
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 25;
        if (/[@$!%*?&]/.test(password)) strength += 25;

        if (strength <= 25) return { percent: 25, color: 'bg-red-500', text: 'Weak' };
        if (strength === 50) return { percent: 50, color: 'bg-orange-500', text: 'Moderate' };
        if (strength === 75) return { percent: 75, color: 'bg-yellow-500', text: 'Good' };
        return { percent: 100, color: 'bg-green-500', text: 'Strong' };
    };

    const strengthData = getPasswordStrength();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');

        if (!isFormValid) {
            setApiError('Please fix the validation errors in the fields below.');
            return;
        }

        setLoading(true);
        try {
            // STEP 1: SEND OTP
            const res = await fetch('http://127.0.0.1:5000/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() })
            });

            const data = await res.json();
            if (res.ok && data.status === 'success') {
                setShowOtpModal(true);
                setOtpError('');
            } else {
                setApiError(data.message || 'Failed to send OTP.');
            }
        } catch (err) {
            setApiError('Unable to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setOtpError('Please enter a valid 6-digit OTP.');
            return;
        }

        setOtpLoading(true);
        setOtpError('');

        try {
            // STEP 2: VERIFY OTP
            const verifyRes = await fetch('http://127.0.0.1:5000/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), otp: otp.trim() })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.status === 'success') {
                // STEP 3: REGISTER USER
                const registerRes = await fetch('http://127.0.0.1:5000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ full_name: fullName.trim(), email: email.trim(), mobile: mobile.trim(), password })
                });

                const registerData = await registerRes.json();

                if (registerRes.ok && registerData.status === 'success') {
                    // STEP 4: AUTO LOGIN
                    const loginRes = await fetch('http://127.0.0.1:5000/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email.trim(), password })
                    });
                    const loginData = await loginRes.json();

                    if (loginRes.ok && loginData.status === 'success') {
                        setShowOtpModal(false);
                        onLoginSuccess(loginData.token, loginData.user_name, email.trim());
                    } else {
                        setShowOtpModal(false);
                        onNavigate('login');
                    }
                } else {
                    setOtpError(registerData.message || 'Registration failed.');
                }
            } else {
                setOtpError(verifyData.message || 'Invalid or expired OTP.');
            }
        } catch (err) {
            setOtpError('Unable to connect to server.');
        } finally {
            setOtpLoading(false);
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
                </div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto max-h-screen">
                <div className="w-full max-w-md py-8">

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-[#1f93f6] mb-2">Create Account</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Join our Enterprise Network</p>
                    </div>

                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm font-bold">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="FULL NAME"
                                className={`w-full bg-slate-50 border rounded-xl py-4 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${nameError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1f93f6] focus:ring-[#1f93f6]/20'}`}
                            />
                            {nameError && <p className="text-red-500 text-xs font-bold mt-1.5 px-1">{nameError}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="EMAIL ADDRESS"
                                className={`w-full bg-slate-50 border rounded-xl py-4 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1f93f6] focus:ring-[#1f93f6]/20'}`}
                            />
                            {emailError && <p className="text-red-500 text-xs font-bold mt-1.5 px-1">{emailError}</p>}
                        </div>

                        {/* Mobile */}
                        <div>
                            <input
                                type="tel"
                                value={mobile}
                                maxLength={10}
                                onChange={(e) => {
                                    // Block non-numeric typing instantly
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    setMobile(val);
                                }}
                                placeholder="MOBILE NUMBER"
                                className={`w-full bg-slate-50 border rounded-xl py-4 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${mobileError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1f93f6] focus:ring-[#1f93f6]/20'}`}
                            />
                            {mobileError && <p className="text-red-500 text-xs font-bold mt-1.5 px-1">{mobileError}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="PASSWORD"
                                    className={`w-full bg-slate-50 border rounded-xl py-4 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all pr-12 ${passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1f93f6] focus:ring-[#1f93f6]/20'}`}
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="material-symbols-outlined absolute right-4 top-[14px] text-slate-400 text-xl cursor-pointer hover:text-slate-600"
                                >
                                    {showPassword ? "visibility" : "visibility_off"}
                                </span>
                            </div>

                            {/* Dynamic Password Strength Meter */}
                            {password && (
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

                        {/* Confirm Password */}
                        <div>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="CONFIRM PASSWORD"
                                    className={`w-full bg-slate-50 border rounded-xl py-4 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all pr-12 ${confirmError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1f93f6] focus:ring-[#1f93f6]/20'}`}
                                />
                                <span
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="material-symbols-outlined absolute right-4 top-[14px] text-slate-400 text-xl cursor-pointer hover:text-slate-600"
                                >
                                    {showConfirmPassword ? "visibility" : "visibility_off"}
                                </span>
                            </div>
                            {confirmError && <p className="text-red-500 text-xs font-bold mt-1.5 px-1">{confirmError}</p>}
                        </div>

                        {/* Terms Checkbox */}
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
                            disabled={!isFormValid || loading}
                            className="w-full mt-6 py-4 bg-[#1f93f6] hover:bg-[#157ad2] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 btn-press disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* OTP Modal UI */}
            {showOtpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setShowOtpModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>

                        <div className="w-16 h-16 bg-[#1f93f6]/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <span className="material-symbols-outlined text-3xl text-[#1f93f6]">mark_email_read</span>
                        </div>

                        <h3 className="text-2xl font-black text-center text-slate-900 mb-2">Verify Email</h3>
                        <p className="text-center text-slate-500 text-sm font-medium mb-6">
                            We've sent a 6-digit verification code to <span className="font-bold text-slate-700">{email}</span>.
                        </p>

                        {otpError && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-xs font-bold">
                                <span className="material-symbols-outlined text-base">error</span>
                                {otpError}
                            </div>
                        )}

                        <div className="mb-6">
                            <input
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="ENTER 6-DIGIT OTP"
                                className="w-full text-center tracking-[0.5em] font-mono text-2xl py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-300 placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-[#1f93f6]/20 focus:border-[#1f93f6] transition-all"
                            />
                        </div>

                        <button
                            onClick={handleVerifyOtp}
                            disabled={otpLoading || otp.length !== 6}
                            className="w-full py-4 bg-[#1f93f6] hover:bg-[#157ad2] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {otpLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Verify & Register"
                            )}
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}