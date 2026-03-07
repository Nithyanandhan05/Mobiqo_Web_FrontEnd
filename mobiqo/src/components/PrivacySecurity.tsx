import { useState, useEffect } from 'react';

interface PrivacySecurityProps {
    onNavigate: (page: string, data?: any) => void;
}

interface PrivacySetting {
    two_factor_auth: boolean;
    biometric_login: boolean;
    data_sharing: boolean;
    profile_visibility: string;
}

export function PrivacySecurity({ onNavigate }: PrivacySecurityProps) {
    const [settings, setSettings] = useState<PrivacySetting>({
        two_factor_auth: false,
        biometric_login: true,
        data_sharing: true,
        profile_visibility: 'Public'
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;
        try {
            const res = await fetch('/api/privacy_settings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') {
                    setSettings(data.settings);
                }
            }
        } catch (err) {
            console.error('Failed to fetch settings', err);
        }
    };

    const toggleSetting = async (key: keyof PrivacySetting) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);

        const token = localStorage.getItem('jwt_token');
        if (!token) return;
        try {
            await fetch('/api/privacy_settings', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSettings)
            });
        } catch (err) {
            console.error('Failed to update setting', err);
            // Revert back if fail
            setSettings(settings);
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
                            <div className="flex items-center justify-between pb-6 border-b border-slate-50 cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-slate-400 font-variation-fill">lock</span>
                                    <span className="font-bold text-slate-900">Change Password</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-500 transition-colors">chevron_right</span>
                            </div>

                            <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-slate-400 font-variation-fill mt-1">security</span>
                                    <div>
                                        <h3 className="font-bold text-slate-900 leading-snug">Two-Factor Authentication</h3>
                                        <p className="text-[13px] text-slate-500 mt-1">Add an extra layer of security to your account</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleSetting('two_factor_auth')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.two_factor_auth ? 'bg-[#1f93f6]' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.two_factor_auth ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-slate-400 font-variation-fill mt-1">fingerprint</span>
                                    <div>
                                        <h3 className="font-bold text-slate-900 leading-snug">Biometric Login</h3>
                                        <p className="text-[13px] text-slate-500 mt-1">Use FaceID or Fingerprint for faster access</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleSetting('biometric_login')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.biometric_login ? 'bg-[#1f93f6]' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.biometric_login ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
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
                            <div className="flex items-center justify-between py-5 border-b border-slate-50 cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-slate-400 font-variation-fill">short_text</span>
                                    <span className="font-bold text-slate-900 group-hover:text-[#1f93f6] transition-colors">Privacy Policy</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300">open_in_new</span>
                            </div>

                            <div className="flex items-center justify-between py-5 border-b border-slate-50 cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-slate-400 font-variation-fill">description</span>
                                    <span className="font-bold text-slate-900 group-hover:text-[#1f93f6] transition-colors">Terms & Conditions</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300">open_in_new</span>
                            </div>

                            <div className="flex items-center justify-between py-5 cursor-pointer group">
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

                        <button className="w-full py-3.5 px-4 bg-white border-2 border-[#1f93f6] text-[#1f93f6] hover:bg-[#1f93f6] hover:text-white transition-all font-bold rounded-xl text-sm mb-6">
                            LOGOUT FROM ALL DEVICES
                        </button>

                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium pb-8 border-b border-slate-100">
                            This will end all current sessions except for this device. You will need to log back in on other devices to access your Mobiqo account.
                        </p>

                        <div className="w-full text-left pt-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Current Session</h3>
                            <div className="flex items-center gap-3">
                                <div className="text-[#1f93f6]">
                                    <span className="material-symbols-outlined text-2xl font-variation-fill">laptop_mac</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">MacBook Pro (M2 Max)</h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">London, UK • Active Now</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
