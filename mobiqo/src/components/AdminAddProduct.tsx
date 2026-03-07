import { useState } from 'react';
import { AdminLayout } from './AdminLayout';

interface AdminAddProductProps {
    onNavigate: (page: any, data?: any) => void;
}

export function AdminAddProduct({ onNavigate }: AdminAddProductProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image_url: '',
        battery_spec: '',
        display_spec: '',
        processor_spec: '',
        camera_spec: '',
        stock: '',
        category: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('jwt_token');
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.status === 'success') {
                alert('Product created successfully!');
                onNavigate('admin-inventory');
            } else {
                alert(data.message || 'Error creating product');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Server error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout activeTab="inventory" onNavigate={onNavigate}>
            <div className="flex items-center gap-4 mb-10">
                <button onClick={() => onNavigate('admin-inventory')} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm border border-slate-200 transition-all">
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Add New Product</h1>
                    <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Publish a new device to the global marketplace.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-4">Basic Details</h2>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Product Name</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. iPhone 16 Pro Max"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Price (₹)</label>
                            <input
                                required
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="e.g. 129000"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Image URL</label>
                            <textarea
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://example.com/image.png or base64 data URI"
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Initial Stock</label>
                                <input
                                    required
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="50"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                <input
                                    required
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="e.g. Smartphone"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                        </div>
                        {formData.image_url && (
                            <div className="w-32 h-32 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-2 relative group">
                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-white px-2 py-1 rounded text-[10px] font-bold shadow-sm">Preview</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Technical Specs */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-4">Technical Specifications</h2>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Display Spec</label>
                            <input
                                name="display_spec"
                                value={formData.display_spec}
                                onChange={handleChange}
                                placeholder="e.g. 6.7-inch Super Retina XDR"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Processor Spec</label>
                            <input
                                name="processor_spec"
                                value={formData.processor_spec}
                                onChange={handleChange}
                                placeholder="e.g. A18 Pro Bionic"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Camera Spec</label>
                            <input
                                name="camera_spec"
                                value={formData.camera_spec}
                                onChange={handleChange}
                                placeholder="e.g. 48MP Main + 12MP Ultra Wide"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Battery Spec</label>
                            <input
                                name="battery_spec"
                                value={formData.battery_spec}
                                onChange={handleChange}
                                placeholder="e.g. 4422 mAh with 20W Fast Charge"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end gap-4">
                    <button type="button" onClick={() => onNavigate('admin-inventory')} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-primary rounded-xl text-sm font-black text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? 'Publishing...' : 'Publish Product'}
                        <span className="material-symbols-outlined text-lg">{loading ? 'sync' : 'publish'}</span>
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
