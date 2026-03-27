import { useEffect } from 'react';

interface PrivacySecurityProps {
    onNavigate: (page: string, data?: any) => void;
}

export function PrivacySecurity({ onNavigate }: PrivacySecurityProps) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleLogoutAll = async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;
        try {
            await fetch('/api/auth/logout-all', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            localStorage.removeItem('jwt_token');
            onNavigate('login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to permanently delete your account? All orders, warranties, and history will be wiped. This action cannot be undone.")) {
            return;
        }

        const token = localStorage.getItem('jwt_token');
        if (!token) return;
        try {
            const res = await fetch('/api/auth/delete-account', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.ok) {
                localStorage.removeItem('jwt_token');
                onNavigate('login');
            } else {
                alert("Failed to delete account. Please try again.");
            }
        } catch (err) {
            console.error('Delete account failed', err);
        }
    };

    return (
        <div className="flex-1 w-full max-w-4xl">
            <div className="mb-8">
                <button onClick={() => onNavigate('profile')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4 text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    SETTINGS
                </button>
                <h1 className="text-3xl md:text-4xl font-black text-[#141b2d] leading-tight">Privacy & Security</h1>
                <p className="text-slate-500 mt-2 text-[15px] font-medium max-w-xl leading-relaxed">
                    Manage your account security preferences, data privacy settings, and active sessions to keep your Mobiqo electronics profile safe.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Left Column */}
                <div className="flex-1 flex flex-col gap-6">

                    {/* Account Security Card */}
                    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100 relative">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[#1f93f6] text-[20px] font-variation-fill">verified_user</span>
                            </div>
                            <h2 className="text-[14px] font-black text-slate-500 uppercase tracking-[0.1em]">Account Security</h2>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-slate-400 font-variation-fill">lock</span>
                                    <span className="font-bold text-slate-900">Change Password</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-500 transition-colors">chevron_right</span>
                            </div>
                        </div>
                    </div>

                    {/* Data & Privacy Card */}
                    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col gap-6 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[#6366f1] text-[20px] font-variation-fill">visibility</span>
                            </div>
                            <h2 className="text-[14px] font-black text-slate-500 uppercase tracking-[0.1em]">Data & Privacy</h2>
                        </div>

                        <div className="flex flex-col">
                            <div onClick={() => onNavigate('privacy-policy')} className="flex items-center justify-between py-5 border-b border-slate-50 cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-slate-400 font-variation-fill">short_text</span>
                                    <span className="font-bold text-slate-900 group-hover:text-[#1f93f6] transition-colors">Privacy Policy</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300">open_in_new</span>
                            </div>

                            <div onClick={() => onNavigate('terms-conditions')} className="flex items-center justify-between py-5 border-b border-slate-50 cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-slate-400 font-variation-fill">description</span>
                                    <span className="font-bold text-slate-900 group-hover:text-[#1f93f6] transition-colors">Terms & Conditions</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300">open_in_new</span>
                            </div>

                            <div onClick={handleDeleteAccount} className="flex items-center justify-between py-5 cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-red-500 font-variation-fill">delete</span>
                                    <span className="font-bold text-red-500 group-hover:text-red-600 transition-colors">Delete Account</span>
                                </div>
                                <span className="material-symbols-outlined text-red-300">warning</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Session Management) */}
                <div className="w-full lg:w-80 shrink-0">
                    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col items-center relative text-center">
                        <div className="flex items-center justify-center gap-3 mb-10 w-full">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-slate-600 text-[18px]">devices</span>
                            </div>
                            <h2 className="text-[13px] font-black text-slate-500 uppercase tracking-[0.1em]">Session Management</h2>
                        </div>

                        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-[#1f93f6]">
                            <span className="material-symbols-outlined text-3xl font-variation-fill">logout</span>
                        </div>

                        <button onClick={handleLogoutAll} className="w-full py-3.5 px-4 bg-white border-2 border-[#1f93f6] text-[#1f93f6] hover:bg-[#1f93f6] hover:text-white transition-all font-bold rounded-xl text-sm mb-6">
                            LOGOUT FROM ALL DEVICES
                        </button>

                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium pb-8 border-b border-slate-100">
                            This will end all current sessions. You will need to log back in on all platforms to access your Mobiqo account.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}