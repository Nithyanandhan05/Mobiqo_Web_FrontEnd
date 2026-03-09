import { useState, useEffect } from 'react';

interface PaymentMethodsProps {
    onNavigate: (page: string, data?: any) => void;
}

interface SavedMethod {
    id: number;
    method_type: string;
    details: string;
    expiry?: string;
    is_primary: boolean;
}

function MethodIcon({ type }: { type: string }) {
    const t = type.toLowerCase();
    if (t.includes('upi')) return <span className="material-symbols-outlined text-purple-500 text-2xl">account_balance</span>;
    if (t.includes('debit')) return <span className="material-symbols-outlined text-blue-500 text-2xl">credit_card</span>;
    if (t.includes('credit')) return <span className="material-symbols-outlined text-emerald-500 text-2xl">credit_score</span>;
    return <span className="material-symbols-outlined text-slate-400 text-2xl">payments</span>;
}

export function PaymentMethods({ onNavigate: _onNavigate }: PaymentMethodsProps) {
    const [methods, setMethods] = useState<SavedMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchMethods = async () => {
        setLoading(true);
        const token = localStorage.getItem('jwt_token');
        if (!token) { setLoading(false); return; }
        try {
            const res = await fetch('/api/payment_methods', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') setMethods(data.methods || []);
            }
        } catch { /* show empty state */ }
        setLoading(false);
    };

    useEffect(() => { fetchMethods(); }, []);

    const deleteMethod = async (id: number) => {
        if (!window.confirm('Remove this payment method?')) return;
        setDeletingId(id);
        const token = localStorage.getItem('jwt_token');
        try {
            const res = await fetch(`/api/payment_methods/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setMethods(prev => prev.filter(m => m.id !== id));
            } else {
                alert(data.message || 'Failed to remove.');
            }
        } catch { alert('Network error.'); }
        setDeletingId(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Payment Methods</h1>
                    <p className="text-slate-500 text-sm font-medium mt-0.5">Manage your saved cards and UPI IDs</p>
                </div>
            </div>

            {/* Saved Methods */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-black text-slate-900">Saved Methods</h2>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{methods.length} saved</span>
                </div>

                {loading ? (
                    <div className="p-6 space-y-3">
                        {[1, 2].map(i => <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />)}
                    </div>
                ) : methods.length === 0 ? (
                    <div className="text-center py-14 px-6">
                        <span className="material-symbols-outlined text-5xl text-slate-200 block mb-3">credit_card</span>
                        <h3 className="font-bold text-slate-900 mb-1">No Payment Methods Saved</h3>
                        <p className="text-slate-500 text-sm">Your saved cards and UPI IDs will appear here after your first purchase.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {methods.map(m => (
                            <div key={m.id} className="p-5 sm:p-6 flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shrink-0">
                                    <MethodIcon type={m.method_type} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-800 truncate">{m.details}</p>
                                        {m.is_primary && (
                                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary shrink-0">Primary</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                                        {m.method_type}{m.expiry ? ` · Expires ${m.expiry}` : ''}
                                    </p>
                                </div>
                                <button
                                    onClick={() => deleteMethod(m.id)}
                                    disabled={deletingId === m.id}
                                    className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors disabled:opacity-50 shrink-0"
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        {deletingId === m.id ? 'progress_activity' : 'delete'}
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info note */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0">info</span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Payment methods are saved automatically during checkout. Card details are securely handled by our payment partner and are never stored on our servers.
                </p>
            </div>
        </div>
    );
}
