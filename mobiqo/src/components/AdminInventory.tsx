import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';

interface AdminInventoryProps {
    onNavigate: (page: any, data?: any) => void;
}

export function AdminInventory({ onNavigate }: AdminInventoryProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('jwt_token');
            const res = await fetch('/api/admin/products', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') setProducts(data.products);
        };
        fetchProducts();
    }, []);

    const deleteProduct = async (id: number, name: string) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
        const token = localStorage.getItem('jwt_token');
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setProducts(prev => prev.filter(p => p.id !== id));
            } else {
                alert(data.message || 'Failed to delete product.');
            }
        } catch (err) {
            alert('Network error. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <AdminLayout activeTab="inventory" onNavigate={onNavigate}>
            {/* Page header — stacks on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-10">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Inventory Management</h1>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Global Product Stock and Pricing Control.</p>
                </div>
                <button
                    onClick={() => onNavigate('admin-add-product')}
                    className="w-full sm:w-auto px-5 py-2.5 bg-primary rounded-xl text-sm font-black text-white hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-xl">add_box</span>
                    Add Product
                </button>
            </div>

            {/* ── Desktop table (md+) ── */}
            <div className="hidden md:block bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <img src={p.image_url} className="w-12 h-12 rounded-lg object-contain bg-slate-50 p-1" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/f8fafc/94a3b8?text=Device'; }} />
                                        <span className="text-sm font-bold text-slate-800">{p.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-sm font-medium text-slate-500">{p.category}</td>
                                <td className="px-6 py-5 text-sm font-black text-slate-900">{p.price}</td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (p.stock / 100) * 100)}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">{p.stock}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => onNavigate('admin-edit-product', { id: p.id })}
                                            className="text-primary hover:underline text-xs font-black uppercase tracking-widest"
                                        >Edit</button>
                                        <button
                                            onClick={() => deleteProduct(p.id, p.name)}
                                            disabled={deletingId === p.id}
                                            className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-colors disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined text-[15px]">{deletingId === p.id ? 'progress_activity' : 'delete'}</span>
                                            {deletingId === p.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Mobile card grid (< md) ── */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map(p => (
                    <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-start gap-3">
                        <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-14 h-14 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100 flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/f8fafc/94a3b8?text=Device'; }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-slate-800 leading-tight truncate">{p.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{p.category}</p>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm font-black text-slate-900">{p.price}</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (p.stock / 100) * 100)}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">{p.stock}</span>
                                </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => onNavigate('admin-edit-product', { id: p.id })}
                                    className="flex-1 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteProduct(p.id, p.name)}
                                    disabled={deletingId === p.id}
                                    className="flex-1 py-1.5 rounded-lg bg-rose-50 text-rose-500 text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[14px]">{deletingId === p.id ? 'progress_activity' : 'delete'}</span>
                                    {deletingId === p.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
