import React, { useEffect, useState } from 'react';

export type ProfileTab = 'dashboard' | 'orders' | 'warranty' | 'addresses' | 'payment' | 'notifications' | 'privacy';

interface ProfileLayoutProps {
    activeTab: ProfileTab;
    onNavigate: (page: string, data?: any) => void;
    children: React.ReactNode;
}

export function ProfileLayout({ activeTab, onNavigate, children }: ProfileLayoutProps) {
    const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('jwt_token');
            if (!token) return;
            try {
                const res = await fetch('/api/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'success') {
                        setProfile(data.profile);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch profile', err);
            }
        };
        fetchProfile();
    }, []);

    const name = profile?.full_name || localStorage.getItem('userName') || 'Mobiqo User';
    const email = profile?.email || 'user@example.com';
    const initials = name.substring(0, 2).toUpperCase();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', action: () => onNavigate('profile') },
        { id: 'orders', label: 'My Orders', icon: 'shopping_bag', action: () => onNavigate('orders') },
        { id: 'warranty', label: 'Warranty', icon: 'security', action: () => onNavigate('warranty') },
        { id: 'addresses', label: 'Addresses', icon: 'location_on', action: () => onNavigate('addresses') },
        { id: 'payment', label: 'Payment', icon: 'credit_card', action: () => { } },
        { id: 'notifications', label: 'Alerts', icon: 'notifications', action: () => onNavigate('notifications') },
        { id: 'privacy', label: 'Privacy', icon: 'lock', action: () => onNavigate('privacy') },
    ];

    return (
        <main className="flex-1 bg-slate-50 min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 sm:gap-8">

                {/* ── MOBILE: Compact user strip + horizontal tab bar ── */}
                <div className="md:hidden flex flex-col gap-3">
                    {/* User strip */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#1f93f6] flex items-center justify-center text-white text-lg font-black flex-shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-slate-900 truncate">{name}</p>
                            <p className="text-xs text-slate-500 truncate">{email}</p>
                        </div>
                        <span className="bg-[#1f93f6]/10 text-[#1f93f6] text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0">
                            AI MEMBER
                        </span>
                    </div>

                    {/* Horizontal scrollable tab bar */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                        <div className="flex min-w-max px-2 py-2 gap-1">
                            {menuItems.map(item => {
                                const isActive = item.id === activeTab;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={item.action}
                                        className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all min-w-[64px] ${isActive
                                                ? 'bg-[#1f93f6]/10 text-[#1f93f6]'
                                                : 'text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                        <span className="text-[10px] font-bold leading-none text-center">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── DESKTOP: Left Sidebar ── */}
                <aside className="hidden md:flex w-80 flex-shrink-0 flex-col gap-6">
                    {/* User Profile Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
                        <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-[#1f93f6]/10 to-transparent"></div>

                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-[#1f93f6] flex items-center justify-center text-white text-3xl font-black mb-3">
                                {initials}
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#1f93f6] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                                AI MEMBER
                            </div>
                        </div>

                        <h2 className="mt-6 text-xl font-black text-slate-900">{name}</h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">{email}</p>
                    </div>

                    {/* Navigation Menu */}
                    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col gap-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2 mt-2">Quick Access</h3>
                        {menuItems.map(item => {
                            const isActive = item.id === activeTab || (item.id === 'dashboard' && activeTab === 'dashboard');
                            return (
                                <button
                                    key={item.id}
                                    onClick={item.action}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${isActive
                                        ? 'bg-[#1f93f6]/10 text-[#1f93f6]'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* AI+ Upgrade Box */}
                    <div className="bg-gradient-to-br from-[#1f93f6] to-[#124cb1] rounded-3xl p-6 shadow-xl shadow-blue-500/20 relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className="material-symbols-outlined text-white text-2xl font-variation-fill">temp_preferences_custom</span>
                            <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">PRO</span>
                        </div>
                        <h3 className="text-white text-lg font-black relative z-10">Upgrade to AI+</h3>
                        <p className="text-blue-100 text-xs font-medium mt-2 leading-relaxed relative z-10">
                            Get unlimited warranty checks and real-time support tracking.
                        </p>
                        <button className="w-full mt-6 py-3 bg-white text-[#1f93f6] font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-shadow relative z-10">
                            Explore Benefits
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 flex flex-col gap-4 sm:gap-6">
                    {children}
                </div>
            </div>
        </main>
    );
}
