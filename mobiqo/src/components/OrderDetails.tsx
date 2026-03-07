import { useEffect } from 'react';
import { getHDImage } from '../utils/imageHelper';

interface OrderDetailsProps {
    onNavigate: (page: any, data?: any) => void;
    order: any;
}

export function OrderDetails({ onNavigate, order }: OrderDetailsProps) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const isDelivered = order?.status?.toLowerCase().includes('delivered');
    const isShipped = order?.status?.toLowerCase().includes('shipped') || isDelivered;
    const isOutForDelivery = order?.status?.toLowerCase().includes('out for delivery') || isDelivered;

    const basePrice = order?.product?.price?.replace(/[\$,₹]/g, '') || '0';
    const numPrice = parseFloat(basePrice);

    // Formatting date
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <main className="flex-1 bg-[#f1f3f6] min-h-[calc(100vh-80px)] pb-10">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => onNavigate('orders')} className="hover:text-[#2874f0] transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined font-black">arrow_back</span>
                        </button>
                        <h1 className="text-xl font-bold text-slate-900">Order Details</h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-500 font-medium hidden sm:inline-block">Order ID: <span className="text-slate-900 font-bold">{order?.invoice_no || 'MDQ-PENDING'}</span></span>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 cursor-pointer hover:bg-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-lg text-slate-700">dark_mode</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* Left Column (Main Details) */}
                    <div className="flex-1 flex flex-col gap-6 w-full">

                        {/* Status Card */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{order?.status || 'Processing'}</h2>
                                    <p className="text-sm text-slate-500 mt-1">Your order is being processed and will be shipped soon.</p>
                                </div>
                                <span className="bg-blue-50 text-[#2874f0] px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                                    {order?.status || 'Processing'}
                                </span>
                            </div>

                            {/* Timeline */}
                            <div className="mt-8 flex justify-between relative px-2 sm:px-8">
                                <div className="absolute top-4 left-8 right-8 h-1 bg-slate-100 -z-10">
                                    <div className="h-full bg-[#2874f0] transition-all" style={{ width: isDelivered ? '100%' : isShipped ? '50%' : '25%' }}></div>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-9 h-9 rounded-full bg-[#2874f0] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                                        <span className="material-symbols-outlined text-[18px]">check</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900">Confirmed</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isShipped ? 'bg-[#2874f0] text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-400'}`}>
                                        <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                                    </div>
                                    <span className={`text-xs font-bold ${isShipped ? 'text-slate-900' : 'text-slate-500'}`}>Shipped</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isOutForDelivery ? 'bg-[#2874f0] text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-400'}`}>
                                        <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                                    </div>
                                    <span className={`text-xs font-bold ${isOutForDelivery ? 'text-slate-900' : 'text-slate-500'}`}>Out for Delivery</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDelivered ? 'bg-[#2874f0] text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-400'}`}>
                                        <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                                    </div>
                                    <span className={`text-xs font-bold ${isDelivered ? 'text-slate-900' : 'text-slate-500'}`}>Delivered</span>
                                </div>
                            </div>
                        </div>

                        {/* Item Details Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h3 className="text-base font-bold text-slate-900">Item Details</h3>
                            </div>
                            <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                <div className="w-24 h-24 bg-slate-50 rounded-xl p-2 flex shrink-0 items-center justify-center">
                                    <img
                                        src={getHDImage(order?.product?.image_url, order?.product?.name)}
                                        alt={order?.product?.name}
                                        className="w-full h-full object-contain mix-blend-multiply"
                                        onError={(e: any) => {
                                            if (!e.target.src.includes('bing.net')) {
                                                e.target.src = 'https://cdn-icons-png.flaticon.com/512/330/330714.png';
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start gap-4">
                                        <h4 className="text-lg font-bold text-slate-900 leading-snug">{order?.product?.name}</h4>
                                        <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Qty: 1</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">{order?.product?.specs || 'Standard Edition'}</p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-xl font-bold text-slate-900">₹{numPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Details Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h3 className="text-base font-bold text-slate-900">Delivery Details</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[#2874f0]">home</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Shipping Address</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            30 Rajan Nagar Orikkai,<br />
                                            Kanchipuram - 631502,<br />
                                            Tamil Nadu, India
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[#2874f0]">person</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Contact Person</h4>
                                        <p className="text-sm text-slate-600 font-medium">Nithi</p>
                                        <p className="text-sm text-slate-500 mt-0.5">+91 9363441126</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Sidebar Items) */}
                    <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">

                        {/* Price Details */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="text-base font-bold text-slate-900 mb-4">Price Details</h3>

                            <div className="space-y-3 text-sm font-medium mb-4 pb-4 border-b border-slate-100">
                                <div className="flex justify-between text-slate-600">
                                    <span>Listing Price</span>
                                    <span>₹{numPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Delivery Fees</span>
                                    <span className="text-slate-900">FREE</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="font-bold text-slate-900">Total Amount</span>
                                <span className="text-xl font-black text-slate-900">₹{numPrice.toLocaleString()}</span>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Payment Method</span>
                                    <span className="font-bold text-slate-800">{order?.payment_method || 'Cash On Delivery'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Order ID</span>
                                    <span className="font-bold text-slate-800">{order?.invoice_no || 'MDQ-PENDING'}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button className="w-full bg-[#2874f0] hover:bg-[#1a5fce] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                    Download Invoice PDF
                                </button>
                                {!isDelivered && (
                                    <button className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-lg transition-colors">
                                        Cancel Order
                                    </button>
                                )}
                            </div>

                            {order?.payment_method?.includes('Cash') && (
                                <div className="mt-6 bg-[#fff6ed] border border-[#fbd8b0] rounded-xl p-3 flex gap-3 items-start">
                                    <span className="material-symbols-outlined text-[#e87a17] text-[18px] mt-0.5 font-variation-fill">info</span>
                                    <p className="text-xs text-[#b85b0a] font-medium leading-relaxed">
                                        Please keep the cash ready at the time of delivery.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Need Help? Box */}
                        <div className="bg-[#141b2d] rounded-2xl p-6 text-white text-left relative overflow-hidden">
                            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-5">
                                Facing issues with your order or delivery? Our 24/7 support is here to help.
                            </p>
                            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                                <span className="material-symbols-outlined text-[18px]">chat</span>
                                Contact Support
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
