import { useState, useEffect } from 'react';
import { getHDImage } from '../utils/imageHelper';

interface WarrantyDevice {
    id?: number;
    device_name?: string;
    model_number?: string;
    purchase_date?: string;
    warranty_expiry?: string;
    status?: string;
    image_url?: string;
}

interface WarrantyMainProps {
    onNavigate?: (page: any, data?: any) => void;
}

export function WarrantyMain({ onNavigate }: WarrantyMainProps) {
    const [warranties, setWarranties] = useState<WarrantyDevice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWarranties = async () => {
            try {
                const token = localStorage.getItem('jwt_token');
                if (token) {
                    const res = await fetch('/api/my_warranties', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        // --- FIXED: Now it accepts an empty array as a valid response ---
                        if (data.status === 'success' && Array.isArray(data.devices)) {
                            const mappedWarranties = data.devices.map((d: any) => ({
                                id: d.id,
                                device_name: d.name,
                                warranty_expiry: d.expiry,
                                status: d.status,
                                image_url: d.image_url || '',
                            }));
                            setWarranties(mappedWarranties);
                            setLoading(false);
                            return; // Stop execution so it doesn't hit the fallback
                        }
                    }
                }
            } catch (err) { 
                console.error("Error fetching warranties:", err);
            }

            // Fallback will ONLY trigger if the network request physically fails or token is missing
            setWarranties([]);
            setLoading(false);
        };

        fetchWarranties();
    }, []);

    const activeCount = warranties.filter(w => w.status === 'Active' || w.status === 'Secure').length;
    const expiredCount = warranties.filter(w => w.status === 'Expired' || w.status === 'Rejected').length;
    const expiringCount = warranties.filter(w => {
        if (!w.warranty_expiry) return false;
        const days = Math.ceil((new Date(w.warranty_expiry).getTime() - Date.now()) / 86400000);
        return days > 0 && days <= 30;
    }).length;

    const getDaysLeft = (expiry?: string) => {
        if (!expiry) return -1;
        return Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000);
    };

    const getStatusColor = (status?: string) => {
        const s = (status || '').toLowerCase();
        if (s === 'active' || s === 'secure') return 'bg-emerald-100 text-emerald-700';
        if (s === 'expired' || s === 'rejected') return 'bg-red-100 text-red-600';
        return 'bg-amber-100 text-amber-700';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">My Warranties</h1>
                    <p className="text-slate-500 text-sm font-medium mt-0.5">Track and manage all your device warranties</p>
                </div>
                <button
                    onClick={() => onNavigate && onNavigate('warranty-register')}
                    className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all text-sm btn-press"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    <span className="hidden sm:inline">Register Warranty</span>
                    <span className="sm:hidden">Register</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Devices', value: warranties.length, icon: 'devices', color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Active', value: activeCount, icon: 'verified_user', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Expiring Soon', value: expiringCount, icon: 'schedule', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Expired', value: expiredCount, icon: 'cancel', color: 'text-red-500', bg: 'bg-red-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm">
                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                            <span className={`material-symbols-outlined font-variation-fill ${stat.color}`}>{stat.icon}</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Device List */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-black text-slate-900">Registered Devices</h2>
                </div>

                {loading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : warranties.length === 0 ? (
                    <div className="text-center py-16 px-6">
                        <span className="material-symbols-outlined text-5xl text-slate-200 font-variation-fill block mb-3">verified_user</span>
                        <h3 className="font-bold text-slate-900 mb-1">No warranties registered</h3>
                        <p className="text-slate-500 text-sm mb-5">Register your first device to start tracking warranty coverage.</p>
                        <button
                            onClick={() => onNavigate && onNavigate('warranty-register')}
                            className="bg-primary text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all text-sm"
                        >
                            Register a Device
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {warranties.map((w) => {
                            const daysLeft = getDaysLeft(w.warranty_expiry);
                            return (
                                <div key={w.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                                        <img
                                            src={getHDImage(w.image_url, w.device_name || '')}
                                            alt={w.device_name}
                                            className="w-full h-full object-contain p-1"
                                            onError={(e) => { (e.target as HTMLImageElement).src = `https://tse1.mm.bing.net/th?q=${encodeURIComponent((w.device_name || 'smartphone').split('(')[0].trim() + ' smartphone')}&w=200&h=200&c=7&rs=1`; }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="font-bold text-slate-900 truncate">{w.device_name}</h3>
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${getStatusColor(w.status)}`}>
                                                {w.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium">Model: {w.model_number || 'N/A'}</p>
                                        {daysLeft > 0 ? (
                                            <p className="text-xs font-bold text-emerald-600 mt-0.5">{daysLeft} days remaining</p>
                                        ) : (
                                            <p className="text-xs font-bold text-red-500 mt-0.5">Expired</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => onNavigate && onNavigate('warranty-detail', w)}
                                            className="px-4 py-2 text-xs font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => onNavigate && onNavigate('warranty-claim', w)}
                                            className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                                        >
                                            Claim
                                        </button>
                                        <button
                                            onClick={() => onNavigate && onNavigate('warranty-extend', w)}
                                            className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                                        >
                                            Extend
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}