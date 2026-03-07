import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';

interface AdminUserManagementProps {
    onNavigate: (page: any, data?: any) => void;
}

export function AdminUserManagement({ onNavigate }: AdminUserManagementProps) {
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ total_active_users: '0', premium_accounts: '0', premium_percentage: '0%', warranty_claims_mtd: '0', new_devices_24h: '0' });

    const fetchUsers = async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;
        try {
            const res = await fetch('/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') {
                const fetchedUsers = data.users || [];
                setUsers(fetchedUsers);

                // Provide robust fallbacks if the backend doesn't supply 'stats' yet to prevent crashes
                if (data.stats) {
                    setStats(data.stats);
                } else {
                    const activeCount = fetchedUsers.filter((u: any) => !u.is_blocked).length;
                    setStats({
                        total_active_users: activeCount.toString(),
                        premium_accounts: '0',
                        premium_percentage: '0%',
                        warranty_claims_mtd: '0',
                        new_devices_24h: '0'
                    });
                }
            }
        } catch (err) {
            console.error("Users failed", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleBlock = async (userId: number) => {
        const token = localStorage.getItem('jwt_token');
        try {
            const res = await fetch(`/api/admin/users/${userId}/toggle_block`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') {
                fetchUsers();
            }
        } catch (err) {
            console.error("Toggle block failed", err);
        }
    };

    const statCards = [
        { label: 'TOTAL ACTIVE USERS', value: stats.total_active_users, change: '+12%', color: 'blue' },
        { label: 'PREMIUM ACCOUNTS', value: stats.premium_accounts, subtext: `${stats.premium_percentage} total`, color: 'primary' },
        { label: 'WARRANTY CLAIMS (MTD)', value: stats.warranty_claims_mtd, subtext: 'Avg. 2.1 days', color: 'orange' },
        { label: 'NEW DEVICES (24H)', value: stats.new_devices_24h, subtext: 'Peak 14:00', color: 'emerald' },
    ];

    return (
        <AdminLayout activeTab="users" onNavigate={onNavigate}>
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Management</h1>
                    <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Manage and monitor user accounts, devices, and electronics warranty status.</p>
                </div>
                <button className="px-5 py-2.5 bg-primary rounded-xl text-sm font-black text-white hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-xl">person_add</span>
                    Add New User
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[140px]">
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                            <div className="flex items-end gap-3 text-3xl font-black text-slate-900 mt-2 leading-none">
                                {stat.value}
                                {stat.change && <span className="text-xs font-black text-emerald-500 mb-1">{stat.change}</span>}
                            </div>
                        </div>
                        {stat.subtext && <p className="text-[11px] font-bold text-primary tracking-widest uppercase mt-4">{stat.subtext}</p>}
                    </div>
                ))}
            </div>

            {/* Main Users Table */}
            <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky left-0">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                            <input
                                type="text"
                                placeholder="Search by name, email, or device ID..."
                                className="w-96 h-11 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 overflow-x-auto">
                            <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white text-slate-700 shadow-sm border border-slate-200">Account Type: All</button>
                            <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white hover:text-slate-700 transition-all">Status: Active</button>
                            <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white hover:text-slate-700 transition-all">Region: Global</button>
                        </div>
                    </div>
                    <button className="w-11 h-11 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-primary transition-all">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#f8fafc] border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Devices</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Warranties</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm">
                                                {u.full_name.split(' ').map((n: any) => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 leading-tight">{u.full_name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Joined {u.reg_date.split(', ')[1] || '2024'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-slate-500">{u.email}</td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 border border-slate-200">
                                            {u.total_warranties} Devices
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1.5 bg-blue-50 text-primary rounded-lg text-[10px] font-black border border-blue-100">
                                            {u.active_warranties || u.total_warranties || 0} Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.is_blocked ? 'bg-rose-100 text-rose-700' :
                                            (u.account_status || 'Standard') === 'Premium' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {u.is_blocked ? 'Suspended' : (u.account_status || 'Standard')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all hover:text-slate-600 outline-none">
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </button>
                                            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all hover:text-slate-600 outline-none px-3">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button
                                                onClick={() => toggleBlock(u.id)}
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${u.is_blocked ? 'text-emerald-500 hover:bg-emerald-50' : 'text-rose-500 hover:bg-rose-50'
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined text-lg">{u.is_blocked ? 'check_circle' : 'block'}</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-6 border-t border-slate-100 bg-[#f8fafc]/30 flex items-center justify-between">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Showing 1 to {users.length} of {users.length * 10} users</p>
                    <div className="flex items-center gap-1.5">
                        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-xl text-slate-400 hover:bg-white hover:text-slate-600 group" disabled>
                            <span className="material-symbols-outlined text-xl group-hover:-translate-x-0.5 transition-transform">chevron_left</span>
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center bg-primary text-white font-black text-[11px] rounded-xl shadow-lg shadow-primary/20">1</button>
                        <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-black text-[11px] rounded-xl hover:border-primary/30 transition-all">2</button>
                        <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-black text-[11px] rounded-xl hover:border-primary/30 transition-all">3</button>
                        <span className="px-2 text-slate-300">...</span>
                        <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-black text-[11px] rounded-xl hover:border-primary/30 transition-all">25</button>
                        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-xl text-slate-700 hover:bg-white hover:text-primary transition-all group">
                            <span className="material-symbols-outlined text-xl group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
