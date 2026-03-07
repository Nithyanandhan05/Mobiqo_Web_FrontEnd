import { useState } from 'react';

interface WarrantyRegisterProps {
    onNavigate: (page: string) => void;
}

export function WarrantyRegister({ onNavigate }: WarrantyRegisterProps) {
    const [formData, setFormData] = useState({
        device_name: '',
        brand: 'Smartphone',
        expiry_date: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        try {
            const res = await fetch('/api/warranties/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Warranty Registered Successfully!');
                onNavigate('warranty');
            } else {
                alert('Failed to register warranty.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] pb-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
                <div className="flex items-center gap-3 mb-8">
                    <button onClick={() => onNavigate('warranty')} className="hover:text-primary transition-colors">
                        <span className="material-symbols-outlined font-black">arrow_back</span>
                    </button>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Register New Device</h1>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm shadow-slate-200/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Device Name</label>
                            <input
                                type="text"
                                required
                                value={formData.device_name}
                                onChange={e => setFormData({ ...formData, device_name: e.target.value })}
                                placeholder="e.g. Samsung Galaxy S24"
                                className="w-full bg-slate-50 rounded-2xl py-4 px-5 text-sm font-medium border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Device Type / Brand</label>
                            <select
                                value={formData.brand}
                                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                className="w-full bg-slate-50 rounded-2xl py-4 px-5 text-sm font-medium border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                            >
                                <option>Smartphone</option>
                                <option>Laptop</option>
                                <option>Headphones</option>
                                <option>Smartwatch</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Warranty Expiry Date</label>
                            <input
                                type="date"
                                required
                                value={formData.expiry_date}
                                onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                                className="w-full bg-slate-50 rounded-2xl py-4 px-5 text-sm font-medium border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all btn-press disabled:opacity-50"
                            >
                                {loading ? 'Registering...' : 'Complete Registration'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
