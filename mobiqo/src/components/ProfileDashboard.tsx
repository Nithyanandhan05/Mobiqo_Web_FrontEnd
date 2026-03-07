import { useState, useEffect } from 'react';
import { ProfileLayout } from './ProfileLayout';
import { getHDImage } from '../utils/imageHelper';

interface ProfileDashboardProps {
    onNavigate: (page: string, data?: any) => void;
}

export function ProfileDashboard({ onNavigate }: ProfileDashboardProps) {
    const [stats, setStats] = useState({ orders: 0, warranties: 0, addresses: 0, ai_uses: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [warranties, setWarranties] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('jwt_token');
            if (!token) return;
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch Stats
            try {
                const res = await fetch('/api/profile', { headers });
                const data = await res.json();
                if (data.status === 'success' && data.profile) {
                    setStats({
                        orders: data.profile.total_orders,
                        warranties: data.profile.active_warranties,
                        addresses: data.profile.saved_addresses,
                        ai_uses: data.profile.ai_searches
                    });
                }
            } catch (err) { console.error("Stats fetch failed", err); }

            // Fetch Recent Orders
            try {
                const res = await fetch('/api/my_orders', { headers });
                const data = await res.json();
                if (data.status === 'success' && data.orders) {
                    const normalized = data.orders.slice(0, 2).map((o: any) => ({
                        id: o.order_id,
                        invoice_no: o.invoice_no,
                        status: o.status,
                        order_date: o.date,
                        product: { name: o.product_name, price: o.price, image_url: o.image_url }
                    }));
                    setRecentOrders(normalized);
                }
            } catch (err) { console.error("Orders fetch failed", err); }


            // Fetch Warranties
            try {
                const res = await fetch('/api/my_warranties', { headers });
                const data = await res.json();
                if (data.status === 'success' && data.devices) {
                    setWarranties(data.devices.slice(0, 2));
                }
            } catch (err) { console.error("Warranties fetch failed", err); }
        };
        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const statBoxes = [
        { label: 'ORDERS', value: stats.orders, color: 'text-blue-500' },
        { label: 'WARRANTIES', value: stats.warranties, color: 'text-blue-500' },
        { label: 'ADDRESSES', value: stats.addresses, color: 'text-blue-500' },
        { label: 'AI USES', value: stats.ai_uses, color: 'text-blue-500' },
    ];

    return (
        <ProfileLayout activeTab="dashboard" onNavigate={onNavigate}>
            {/* Top Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {statBoxes.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center shadow-sm border border-slate-100 flex flex-col justify-center min-h-[90px] sm:min-h-[120px]">
                        <div className={`text-3xl sm:text-5xl font-black ${stat.color}`}>{stat.value}</div>
                        <div className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 sm:mt-2">{stat.label}</div>
                    </div>
                ))}
            </div>

            {localStorage.getItem('userEmail') === 'admin@gmail.com' && (
                <div onClick={() => onNavigate('admin-dashboard')} className="bg-primary/5 border-2 border-primary/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex items-center justify-between group hover:bg-primary/10 transition-all cursor-pointer shadow-sm animate-in slide-in-from-left duration-500">
                    <div className="flex items-center gap-4 sm:gap-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform p-3 sm:p-4 flex-shrink-0">
                            <span className="material-symbols-outlined text-2xl sm:text-4xl font-variation-fill">grid_view</span>
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">Admin System Dashboard</h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 sm:mt-2 hidden sm:block">Manage global users, verify warranty claims, and audit AI recommendation logs.</p>
                            <p className="text-xs font-bold text-slate-500 mt-1 sm:hidden">Manage users & warranty claims</p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary group-hover:translate-x-2 transition-all flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl">arrow_forward_ios</span>
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-slate-900">Recent Activity</h2>
                    <button onClick={() => onNavigate('orders')} className="text-[#1f93f6] text-sm font-bold flex items-center hover:underline">
                        View All <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {recentOrders.length > 0 ? recentOrders.map(activity => {
                        const isDelivered = activity.status.toLowerCase().includes('delivered');
                        const isShipped = activity.status.toLowerCase().includes('shipped');
                        return (
                            <div key={activity.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onNavigate('order-details', activity)}>
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 text-slate-500 overflow-hidden border border-slate-100 p-1">
                                    <img
                                        src={getHDImage(activity.product?.image_url, activity.product?.name)}
                                        alt=""
                                        className="w-full h-full object-contain mix-blend-multiply"
                                        onError={(e: any) => {
                                            if (!e.target.src.includes('bing.net')) {
                                                e.target.src = 'https://cdn-icons-png.flaticon.com/512/330/330714.png';
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-black text-slate-900 truncate">{activity.product.name}</h3>
                                    <p className="text-xs font-bold text-slate-500 mt-1">Invoice #{activity.invoice_no.split('-')[1]} &bull; {formatDate(activity.order_date)}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide ${isDelivered ? 'bg-emerald-100 text-emerald-700' : isShipped ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {activity.status}
                                    </span>
                                    {isDelivered ? (
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                                            <span className="material-symbols-outlined text-sm">receipt_long</span> Invoice
                                        </button>
                                    ) : (
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1f93f6] hover:bg-[#157ad2] text-white rounded-lg text-xs font-bold transition-colors">
                                            <span className="material-symbols-outlined text-sm">local_shipping</span> Track
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    }) : (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                                <span className="material-symbols-outlined text-3xl">shopping_basket</span>
                            </div>
                            <p className="text-sm font-bold text-slate-400">No recent orders found</p>
                            <button onClick={() => onNavigate('home')} className="mt-4 text-xs font-black text-[#1f93f6] uppercase tracking-widest hover:underline">Start Shopping</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Warranties & AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Active Warranties */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-[#1f93f6] font-variation-fill">security</span>
                        <h2 className="text-lg font-black text-slate-900">Active Warranties</h2>
                    </div>

                    <div className="flex flex-col gap-6">
                        {warranties.length > 0 ? warranties.map((w, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-bold text-slate-500">{w.name}</span>
                                    <span className="text-sm font-black text-slate-900">Expires: {w.expiry}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${w.status === 'Alert' ? 'bg-red-500' : 'bg-[#1f93f6]'}`}
                                        style={{ width: w.status === 'Alert' ? '15%' : '85%' }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-6 text-center">
                                <p className="text-sm font-medium text-slate-400 italic">No active warranties found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Insights */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-purple-500 font-variation-fill">temp_preferences_custom</span>
                        <h2 className="text-lg font-black text-slate-900">AI Insights</h2>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-4">
                        <p className="text-sm font-medium text-slate-600 italic leading-relaxed">
                            "Your electronics usage has been 12% more efficient this month. You've saved 4kg of CO2 by using smart-charge mode on your tablet."
                        </p>
                    </div>
                    <button className="text-[#1f93f6] text-sm font-bold flex items-center hover:underline">
                        More Insights <span className="material-symbols-outlined text-sm ml-1">auto_awesome</span>
                    </button>
                </div>
            </div>

            {/* AI Security Banner */}
            <div className="bg-[#ecfdf5] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#a7f3d0] flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative overflow-hidden text-center sm:text-left">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-emerald-500/30 font-variation-fill">
                    <span className="material-symbols-outlined text-3xl">verified_user</span>
                </div>
                <div className="flex-1 relative z-10 text-center md:text-left">
                    <h3 className="text-emerald-900 text-lg font-black mb-1">AI Security Active</h3>
                    <p className="text-emerald-700 text-sm font-medium leading-relaxed">
                        Your personal data and payment methods are protected by industry-standard 256-bit AES encryption.
                    </p>
                </div>
                <div className="relative z-10 flex-shrink-0">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-emerald-200 shadow-sm inline-block">
                        SYSTEM SECURE
                    </span>
                </div>
            </div>
        </ProfileLayout>
    );
}
