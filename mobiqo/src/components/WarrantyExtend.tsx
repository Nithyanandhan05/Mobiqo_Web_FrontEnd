import { useState } from 'react';

interface WarrantyExtendProps {
    onNavigate?: (page: any, data?: any) => void;
    warranty?: any;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

const PLANS = [
    {
        id: '1yr',
        label: '1 Year',
        price: 999,
        features: ['Screen damage cover', 'Battery replacement', '24/7 support'],
        popular: false,
    },
    {
        id: '2yr',
        label: '2 Years',
        price: 1799,
        features: ['Screen damage cover', 'Battery replacement', '24/7 support', 'Accidental damage'],
        popular: true,
    },
    {
        id: '3yr',
        label: '3 Years',
        price: 2999,
        features: ['Screen damage cover', 'Battery replacement', '24/7 support', 'Accidental damage', 'Water damage'],
        popular: false,
    },
];

export function WarrantyExtend({ onNavigate, warranty }: WarrantyExtendProps) {
    const [selectedPlan, setSelectedPlan] = useState('2yr');
    const [processing, setProcessing] = useState(false);
    const [done, setDone] = useState(false);

    const device = warranty?.device_name || 'Your Device';
    const plan = PLANS.find(p => p.id === selectedPlan)!;

    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleExtend = async () => {
        setProcessing(true);

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            alert('Failed to load Razorpay payment gateway. Please check your internet connection.');
            setProcessing(false);
            return;
        }

        try {
            const token = localStorage.getItem('jwt_token');
            if (token) {
                // Step 1: Create Draft Order
                const res = await fetch('/api/create_razorpay_order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ amount: plan.price })
                });

                let razorpayOrderId = '';
                if (res.ok) {
                    const data = await res.json();
                    razorpayOrderId = data.razorpay_order_id;
                }

                // Step 2: Open Razorpay
                const options = {
                    key: 'rzp_test_APuQCp0MiHoD9M',
                    amount: plan.price * 100, // paise
                    currency: 'INR',
                    name: 'Mobiqo Warranty',
                    description: `${plan.label} Extension for ${device}`,
                    ...(razorpayOrderId ? { order_id: razorpayOrderId } : {}),
                    theme: { color: '#135bec' },
                    handler: async function (response: any) {
                        try {
                            const durationMapping: Record<string, number> = { '1yr': 12, '2yr': 24, '3yr': 36 };
                            const months = durationMapping[selectedPlan] || 12;

                            // Update Backend DB explicitly with duration
                            await fetch(`/api/warranties/${warranty?.id}/extend`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ duration_months: months })
                            });
                        } catch {
                            console.error("Failed to update warranty backend");
                        }
                        setProcessing(false);
                        setDone(true);
                    },
                    modal: {
                        ondismiss: function () {
                            setProcessing(false);
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                setProcessing(false);
                alert("Authentication token not found.");
            }
        } catch (err) {
            console.error('Payment error:', err);
            alert('Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    if (done) {
        return (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-primary text-4xl font-variation-fill">verified_user</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Warranty Extended!</h2>
                <p className="text-slate-500 font-medium mb-6">Your {plan.label} SmartGuard plan has been activated for {device}.</p>
                <button
                    onClick={() => onNavigate && onNavigate('warranty')}
                    className="bg-primary text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all"
                >
                    Back to Warranties
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => onNavigate && onNavigate('warranty')} className="hover:text-primary transition-colors">
                    <span className="material-symbols-outlined font-black">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Extend Warranty</h1>
                    <p className="text-slate-500 text-sm font-medium">{device}</p>
                </div>
            </div>

            {/* Plan Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PLANS.map(p => (
                    <div
                        key={p.id}
                        onClick={() => setSelectedPlan(p.id)}
                        className={`relative bg-white rounded-3xl border-2 p-6 cursor-pointer transition-all ${selectedPlan === p.id
                            ? 'border-primary shadow-md shadow-primary/10'
                            : 'border-slate-200 hover:border-slate-300'}`}
                    >
                        {p.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
                                BEST VALUE
                            </div>
                        )}
                        <div className={`w-5 h-5 rounded-full border-2 mb-4 flex items-center justify-center ${selectedPlan === p.id ? 'border-primary' : 'border-slate-300'}`}>
                            {selectedPlan === p.id && <div className="w-3 h-3 rounded-full bg-primary" />}
                        </div>
                        <h3 className="font-black text-slate-900 text-lg">{p.label}</h3>
                        <p className="text-2xl font-black text-primary mt-1 mb-4">₹{p.price.toLocaleString()}</p>
                        <ul className="space-y-2">
                            {p.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                    <span className="material-symbols-outlined text-emerald-500 text-base font-variation-fill">check_circle</span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Summary & CTA */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">You're extending</p>
                        <p className="font-black text-slate-900">{device} — {plan.label} SmartGuard™</p>
                    </div>
                    <p className="text-3xl font-black text-primary">₹{plan.price.toLocaleString()}</p>
                </div>
                <button
                    onClick={handleExtend}
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-primary to-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span className="material-symbols-outlined font-variation-fill">verified_user</span>
                            Extend Warranty — ₹{plan.price.toLocaleString()}
                        </>
                    )}
                </button>
                <p className="text-xs text-slate-400 text-center mt-3 font-medium">Coverage starts immediately after payment.</p>
            </div>
        </div>
    );
}
