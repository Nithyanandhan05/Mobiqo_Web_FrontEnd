import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';

interface AdminReportsProps {
    onNavigate: (page: any, data?: any) => void;
}

export function AdminReports({ onNavigate }: AdminReportsProps) {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('jwt_token');
            const res = await fetch('/api/admin/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setStats(data.stats);
            }
        };
        fetchStats();
    }, []);

    return (
        <AdminLayout activeTab="reports" onNavigate={onNavigate}>
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Reports</h1>
                    <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Live financial, inventory, and activity telemetry.</p>
                </div>
                <button onClick={() => window.print()} className="px-5 py-2.5 bg-primary rounded-xl text-sm font-black text-white hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-xl">file_download</span>
                    Export PDF
                </button>
            </div>

            {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                            <h3 className="text-4xl font-black text-slate-900">{stats.revenue}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Platform Users</p>
                            <h3 className="text-4xl font-black text-slate-900">{stats.total_users}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined">shopping_bag</span>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Orders Processed</p>
                            <h3 className="text-4xl font-black text-slate-900">{stats.total_orders}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined">verified_user</span>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Active Securities</p>
                            <h3 className="text-4xl font-black text-slate-900">{stats.active_warranties}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pending Claims</p>
                            <h3 className="text-4xl font-black text-slate-900">{stats.pending_claims}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined">smart_toy</span>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">AI Inferences</p>
                            <h3 className="text-4xl font-black text-slate-900">{stats.ai_searches}</h3>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[32px] p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
                    <span className="material-symbols-outlined text-primary text-4xl animate-spin mb-4">refresh</span>
                    <p className="text-sm font-bold text-slate-500">Compiling dataset...</p>
                </div>
            )}
        </AdminLayout>
    );
}
