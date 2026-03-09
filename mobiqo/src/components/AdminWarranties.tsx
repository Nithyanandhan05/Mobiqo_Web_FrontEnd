import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';

interface AdminWarrantiesProps {
    onNavigate: (page: any, data?: any) => void;
}

export function AdminWarranties({ onNavigate }: AdminWarrantiesProps) {
    const [warranties, setWarranties] = useState<any[]>([]);
    const [selectedClaim, setSelectedClaim] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchWarranties = async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) { setLoading(false); return; }
        try {
            const res = await fetch('/api/admin/warranties', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') setWarranties(data.warranties);
            } else {
                console.error("Failed to fetch warranties:", res.status);
            }
        } catch (err) {
            console.error("Network error fetching admin warranties:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWarranties(); }, []);

    const processClaim = async (id: number, action: 'approve' | 'reject') => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;
        try {
            const res = await fetch(`/api/admin/warranties/${id}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSelectedClaim(null);
                fetchWarranties(); // Refresh without full page reload
            } else {
                alert(data.message || 'Action failed.');
            }
        } catch (err) {
            console.error("Error processing claim:", err);
        }
    };

    const statusClass = (status: string) =>
        status === 'Secure' ? 'bg-emerald-100 text-emerald-700' :
        status === 'Pending' ? 'bg-orange-100 text-orange-700' :
        status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
        (status === 'Expired' || status === 'Alert') ? 'bg-red-100 text-red-700' :
        'bg-slate-100 text-slate-700';

    const imgSrc = (url: string | null) => {
        if (!url) return null;
        return url.startsWith('http') ? url : `/api${url}`;
    };

    return (
        <AdminLayout activeTab="warranties" onNavigate={onNavigate}>
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 md:mb-10">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Warranty Surveillance</h1>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Global warranty activations and claim verification.</p>
                </div>
                <button onClick={fetchWarranties} className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-lg">refresh</span>
                    Refresh
                </button>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="bg-white rounded-[32px] border border-slate-200 p-12 flex flex-col items-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl animate-spin mb-4">progress_activity</span>
                    <p className="font-bold">Loading warranties...</p>
                </div>
            ) : warranties.length === 0 ? (
                <div className="bg-white rounded-[32px] border border-slate-200 p-12 flex flex-col items-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-4">verified_user</span>
                    <p className="font-bold">No warranties found.</p>
                </div>
            ) : (
                <>
                    {/* ── Desktop table (md+) ── */}
                    <div className="hidden md:block bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-[#f8fafc] border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Device</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Purchase</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {warranties.map(w => (
                                    <tr key={w.id} className="hover:bg-slate-50 group">
                                        {/* Device with image */}
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                {w.product_image_url ? (
                                                    <img
                                                        src={imgSrc(w.product_image_url)!}
                                                        alt={w.device_name}
                                                        className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-100 flex-shrink-0"
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                        <span className="material-symbols-outlined text-slate-400 text-lg">smartphone</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 leading-tight">{w.device_name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{w.device_type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Owner */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black flex-shrink-0">
                                                    {w.user_name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700 leading-tight">{w.user_name}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">{w.user_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-500">{w.purchase_date}</td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-500">{w.expiry_date}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusClass(w.status)}`}>
                                                {w.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedClaim(w)}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                                                    title="View details"
                                                >
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </button>
                                                {w.status === 'Pending' && (
                                                    <button
                                                        onClick={() => setSelectedClaim(w)}
                                                        className="bg-primary text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                                                    >
                                                        Review Claim
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile card list (< md) ── */}
                    <div className="md:hidden space-y-3">
                        {warranties.map(w => (
                            <div key={w.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                                {/* Device row */}
                                <div className="flex items-center gap-3 mb-3">
                                    {w.product_image_url ? (
                                        <img
                                            src={imgSrc(w.product_image_url)!}
                                            alt={w.device_name}
                                            className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-100 flex-shrink-0"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-slate-400 text-xl">smartphone</span>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-800 leading-tight truncate">{w.device_name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{w.device_type}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${statusClass(w.status)}`}>
                                        {w.status}
                                    </span>
                                </div>

                                {/* Owner + dates */}
                                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black flex-shrink-0">
                                        {w.user_name?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-700 truncate">{w.user_name}</p>
                                        <p className="text-[10px] text-slate-400 font-medium truncate">{w.user_email}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expires</p>
                                        <p className="text-xs font-bold text-slate-600">{w.expiry_date}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedClaim(w)}
                                        className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                        View Details
                                    </button>
                                    {w.status === 'Pending' && (
                                        <button
                                            onClick={() => setSelectedClaim(w)}
                                            className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
                                        >
                                            <span className="material-symbols-outlined text-sm">rate_review</span>
                                            Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ── Claim Detail / Review Modal ── */}
            {selectedClaim && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl shadow-2xl relative max-h-[92vh] overflow-y-auto">
                        {/* Modal header */}
                        <div className="sticky top-0 bg-white px-5 sm:px-8 pt-5 sm:pt-8 pb-4 border-b border-slate-100 z-10">
                            <button
                                onClick={() => setSelectedClaim(null)}
                                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                            <div className="flex items-center gap-3 pr-10">
                                {selectedClaim.product_image_url ? (
                                    <img
                                        src={imgSrc(selectedClaim.product_image_url)!}
                                        alt={selectedClaim.device_name}
                                        className="w-14 h-14 rounded-xl object-contain bg-slate-50 border border-slate-100 flex-shrink-0"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-slate-400 text-2xl">smartphone</span>
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">{selectedClaim.device_name}</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{selectedClaim.device_type}</p>
                                </div>
                            </div>
                        </div>

                        <div className="px-5 sm:px-8 py-5 space-y-5">
                            {/* Owner info */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Owner</p>
                                    <p className="text-sm font-black text-slate-800">{selectedClaim.user_name}</p>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                                    <p className="text-sm font-bold text-slate-700 break-all">{selectedClaim.user_email || 'N/A'}</p>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                                    <p className="text-sm font-bold text-slate-700">{selectedClaim.user_phone || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Dates + Status */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Purchased</p>
                                    <p className="text-sm font-bold text-slate-700">{selectedClaim.purchase_date}</p>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expires</p>
                                    <p className="text-sm font-bold text-slate-700">{selectedClaim.expiry_date}</p>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${statusClass(selectedClaim.status)}`}>
                                        {selectedClaim.status}
                                    </span>
                                </div>
                            </div>

                            {/* Claim reason — only for Pending/Rejected */}
                            {selectedClaim.claim_reason && (
                                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Claim Reason / Description</p>
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{selectedClaim.claim_reason}</p>
                                </div>
                            )}

                            {/* Attached images */}
                            {(selectedClaim.claim_invoice_url || selectedClaim.claim_device_url) && (
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Attached Evidence</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 mb-2">Invoice</p>
                                            {selectedClaim.claim_invoice_url ? (
                                                <div className="aspect-video bg-white rounded-xl border border-slate-200 overflow-hidden group relative">
                                                    <img
                                                        src={imgSrc(selectedClaim.claim_invoice_url)!}
                                                        alt="Invoice"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <a
                                                        href={imgSrc(selectedClaim.claim_invoice_url)!}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">open_in_new</span> View Full
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">No Invoice</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 mb-2">Device Image</p>
                                            {selectedClaim.claim_device_url ? (
                                                <div className="aspect-video bg-white rounded-xl border border-slate-200 overflow-hidden group relative">
                                                    <img
                                                        src={imgSrc(selectedClaim.claim_device_url)!}
                                                        alt="Device"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <a
                                                        href={imgSrc(selectedClaim.claim_device_url)!}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">open_in_new</span> View Full
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">No Image</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Approve / Reject — only for Pending */}
                            {selectedClaim.status === 'Pending' && (
                                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-100">
                                    <button
                                        onClick={() => processClaim(selectedClaim.id, 'reject')}
                                        className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors border border-rose-100"
                                    >
                                        Reject Claim
                                    </button>
                                    <button
                                        onClick={() => processClaim(selectedClaim.id, 'approve')}
                                        className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all"
                                    >
                                        Approve Warranty
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}