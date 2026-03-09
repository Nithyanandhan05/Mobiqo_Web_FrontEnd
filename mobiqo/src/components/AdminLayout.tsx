import type { ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
    activeTab: 'dashboard' | 'users' | 'inventory' | 'warranties' | 'orders' | 'settings' | 'reports';
    onNavigate: (page: any) => void;
}

export function AdminLayout({ children, activeTab, onNavigate }: AdminLayoutProps) {
    const navItems = [
        { id: 'admin-dashboard', label: 'Dashboard', icon: 'dashboard', activeId: 'dashboard' },
        { id: 'admin-users', label: 'Users', icon: 'group', activeId: 'users' },
        { id: 'admin-inventory', label: 'Inventory', icon: 'inventory_2', activeId: 'inventory' },
        { id: 'admin-orders', label: 'Orders', icon: 'shopping_bag', activeId: 'orders' },
        { id: 'admin-warranties', label: 'Warranties', icon: 'verified_user', activeId: 'warranties' },
        { id: 'admin-settings', label: 'Settings', icon: 'settings', activeId: 'settings' },
    ];

    const userName = localStorage.getItem('userName') || 'Admin User';

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-4 xl:px-6 h-14 md:h-16 xl:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 lg:gap-6 xl:gap-10">
                        <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => onNavigate('home')}>
                            <div className="w-8 h-8 xl:w-10 xl:h-10 bg-white/10 rounded-xl flex items-center justify-center p-0.5 shadow-sm border border-slate-100">
                                <img src="/logo.png" alt="Mobiqo Admin" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-lg xl:text-xl font-black tracking-tight text-slate-800">Mobiqo <span className="text-primary xl:inline hidden">Admin</span></span>
                        </div>

                        {/* Desktop nav — hidden on mobile */}
                        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 xl:gap-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
                                    className={`px-2 lg:px-3 xl:px-4 py-1.5 lg:py-2 xl:py-2.5 rounded-xl text-[10px] lg:text-[11px] xl:text-sm font-bold transition-all flex items-center gap-1 xl:gap-2 whitespace-nowrap ${activeTab === item.activeId
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-base xl:text-xl">{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-5 flex-shrink-0 border-l border-slate-200 pl-3 lg:pl-6">
                        <div className="w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xs xl:text-sm border-2 border-white shadow-sm ring-1 ring-primary/20 tooltip-trigger" title={userName}>
                            {userName.charAt(0)}
                        </div>

                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}
                            className="w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:scale-105 transition-all outline-none focus:outline-none" title="Logout">
                            <span className="material-symbols-outlined text-[16px] lg:text-lg xl:text-xl">logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area — pb-20 on mobile for bottom nav */}
            <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 sm:p-6 md:p-8 pb-24 md:pb-8 animate-in fade-in duration-700">
                {children}
            </main>

            {/* Footer Status Bar — hidden on mobile */}
            <footer className="hidden md:flex bg-white border-t border-slate-200 px-8 py-4 items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        SERVER STATUS: OPERATIONAL
                    </div>
                    <div>DB LATENCY: 24MS</div>
                    <div>API V2.4.1</div>
                </div>
                <div className="flex items-center gap-6">
                    <span>© 2024 MODIQO ELECTRONICS PLATFORM</span>
                    <button className="text-primary hover:underline">SUPPORT CENTER</button>
                </div>
            </footer>

            {/* Mobile Bottom Tab Bar — visible only on mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex items-center justify-around px-1 py-2 safe-area-inset-bottom">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all min-w-0 flex-1 ${activeTab === item.activeId
                            ? 'text-primary'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-[22px] transition-all ${activeTab === item.activeId ? 'font-variation-fill' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-wider truncate w-full text-center leading-tight">
                            {item.label}
                        </span>
                        {activeTab === item.activeId && (
                            <span className="w-1 h-1 bg-primary rounded-full mt-0.5" />
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
}
