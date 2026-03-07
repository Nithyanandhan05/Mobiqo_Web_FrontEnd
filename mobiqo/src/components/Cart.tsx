import type { CartItem } from '../App';

interface CartProps {
    onNavigate?: (page: 'home' | 'ai-assistant' | 'product-details' | 'cart' | 'address' | 'checkout', data?: any) => void;
    cart: CartItem[];
    onRemoveFromCart: (id: string, specs: string) => void;
}

export function Cart({ onNavigate, cart, onRemoveFromCart }: CartProps) {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalOriginalPrice = cart.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
    const totalDiscount = totalOriginalPrice - totalPrice;

    return (
        <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] pb-20">
            <div className="max-w-6xl mx-auto px-6 py-6 sm:py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <button onClick={() => onNavigate && onNavigate('home')} className="hover:text-primary transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined font-black">arrow_back</span>
                        </button>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Smart Cart <span className="text-slate-500 font-bold ml-1">({totalItems})</span>
                        </h1>
                    </div>
                </div>

                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
                        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">shopping_cart</span>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
                        <p className="text-slate-500 mb-6 font-medium">Looks like you haven't added anything to your cart yet.</p>
                        <button onClick={() => onNavigate && onNavigate('home')} className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all inline-flex">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {cart.map((item, index) => (
                                <div key={index} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6 animate-in fade-in">
                                    <div className="w-full sm:w-32 aspect-square bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100 shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{item.name}</h3>
                                                <p className="text-sm text-slate-500 font-medium">{item.specs}</p>
                                            </div>
                                            <div className="text-left sm:text-right shrink-0">
                                                <div className="flex items-end sm:items-end justify-start sm:justify-end gap-2">
                                                    <span className="text-2xl font-black text-slate-900">₹{item.price.toLocaleString()}</span>
                                                    <span className="text-sm font-bold text-slate-400 line-through pb-1">₹{item.originalPrice.toLocaleString()}</span>
                                                </div>
                                                <span className="text-emerald-500 font-bold text-xs uppercase tracking-wider block">
                                                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% Off
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium mb-4 mt-1">
                                            <span className="material-symbols-outlined text-[16px] text-slate-400">local_shipping</span>
                                            Delivery by <span className="font-bold text-slate-900">Thu, Mar 5</span>
                                            <span className="text-slate-300 mx-1">|</span>
                                            <span className="text-emerald-600 font-bold uppercase tracking-wider text-xs">FREE</span>
                                        </div>

                                        <div className="h-px w-full bg-slate-100 mt-auto mb-4"></div>

                                        <div className="flex justify-start sm:justify-end gap-6 text-sm font-bold">
                                            <button onClick={() => onRemoveFromCart(item.id, item.specs)} className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                                Remove
                                            </button>
                                            <button className="flex items-center gap-1.5 text-primary hover:text-blue-700 transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">bookmark</span>
                                                Save for later
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="bg-white/50 border border-slate-100 border-dashed rounded-3xl p-6 text-center shadow-sm">
                                <span className="text-slate-500 font-medium">Looking for more? </span>
                                <button onClick={() => onNavigate && onNavigate('home')} className="text-primary font-bold hover:underline transition-colors">Continue Shopping</button>
                            </div>
                        </div>

                        {/* Right Column - Price Summary */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm sticky top-28">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Price Details</h3>

                                <div className="space-y-4 mb-6 text-sm font-medium">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Price ({totalItems} items)</span>
                                        <span className="text-slate-900 font-bold">₹{totalOriginalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Discount</span>
                                        <span className="text-emerald-500 font-bold">- ₹{totalDiscount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Delivery Charges</span>
                                        <span className="text-emerald-500 font-bold">FREE</span>
                                    </div>
                                </div>

                                <div className="h-px w-full bg-slate-100 mb-6"></div>

                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-bold text-slate-900 text-lg">Total Amount</span>
                                    <span className="font-black text-primary text-2xl">₹{totalPrice.toLocaleString()}</span>
                                </div>

                                <div className="bg-emerald-50/80 rounded-xl p-3 flex items-start sm:items-center gap-2 text-emerald-700 text-xs sm:text-sm font-medium mb-6 border border-emerald-100/50">
                                    <span className="material-symbols-outlined text-[18px] shrink-0 font-variation-fill">sell</span>
                                    <span>You will save <span className="font-bold">₹{totalDiscount.toLocaleString()}</span> on this order</span>
                                </div>

                                <button
                                    onClick={() => onNavigate && onNavigate('address')}
                                    className="w-full bg-[#2962FF] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-sm sm:text-base btn-press"
                                >
                                    Place Order
                                    <span className="material-symbols-outlined font-black">arrow_forward</span>
                                </button>
                            </div>

                            <div className="space-y-4 px-2 pt-2">
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-primary text-xl font-variation-fill">verified_user</span>
                                    AI Secured Payments
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-primary text-xl font-variation-fill">workspace_premium</span>
                                    100% Authentic Products
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-primary text-xl font-variation-fill">replay</span>
                                    7-Day Return Policy
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
