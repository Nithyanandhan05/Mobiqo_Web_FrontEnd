import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';

interface AdminInventoryProps {
    onNavigate: (page: any, data?: any) => void;
}

export function AdminInventory({ onNavigate }: AdminInventoryProps) {
    const [products, setProducts] = useState<any[]>([]);

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

    return (
        <AdminLayout activeTab="inventory" onNavigate={onNavigate}>
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Inventory Management</h1>
                    <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Global Product Stock and Pricing Control.</p>
                </div>
                <button onClick={() => onNavigate('admin-add-product')} className="px-5 py-2.5 bg-primary rounded-xl text-sm font-black text-white hover:bg-primary/90 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">add_box</span>
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
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
                                    <button onClick={() => onNavigate('admin-edit-product', { id: p.id })} className="text-primary hover:underline text-xs font-black uppercase tracking-widest">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
