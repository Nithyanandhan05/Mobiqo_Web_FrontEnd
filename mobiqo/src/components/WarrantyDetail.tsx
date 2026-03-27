import { useState, useEffect } from 'react';
import { getHDImage } from '../utils/imageHelper';

interface WarrantyDetailData {
    id: number;
    device_name: string;
    device_type: string;
    purchase_date: string;
    expiry_date: string;
    status: string;
    progress: number;
    months_left: string;
    invoice_name: string;
    image_url?: string;
    history: { title: string; date: string; desc: string; is_last: boolean }[];
}

interface WarrantyDetailProps {
    onNavigate?: (page: 'warranty' | 'warranty-detail' | 'warranty-claim' | 'warranty-extend', data?: any) => void;
    warrantyId: number;
    device?: any;
}

export function WarrantyDetail({ onNavigate, warrantyId, device }: WarrantyDetailProps) {
    const [detail, setDetail] = useState<WarrantyDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            setError(false);
            try {
                const token = localStorage.getItem('jwt_token');
                if (token) {
                    const res = await fetch(`/api/warranties/${warrantyId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const json = await res.json();
                        // --- FIXED: Ensure it only sets data if successful ---
                        if (json.status === 'success' && json.data) {
                            setDetail(json.data);
                            setLoading(false);
                            return; 
                        }
                    }
                }
                // If it fails (e.g. 404 because you deleted it), show error state instead of fallback data
                setError(true);
                setLoading(false);
            } catch (err) { 
                setError(true);
                setLoading(false);
            }
        };
        fetchDetail();
    }, [warrantyId, device]);

    if (loading) {
        return (
            <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                    <div className="animate-pulse space-y-6">
                        <div className="h-6 bg-slate-100 rounded w-48"></div>
                        <div className="bg-white rounded-3xl p-8 border border-slate-100"><div className="h-32 bg-slate-50 rounded-2xl"></div></div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !detail) {
        return (
            <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">error_outline</span>
                <h2 className="text-xl font-bold text-slate-800">Warranty Not Found</h2>
                <p className="text-slate-500 mt-2 mb-6">This warranty record may have been deleted or does not exist.</p>
                <button onClick={() => onNavigate && onNavigate('warranty')} className="bg-primary text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary/25">
                    Go Back
                </button>
            </main>
        );
    }

    // DYNAMIC COLOR LOGIC
    const statLower = detail.status.toLowerCase();
    const isAlert = statLower.includes('alert') || statLower.includes('expiring');
    const isExpired = statLower === 'expired' || statLower === 'rejected';
    const isPending = statLower === 'pending';

    const showWarning = isAlert || isExpired;

    let badgeStyle = 'bg-emerald-50 text-emerald-600'; // Default Green
    if (showWarning) badgeStyle = 'bg-red-100 text-red-600'; // Red
    if (isPending) badgeStyle = 'bg-orange-100 text-orange-600'; // Orange

    return (
        <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <button onClick={() => onNavigate && onNavigate('warranty')} className="hover:text-primary transition-colors">
                        <span className="material-symbols-outlined font-black">arrow_back</span>
                    </button>
                    <h1 className="text-2xl font-black text-slate-900">Warranty Details</h1>
                </div>

                {/* Device Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm mb-6 page-enter">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                                src={getHDImage(detail.image_url, detail.device_name)}
                                alt={detail.device_name}
                                className="w-full h-full object-contain p-1"
                                onError={(e) => { (e.target as HTMLImageElement).src = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(detail.device_name.split('(')[0].trim() + ' smartphone')}&w=300&h=300&c=7&rs=1`; }}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-black text-slate-900">{detail.device_name}</h2>
                                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${badgeStyle}`}>
                                    {detail.status}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500">{detail.device_type}</p>
                        </div>
                    </div>
                </div>

                {/* Warranty Progress */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm mb-6 page-enter" style={{ animationDelay: '100ms' }}>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Coverage Timeline</h3>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-slate-600">{detail.purchase_date}</span>
                        <span className={`text-sm font-bold ${showWarning ? 'text-red-500' : 'text-primary'}`}>
                            {detail.months_left}
                        </span>
                        <span className="text-sm font-bold text-slate-600">{detail.expiry_date}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                        {/* Progress Bar Color Changes to Red if Alert/Expired */}
                        <div
                            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${showWarning ? 'bg-red-400' : 'bg-gradient-to-r from-primary to-emerald-400'}`}
                            style={{ width: `${Math.max(0, Math.min(100, (detail.progress || 0) * 100))}%` }}
                        ></div>
                    </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm page-enter" style={{ animationDelay: '150ms' }}>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Purchase Date</p>
                        <p className="text-lg font-black text-slate-900">{detail.purchase_date}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm page-enter" style={{ animationDelay: '200ms' }}>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Expiry Date</p>
                        <p className={`text-lg font-black ${showWarning ? 'text-red-500' : 'text-slate-900'}`}>{detail.expiry_date}</p>
                    </div>
                </div>

                {/* Invoice */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6 flex items-center justify-between page-enter" style={{ animationDelay: '250ms' }}>
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">description</span>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{detail.invoice_name}</p>
                            <p className="text-xs text-slate-400">Warranty document</p>
                        </div>
                    </div>
                    <button className="text-primary font-bold text-sm hover:underline">Download</button>
                </div>

                {/* History Timeline */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm mb-8 page-enter" style={{ animationDelay: '300ms' }}>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Warranty History</h3>
                    <div className="space-y-6">
                        {detail.history?.map((event, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-3 h-3 rounded-full ${event.is_last ? 'bg-primary' : 'bg-slate-300'}`}></div>
                                    {!event.is_last && <div className="w-0.5 flex-1 bg-slate-200 mt-1"></div>}
                                </div>
                                <div className="pb-4">
                                    <p className="text-sm font-bold text-slate-900">{event.title}</p>
                                    <p className="text-xs text-slate-400 font-medium mb-1">{event.date}</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">{event.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => onNavigate && onNavigate('warranty-claim', { warrantyId, device })}
                        className="py-4 rounded-2xl border-2 border-primary text-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors btn-press"
                    >
                        <span className="material-symbols-outlined text-lg">shield</span>
                        Claim Warranty
                    </button>
                    <button
                        onClick={() => onNavigate && onNavigate('warranty-extend', { warrantyId, device })}
                        className="py-4 rounded-2xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all btn-press"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        Extend Warranty
                    </button>
                </div>
            </div>
        </main>
    );
}