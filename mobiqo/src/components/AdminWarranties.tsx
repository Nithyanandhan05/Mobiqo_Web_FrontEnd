import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';

interface AdminWarrantiesProps {
    onNavigate: (page: any, data?: any) => void;
}

export function AdminWarranties({ onNavigate }: AdminWarrantiesProps) {
    const [warranties, setWarranties] = useState<any[]>([]);
    const [selectedClaim, setSelectedClaim] = useState<any>(null);

    useEffect(() => {
        const fetchWarranties = async () => {
            const token = localStorage.getItem('jwt_token');
            try {
                // Notice we only use /api/... here! The vite proxy handles the rest.
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
            }
        };
        fetchWarranties();
    }, []);

    const processClaim = async (id: number, action: 'approve' | 'reject') => {
        const token = localStorage.getItem('jwt_token');
        try {
            await fetch(`/api/admin/warranties/${id}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: action })
            });
            setSelectedClaim(null);
            window.location.reload();
        } catch (err) {
            console.error("Error processing claim:", err);
        }
    };

    return (
        <AdminLayout activeTab="warranties" onNavigate={onNavigate}>
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Warranty Surveillance</h1>
                    <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Global warranty activations and claim verification.</p>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Device Details</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {warranties.map(w => (
                            <tr key={w.id} className="hover:bg-slate-50">
                                <td className="px-8 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-800 leading-tight">{w.device_name}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{w.device_type}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-black">
                                            {w.user_name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-bold text-slate-600">{w.user_name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-sm font-medium text-slate-500">{w.expiry_date}</td>
                                <td className="px-6 py-5">
                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${w.status === 'Secure' ? 'bg-emerald-100 text-emerald-700' :
                                        w.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                            w.status === 'Expired' || w.status === 'Alert' ? 'bg-red-100 text-red-700' :
                                                'bg-rose-100 text-rose-700'
                                        }`}>
                                        {w.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    {w.status === 'Pending' && (
                                        <button onClick={() => setSelectedClaim(w)} className="bg-primary text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">Review Claim</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Admin Claim Review Modal */}
            {selectedClaim && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-8 relative">
                        <button onClick={() => setSelectedClaim(null)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>

                        <h2 className="text-2xl font-black text-slate-900 mb-2">Review Warranty Claim</h2>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">User: {selectedClaim.user_name} • {selectedClaim.device_name}</p>

                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6 space-y-4">
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Claim Reason / Description</h3>
                                <p className="text-sm text-slate-700 font-medium leading-relaxed">{selectedClaim.claim_reason || "No description provided."}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Attached Invoice</h3>
                                    {selectedClaim.claim_invoice_url ? (
                                        <div className="aspect-video bg-white rounded-xl border border-slate-200 overflow-hidden group relative">
                                            {/* Images DO need the full URL since they aren't passing through fetch() */}
                                            <img src={`http://127.0.0.1:5000${selectedClaim.claim_invoice_url}`} alt="Invoice" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <a href={`http://127.0.0.1:5000${selectedClaim.claim_invoice_url}`} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                                <span className="material-symbols-outlined text-sm">open_in_new</span> View Full
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="h-24 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">No Invoice</div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Device Image</h3>
                                    {selectedClaim.claim_device_url ? (
                                        <div className="aspect-video bg-white rounded-xl border border-slate-200 overflow-hidden group relative">
                                            <img src={`http://127.0.0.1:5000${selectedClaim.claim_device_url}`} alt="Device" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <a href={`http://127.0.0.1:5000${selectedClaim.claim_device_url}`} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                                <span className="material-symbols-outlined text-sm">open_in_new</span> View Full
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="h-24 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">No Device Image</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-8">
                            <button onClick={() => processClaim(selectedClaim.id, 'reject')} className="px-6 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors">
                                Reject Claim
                            </button>
                            <button onClick={() => processClaim(selectedClaim.id, 'approve')} className="px-6 py-3 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all">
                                Approve Warranty
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}