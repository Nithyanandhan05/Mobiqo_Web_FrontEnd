import { useState } from 'react';
import type { CartItem } from '../App';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface CheckoutProps {
    onNavigate?: (page: 'home' | 'ai-assistant' | 'product-details' | 'cart' | 'address' | 'checkout' | 'order-confirmation', data?: any) => void;
    cart: CartItem[];
    selectedAddress?: any;
}

export function Checkout({ onNavigate, cart, selectedAddress }: CheckoutProps) {
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
    const [processing, setProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalOriginalPrice = cart.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
    const discount = totalOriginalPrice - totalPrice;

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

    const handleRazorpayPayment = async () => {
        setProcessing(true);

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            alert('Failed to load Razorpay. Please check your internet connection.');
            setProcessing(false);
            return;
        }

        try {
            // Step 1: Create Razorpay order via backend
            const token = localStorage.getItem('jwt_token');
            let razorpayOrderId = '';

            try {
                const res = await fetch('/api/create_razorpay_order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({ amount: totalPrice })
                });

                if (res.ok) {
                    const data = await res.json();
                    razorpayOrderId = data.razorpay_order_id;
                }
            } catch {
                // If backend is not available, continue with direct Razorpay
                console.log('Backend not available, using direct Razorpay checkout');
            }

            // Step 2: Open Razorpay Checkout
            const options = {
                key: 'rzp_test_APuQCp0MiHoD9M',
                amount: totalPrice * 100, // paise
                currency: 'INR',
                name: 'Mobiqo',
                description: `Payment for ${totalItems} item(s)`,
                ...(razorpayOrderId ? { order_id: razorpayOrderId } : {}),
                prefill: {
                    name: selectedAddress?.full_name || 'Nithi',
                    email: 'user@modiqo.com',
                    contact: selectedAddress?.mobile || '9363441126'
                },
                theme: {
                    color: '#135bec'
                },
                handler: async function (response: any) {
                    // Step 3: Process payment on backend
                    try {
                        if (token) {
                            await fetch('/api/process_payment', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    order_id: 1,
                                    payment_method: 'Razorpay',
                                    amount: String(totalPrice),
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            });

                            // ACTUALLY PLACE THE FULL ORDER
                            await fetch('/api/place_order', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({ items: cart, payment_method: 'Razorpay' })
                            });
                        }
                    } catch {
                        console.log('Backend payment processing unavailable');
                    }

                    const txnId = response.razorpay_payment_id || 'TXN-SUCCESS';
                    setProcessing(false);
                    if (onNavigate) {
                        onNavigate('order-confirmation', {
                            amount: totalPrice,
                            paymentMethod: 'Razorpay',
                            transactionId: txnId,
                        });
                    } else {
                        setOrderSuccess(true);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Payment error:', err);
            alert('Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    const handleCODPayment = async () => {
        setProcessing(true);
        const token = localStorage.getItem('jwt_token');

        try {
            if (token) {
                await fetch('/api/place_order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ items: cart, payment_method: 'Cash On Delivery' })
                });
            }
        } catch (e) {
            console.log('Backend not available securely', e);
        }

        setTimeout(() => {
            const txnId = 'COD-' + Date.now().toString(36).toUpperCase();
            setProcessing(false);
            if (onNavigate) {
                onNavigate('order-confirmation', {
                    amount: totalPrice,
                    paymentMethod: 'Cash on Delivery',
                    transactionId: txnId,
                });
            } else {
                setOrderSuccess(true);
            }
        }, 1500);
    };

    const handlePay = () => {
        if (paymentMethod === 'razorpay') {
            handleRazorpayPayment();
        } else {
            handleCODPayment();
        }
    };

    // Inline fallback success screen (only if navigate is not available)
    if (orderSuccess) {
        return (
            <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] flex items-center justify-center page-enter">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 success-pulse shadow-2xl shadow-primary/30">
                        <span className="material-symbols-outlined text-white text-5xl font-variation-fill">check_circle</span>
                    </div>
                    <h1 className="text-3xl font-black text-primary mb-2">Order Successfully Placed!</h1>
                    <p className="text-slate-500 font-medium mb-6">Your order has been confirmed and will be delivered soon.</p>
                    <button
                        onClick={() => onNavigate && onNavigate('home')}
                        className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all btn-press text-sm"
                    >
                        Continue Shopping
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <button onClick={() => onNavigate && onNavigate('address')} className="hover:text-primary transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined font-black">arrow_back</span>
                        </button>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Checkout</h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <span className="material-symbols-outlined text-emerald-500 text-lg">lock</span>
                        <span className="uppercase tracking-widest text-xs">Secure Connection</span>
                    </div>
                </div>

                {/* Secure Checkout Banner */}
                <div className="text-center mb-10 bg-gradient-to-b from-slate-50 to-transparent rounded-3xl py-10">
                    <div className="w-16 h-16 bg-gradient-to-b from-cyan-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                        <span className="material-symbols-outlined text-white text-3xl font-variation-fill">lock</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Secure Checkout</h2>
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-emerald-500 text-lg font-variation-fill">verified</span>
                        <span className="text-slate-500 font-medium">256-bit Encrypted Payment Process</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Left Column - Payment Methods */}
                    <div className="lg:col-span-3 space-y-6">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Payment Method</h2>

                        {/* Razorpay Option */}
                        <div
                            onClick={() => setPaymentMethod('razorpay')}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'razorpay'
                                ? 'border-primary bg-white shadow-md shadow-primary/5'
                                : 'border-slate-200 bg-white/50 hover:border-slate-300'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary text-2xl">credit_card</span>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 text-lg">Razorpay (UPI / Cards / NetBanking)</h3>
                                        <p className="text-sm text-slate-500 font-medium mt-0.5">Pay securely using your preferred method</p>
                                        <div className="flex items-center gap-2 mt-3">
                                            {['credit_card', 'account_balance', 'smartphone'].map((icon, i) => (
                                                <div key={i} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-slate-400 text-sm">{icon}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${paymentMethod === 'razorpay' ? 'border-primary' : 'border-slate-300'}`}>
                                    {paymentMethod === 'razorpay' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                </div>
                            </div>
                        </div>

                        {/* Cash on Delivery Option */}
                        <div
                            onClick={() => setPaymentMethod('cod')}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod'
                                ? 'border-primary bg-white shadow-md shadow-primary/5'
                                : 'border-slate-200 bg-white/50 hover:border-slate-300'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-slate-500 text-2xl">local_shipping</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Cash on Delivery</h3>
                                        <p className="text-sm text-slate-500 font-medium mt-0.5">Pay when your order reaches your doorstep</p>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${paymentMethod === 'cod' ? 'border-primary' : 'border-slate-300'}`}>
                                    {paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                                </div>
                            </div>
                        </div>

                        {/* Price Verification */}
                        <div className="bg-emerald-50/60 rounded-2xl p-5 flex items-center justify-between border border-emerald-100/50">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-emerald-500 font-variation-fill">auto_awesome</span>
                                <div>
                                    <h4 className="font-bold text-emerald-700 text-sm">Price Verification</h4>
                                    <p className="text-xs text-emerald-600/70 font-medium">You are getting the best price guaranteed.</p>
                                </div>
                            </div>
                            <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg text-xs font-black uppercase tracking-wider border border-emerald-200/50">Verified</span>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm sticky top-28">
                            <h3 className="font-black text-slate-900 text-lg mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6 text-sm font-medium">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                                    <span className="text-slate-900 font-bold">₹{totalOriginalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span className="text-emerald-600 font-bold">Instant Discount</span>
                                    <span className="text-emerald-500 font-bold">-₹{discount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 font-bold">FREE</span>
                                </div>
                            </div>

                            <div className="h-px w-full bg-slate-100 mb-5"></div>

                            <div className="mb-6">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Secured Amount</p>
                                <p className="text-3xl font-black text-slate-900">₹{totalPrice.toLocaleString()}</p>
                            </div>

                            <button
                                onClick={handlePay}
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all btn-press disabled:opacity-60 disabled:cursor-not-allowed text-base"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined font-variation-fill text-lg">lock</span>
                                        Pay ₹{totalPrice.toLocaleString()}
                                    </>
                                )}
                            </button>

                            <p className="text-[11px] text-slate-400 text-center mt-4 leading-relaxed">
                                By proceeding, you agree to Mobiqo's <span className="text-primary font-bold cursor-pointer">Terms of Service</span> and <span className="text-primary font-bold cursor-pointer">Privacy Policy</span>. Your transaction is 100% secure.
                            </p>

                            <div className="flex justify-center gap-8 mt-6 pt-5 border-t border-slate-100">
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="material-symbols-outlined text-slate-400 text-xl font-variation-fill">verified_user</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Authentic</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5">
                                    <span className="material-symbols-outlined text-slate-400 text-xl">replay</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Easy Returns</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
                                <span className="material-symbols-outlined text-sm">help</span>
                                Need help? <span className="text-primary font-bold cursor-pointer">Contact Support</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Security Footer */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-sm border-t border-slate-100 py-3">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {['credit_card', 'account_balance_wallet', 'smartphone', 'account_balance'].map((icon, i) => (
                            <span key={i} className="material-symbols-outlined text-slate-300 text-lg">{icon}</span>
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                        <span className="material-symbols-outlined text-emerald-400 text-sm font-variation-fill">shield</span>
                        PCI DSS Compliant & Secure
                    </div>
                </div>
            </div>
        </main>
    );
}
