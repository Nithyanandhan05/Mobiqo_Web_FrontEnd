import { useState } from 'react';
import { validateEmail, validatePassword } from '../utils/validation';

interface ForgotPasswordProps {
    onNavigate: (page: 'home' | 'login' | 'register', data?: any) => void;
}

export function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Form fields
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Status states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Validation States
    const emailError = validateEmail(email);
    const passwordError = validatePassword(newPassword);
    const confirmError = confirmPassword.length > 0 && confirmPassword !== newPassword ? "Passwords do not match" : null;

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (emailError || !email) {
            setError('Please enter a valid registered email address.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:5000/forgot_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() })
            });
            const data = await res.json();

            if (res.ok && data.status === 'success') {
                setSuccessMsg('A 6-digit OTP has been sent to your email.');
                setStep(2);
            } else {
                setError(data.message || 'Failed to send OTP. Is this email registered?');
            }
        } catch {
            setError('Server connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit OTP.');
            return;
        }

        setLoading(true);
        try {
            // Reusing the same verfiy-otp route used in registration since it's an OTP verification
            // Let's actually NOT do this because there is no `/api/auth/forgot-password/verify` in the backend. 
            // The backend ONLY has `/forgot_password` (sends OTP) and `/reset_password` (verifies OTP + changes password at the same time).
            // Wait, looking closely at app.py, the /reset_password endpoint expects:
            // email, otp, new_password

            // So step 2 in UI just needs to visually transition to step 3 after they've typed 6 digits.
            // We don't actually hit the backend in step 2.

            setSuccessMsg('OTP format accepted. Please create your new password.');
            setStep(3);
            setLoading(false);
        } catch {
            setError('An error occurred.');
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (passwordError || confirmError || !newPassword || !confirmPassword) {
            setError('Please fix the password validation errors.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:5000/reset_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), otp: otp.join(''), new_password: newPassword })
            });
            const data = await res.json();

            if (res.ok && data.status === 'success') {
                setSuccessMsg('Password reset successful! Redirecting to login...');
                setTimeout(() => onNavigate('login'), 2000);
            } else {
                setError(data.message || 'Failed to reset password.');
            }
        } catch {
            setError('Server connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // OTP Input Change Handler
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus to next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) (nextInput as HTMLInputElement).focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) {
                (prevInput as HTMLInputElement).focus();
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
            }
        }
    };

    return (
        <main className="flex-1 min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden page-enter">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 z-0"></div>

                <div className="relative z-10 text-center mb-8">
                    <div className="w-14 h-14 bg-blue-50 text-[#1f93f6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl font-variation-fill">lock_reset</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Forgot Password</h2>
                    <p className="text-slate-500 text-sm mt-1">Securely reset your account access.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-xs font-bold animate-pulse-fast">
                        <span className="material-symbols-outlined text-base">error</span>
                        <span className="mt-0.5">{error}</span>
                    </div>
                )}

                {successMsg && !error && (
                    <div className="mb-6 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2 text-emerald-600 text-xs font-bold animate-pulse-fast">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        <span className="mt-0.5">{successMsg}</span>
                    </div>
                )}

                {/* STEP 1: Enter Email */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-4 page-enter">
                        <div className="relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className={`w-full py-4 px-5 bg-slate-50 border rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all ${emailError && email.length > 0 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1f93f6] focus:ring-[#1f93f6]/20'}`}
                            />
                            {emailError && email.length > 0 && <p className="text-red-500 text-xs font-bold mt-1.5 px-1">{emailError}</p>}
                        </div>

                        <button type="submit" disabled={loading || !!emailError || !email} className="w-full py-4 mt-2 bg-[#1f93f6] hover:bg-[#157ad2] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Send Verification OTP'}
                        </button>
                    </form>
                )}

                {/* STEP 2: Enter OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-6 page-enter">
                        <div className="text-center">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Enter 6-Digit OTP</label>
                            <div className="flex items-center justify-between gap-2">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        className="w-12 h-14 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1f93f6]/20 focus:border-[#1f93f6] transition-all"
                                    />
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-4 bg-[#1f93f6] hover:bg-[#157ad2] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2">
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Verify OTP'}
                        </button>

                        <div className="text-center text-xs font-semibold text-slate-500">
                            Didn't receive code? <button type="button" onClick={handleSendOtp} className="text-[#1f93f6] hover:underline">Resend</button>
                        </div>
                    </form>
                )}

                {/* STEP 3: Reset Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4 page-enter">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter strong password"
                                className={`w-full py-4 px-5 bg-slate-50 border rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all ${passwordError && newPassword.length > 0 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1f93f6] focus:ring-[#1f93f6]/20'}`}
                            />
                            {passwordError && newPassword.length > 0 && <p className="text-red-500 text-xs font-bold mt-1.5 px-1">{passwordError}</p>}
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Retype password"
                                className={`w-full py-4 px-5 bg-slate-50 border rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all ${confirmError && confirmPassword.length > 0 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-[#1f93f6] focus:ring-[#1f93f6]/20'}`}
                            />
                            {confirmError && confirmPassword.length > 0 && <p className="text-red-500 text-xs font-bold mt-1.5 px-1">{confirmError}</p>}
                        </div>

                        <button type="submit" disabled={loading || !!passwordError || !!confirmError || !newPassword} className="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                                <>Reset Password <span className="material-symbols-outlined text-sm">check_circle</span></>
                            )}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center text-sm font-semibold text-slate-500 border-t border-slate-100 pt-6 relative z-10">
                    <button onClick={() => onNavigate('login')} className="flex items-center justify-center gap-1 mx-auto hover:text-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Login
                    </button>
                </div>
            </div>
        </main>
    );
}
