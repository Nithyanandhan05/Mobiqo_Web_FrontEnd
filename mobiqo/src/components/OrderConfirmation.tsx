import { useEffect, useState } from 'react';

interface OrderConfirmationProps {
    onNavigate?: (page: any, data?: any) => void;
    amount?: number;
    paymentMethod?: string;
    transactionId?: string;
}

export function OrderConfirmation({ onNavigate, amount = 0, paymentMethod = 'Razorpay', transactionId = 'TXN-SUCCESS' }: OrderConfirmationProps) {
    const [orderId] = useState(() => 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase());
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    const steps = [
        { label: 'Payment Verified', done: true, icon: 'payments' },
        { label: 'Warranty Registered', done: true, icon: 'verified_user' },
        { label: 'Order Confirmed', done: true, icon: 'check_circle' },
        { label: 'Dispatch Pending', done: false, icon: 'inventory_2' },
        { label: 'Out for Delivery', done: false, icon: 'local_shipping' },
        { label: 'Delivered', done: false, icon: 'home' },
    ];

    return (
        <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] pb-28">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

                {/* Animated Checkmark */}
                <div className={`flex flex-col items-center text-center mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="relative w-28 h-28 mb-6">
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                        <div className="relative w-28 h-28 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
                            <span className="material-symbols-outlined text-white text-6xl font-variation-fill">check_circle</span>
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-primary mb-2 tracking-tight">Order Successfully Placed!</h1>
                    <p className="text-slate-500 font-medium text-base">
                        Your order has been confirmed and will be delivered soon.
                    </p>
                </div>

                {/* Order Details Card */}
                <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-6 transition-all duration-700 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">Order Details</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-500">Order ID</span>
                            <span className="font-black text-slate-900 text-sm">#{orderId}</span>
                        </div>
                        <div className="h-px bg-slate-100" />
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-500">Amount Paid</span>
                            <span className="font-black text-primary text-lg">₹{amount.toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-slate-100" />
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-500">Payment Method</span>
                            <span className="font-bold text-slate-900 text-sm">{paymentMethod}</span>
                        </div>
                        <div className="h-px bg-slate-100" />
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-500">Transaction ID</span>
                            <span className="font-mono font-bold text-slate-700 text-xs bg-slate-50 px-3 py-1.5 rounded-lg">{transactionId}</span>
                        </div>
                    </div>
                </div>

                {/* Status Timeline */}
                <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Order Status</h2>
                    <div className="relative">
                        {steps.map((step, i) => (
                            <div key={i} className="flex items-start gap-4 mb-4 last:mb-0">
                                {/* Icon + Connector */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${step.done ? 'bg-primary shadow-md shadow-primary/30' : 'bg-slate-100'}`}>
                                        <span className={`material-symbols-outlined text-lg ${step.done ? 'text-white font-variation-fill' : 'text-slate-400'}`}>{step.icon}</span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`w-0.5 flex-1 min-h-[20px] mt-1 ${step.done ? 'bg-primary/30' : 'bg-slate-100'}`} />
                                    )}
                                </div>
                                {/* Label */}
                                <div className="pt-1.5 pb-4">
                                    <p className={`font-bold text-sm ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                                    {step.done && <p className="text-xs text-primary font-medium mt-0.5">Completed ✓</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SmartGuard Protection Banner */}
                <div className={`bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 mb-6 flex items-center gap-4 shadow-lg shadow-emerald-500/25 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-white text-2xl font-variation-fill">shield</span>
                    </div>
                    <div>
                        <h3 className="font-black text-white">SmartGuard™ Protection Active</h3>
                        <p className="text-emerald-50/90 text-sm font-medium mt-0.5">Your warranty has been automatically registered and is ready.</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={`flex flex-col gap-3 transition-all duration-700 delay-[400ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <button
                        onClick={() => onNavigate && onNavigate('orders')}
                        className="w-full bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all text-base"
                    >
                        <span className="material-symbols-outlined text-xl">local_shipping</span>
                        Track Delivery
                    </button>

                    <button
                        onClick={() => {
                            // In a real app you'd generate and download a PDF invoice
                            alert('Invoice download coming soon!');
                        }}
                        className="w-full bg-white text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 transition-all text-base"
                    >
                        <span className="material-symbols-outlined text-xl">download</span>
                        Download Invoice
                    </button>

                    <button
                        onClick={() => onNavigate && onNavigate('home')}
                        className="text-center text-slate-500 font-bold text-sm hover:text-primary transition-colors py-2"
                    >
                        ← Continue Shopping
                    </button>
                </div>
            </div>
        </main>
    );
}
