import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';

interface AdminDashboardProps {
    onNavigate: (page: any, data?: any) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
    const [stats, setStats] = useState<any>({ total_users: '0', active_warranties: '0', pending_claims: '0', revenue: '₹0' });
    const [recentClaims, setRecentClaims] = useState<any[]>([]);
    const [trendingQueries, setTrendingQueries] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboard = async () => {
            const token = localStorage.getItem('jwt_token');
            if (!token) return;
            try {
                const res = await fetch('/api/admin/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.status === 'success') {
                    setStats(data.stats);
                    setRecentClaims(data.recent_claims || []);
                    setTrendingQueries(data.trending_queries || []);
                }
            } catch (err) {
                console.error("Dashboard failed", err);
            } finally {
                // Done
            }
        };
        fetchDashboard();
    }, []);

    const statCards = [
        { label: 'TOTAL USERS', value: stats.total_users, change: '+5.2%', icon: 'group', color: 'blue' },
        { label: 'ACTIVE WARRANTIES', value: stats.active_warranties, change: '+12.4%', icon: 'verified_user', color: 'primary' },
        { label: 'PENDING CLAIMS', value: stats.pending_claims, change: '-2.1%', icon: 'assignment_late', color: 'orange' },
        { label: 'REVENUE', value: stats.revenue, change: '+8.7%', icon: 'payments', color: 'emerald' },
    ];

    return (
        <AdminLayout activeTab="dashboard" onNavigate={onNavigate}>
            {/* Page header — stacks on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-10">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Admin Control Center</h1>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Global operations and warranty surveillance dashboard.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                        <span className="material-symbols-outlined text-xl">file_download</span>
                        Export
                    </button>
                    <button className="flex-1 sm:flex-none px-4 py-2.5 bg-primary rounded-xl text-sm font-black text-white hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-xl">add_circle</span>
                        New Claim
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                {statCards.map((stat, i) => (
                    <div key={i} className="group bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{stat.label}</span>
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors flex-shrink-0`}>
                                <span className="material-symbols-outlined text-base md:text-xl font-variation-fill">{stat.icon}</span>
                            </div>
                        </div>
                        <div className="flex items-end gap-2 text-2xl md:text-3xl font-black text-slate-900 leading-none">
                            {stat.value}
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                            <span className={`text-[10px] font-black ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                <span className="material-symbols-outlined text-xs inline-block translate-y-0.5">{stat.change.startsWith('+') ? 'trending_up' : 'trending_down'}</span>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                {/* Recent Warranty Claims */}
                <div className="xl:col-span-2 bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="px-5 md:px-8 py-4 md:py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="text-base md:text-xl font-black text-slate-900">Recent Warranty Claims</h2>
                        <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#f8fafc] border-b border-slate-100">
                                <tr>
                                    <th className="px-5 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                    <th className="px-4 md:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Device</th>
                                    <th className="px-4 md:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-4 md:px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Date</th>
                                    <th className="px-5 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentClaims.map((claim, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                        <td className="px-5 md:px-8 py-4 md:py-5">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xs flex-shrink-0">
                                                    {claim.user_name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <span className="text-xs md:text-sm font-bold text-slate-700 leading-tight">{claim.user_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 md:py-5 text-sm font-bold text-slate-600 hidden sm:table-cell">{claim.device}</td>
                                        <td className="px-4 md:px-6 py-4 md:py-5">
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${claim.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                claim.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 md:py-5 text-sm font-bold text-slate-500 hidden sm:table-cell">{claim.date}</td>
                                        <td className="px-5 md:px-8 py-4 md:py-5">
                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100">
                                                <span className="material-symbols-outlined text-xl">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6 md:space-y-8 flex flex-col">
                    {/* AI Analytics Insight */}
                    <div className="bg-primary rounded-[24px] md:rounded-[32px] p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 md:mb-8 border border-white/30 backdrop-blur-sm self-center">
                            <span className="material-symbols-outlined font-variation-fill text-2xl md:text-3xl">psychology</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-black mb-6 md:mb-10">AI Analytics Insight</h3>

                        <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-6 md:mb-10">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="50%" cy="50%" r="44%" strokeWidth="12" stroke="currentColor" fill="transparent" className="text-white/20" />
                                <circle cx="50%" cy="50%" r="44%" strokeWidth="12" stroke="currentColor" fill="transparent"
                                    strokeDasharray={2 * Math.PI * 88}
                                    strokeDashoffset={2 * Math.PI * 88 * (1 - 0.75)}
                                    className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <div className="text-3xl md:text-4xl font-black leading-none">75%</div>
                                <div className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Mobile</div>
                            </div>
                        </div>

                        <p className="text-xs md:text-sm font-medium text-white/80 leading-relaxed max-w-[280px] mx-auto">
                            Mobile devices represent the highest volume of warranty activations this quarter. Claim frequency is down by 4%.
                        </p>
                    </div>

                    {/* Top Trending Queries */}
                    <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 md:mb-8">
                            <span className="material-symbols-outlined text-primary font-variation-fill">trending_up</span>
                            <h2 className="text-base md:text-lg font-black text-slate-900">Top Trending Queries</h2>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                            {trendingQueries.map((q, i) => (
                                <div key={i} className="flex items-center justify-between gap-2">
                                    <span className="text-xs md:text-sm font-bold text-slate-600 truncate">{q.query}</span>
                                    <span className="bg-slate-100 text-primary px-3 py-1 rounded-lg text-[11px] font-black tracking-wider shadow-sm border border-white flex-shrink-0">
                                        {q.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
