import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';

interface AdminUserManagementProps {
    onNavigate: (page: any, data?: any) => void;
}

export function AdminUserManagement({ onNavigate }: AdminUserManagementProps) {
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ total_active_users: '0', premium_accounts: '0', premium_percentage: '0%', warranty_claims_mtd: '0', new_devices_24h: '0' });
    
    // 1. Added state for the search query
    const [searchQuery, setSearchQuery] = useState('');

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

    // 2. Filter logic: Checks if the search query is in the user's name or email
    const filteredUsers = users.filter((u) => {
        const query = searchQuery.toLowerCase();
        return (
            (u.full_name && u.full_name.toLowerCase().includes(query)) ||
            (u.email && u.email.toLowerCase().includes(query))
        );
    });

    const statCards = [
        { label: 'TOTAL ACTIVE USERS', value: stats.total_active_users, change: '+12%', color: 'blue' },
        { label: 'PREMIUM ACCOUNTS', value: stats.premium_accounts, subtext: `${stats.premium_percentage} total`, color: 'primary' },
        { label: 'WARRANTY CLAIMS (MTD)', value: stats.warranty_claims_mtd, subtext: 'Avg. 2.1 days', color: 'orange' },
        { label: 'NEW DEVICES (24H)', value: stats.new_devices_24h, subtext: 'Peak 14:00', color: 'emerald' },
    ];

    return (
        <AdminLayout activeTab="users" onNavigate={onNavigate}>
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-10">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">User Management</h1>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Manage and monitor user accounts, devices, and warranty status.</p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[110px] md:min-h-[140px]">
                        <div>
                            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{stat.label}</span>
                            <div className="flex items-end gap-2 text-2xl md:text-3xl font-black text-slate-900 mt-2 leading-none">
                                {stat.value}
                                {stat.change && <span className="text-xs font-black text-emerald-500 mb-1">{stat.change}</span>}
                            </div>
                        </div>
                        {stat.subtext && <p className="text-[10px] font-bold text-primary tracking-widest uppercase mt-3 md:mt-4">{stat.subtext}</p>}
                    </div>
                ))}
            </div>

            {/* Main Users Table container */}
            <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                {/* Search toolbar */}
                <div className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-100 flex items-center bg-white">
                    <div className="relative w-full sm:w-72 md:w-96">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} // 3. Bound input to state
                            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all"
                        />
                    </div>
                </div>

                {/* ── Desktop table (md+) ── */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#f8fafc] border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Devices</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Warranties</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => ( // 4. Mapping over filteredUsers instead of users
                                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm">
                                                    {u.full_name ? u.full_name.split(' ').map((n: any) => n[0]).join('') : 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 leading-tight">{u.full_name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Joined {u.reg_date?.split(', ')[1] || '2024'}</p>
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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-slate-500 font-medium">
                                        No users found matching "{searchQuery}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Mobile card list (< md) ── */}
                <div className="md:hidden divide-y divide-slate-100">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => ( // 4. Mapping over filteredUsers instead of users
                            <div key={u.id} className="px-4 py-4 flex items-center gap-3">
                                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm flex-shrink-0">
                                    {u.full_name ? u.full_name.split(' ').map((n: any) => n[0]).join('') : 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-black text-slate-800 truncate">{u.full_name}</p>
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex-shrink-0 ${u.is_blocked ? 'bg-rose-100 text-rose-700' :
                                            (u.account_status || 'Standard') === 'Premium' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {u.is_blocked ? 'Suspended' : (u.account_status || 'Standard')}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{u.email}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{u.total_warranties} Devices</span>
                                        <span className="text-[10px] font-bold text-primary bg-blue-50 px-2 py-0.5 rounded-md">{u.active_warranties || u.total_warranties || 0} Active</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-12 text-center text-slate-500 font-medium">
                            No users found matching "{searchQuery}"
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="px-4 md:px-8 py-4 md:py-6 border-t border-slate-100 bg-[#f8fafc]/30 flex items-center justify-between gap-4">
                    {/* Updated to show filtered count */}
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block">
                        Showing {filteredUsers.length > 0 ? 1 : 0} to {filteredUsers.length} of {users.length} total users
                    </p>
                    <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
                        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-xl text-slate-400 hover:bg-white hover:text-slate-600 group" disabled>
                            <span className="material-symbols-outlined text-xl group-hover:-translate-x-0.5 transition-transform">chevron_left</span>
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center bg-primary text-white font-black text-[11px] rounded-xl shadow-lg shadow-primary/20">1</button>
                        <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-black text-[11px] rounded-xl hover:border-primary/30 transition-all">2</button>
                        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-xl text-slate-700 hover:bg-white hover:text-primary transition-all group">
                            <span className="material-symbols-outlined text-xl group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}