import { useEffect, useState } from 'react';
import { getHDImage } from '../utils/imageHelper';
import { downloadInvoice } from '../utils/invoiceGenerator';

interface OrderDetailsProps {
    onNavigate: (page: any, data?: any) => void;
    order: any;
}

export function OrderDetails({ onNavigate, order }: OrderDetailsProps) {
    const [progress, setProgress] = useState(0);
    const [downloading, setDownloading] = useState(false);
    
    // Local Status state for immediate UI feedback
    const [localStatus, setLocalStatus] = useState(order?.status || 'Processing');
    const [isCancelling, setIsCancelling] = useState(false);

    // Computed flags based on local status
    const currentStatusStr = localStatus.toLowerCase();
    const isCancelled = currentStatusStr.includes('cancel');
    const isDelivered = currentStatusStr.includes('delivered');
    const isShipped = currentStatusStr.includes('shipped') || isDelivered;
    const isOutForDelivery = currentStatusStr.includes('out for delivery') || isDelivered;

    // 🚀 NEW: Foolproof check to ensure the Cancel button shows up!
    const canCancel = !isDelivered && !isShipped && !isCancelled && !currentStatusStr.includes('refund');

    const handleDownloadInvoice = async () => {
        setDownloading(true);
        const basePrice = order?.product?.price?.replace(/[\$,₹]/g, '') || '0';
        try {
            await downloadInvoice({
                invoice_no: order?.invoice_no || `MDQ-${Date.now()}`,
                order_date: order?.order_date || '',
                customer_name: order?.customer_name || localStorage.getItem('userName') || 'Customer',
                phone: order?.phone || '',
                address: order?.address || '',
                payment_method: order?.payment_method || 'Online',
                product_name: order?.product?.name || 'Product',
                product_image_url: order?.product?.image_url || '',
                price: parseFloat(basePrice) || 0,
                status: localStatus,
            });
        } catch (err) {
            console.error('Invoice generation failed:', err);
            alert('Failed to generate invoice. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    // Handle API Cancellation Call
    const handleCancelOrder = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        setIsCancelling(true);
        try {
            // Grab the correct token key from localStorage
            const token = localStorage.getItem('jwt_token'); 
            const orderId = order?.id || order?.order_id;
            
            const response = await fetch(`/api/cancel_order/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Ensure the Authorization header is always formatted correctly
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setLocalStatus('Cancelled');
                alert("Order cancelled successfully.");
            } else {
                alert(data.message || "Failed to cancel order.");
            }
        } catch (error) {
            console.error("Cancel order error:", error);
            alert("An error occurred while cancelling the order.");
        } finally {
            setIsCancelling(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const basePrice = order?.product?.price?.replace(/[\$,₹]/g, '') || '0';
    const numPrice = parseFloat(basePrice);

    // Timeline logic
    const steps = [
        { label: 'Ordered' },
        { label: 'Shipped' },
        { label: 'Out for delivery' },
        { label: 'Delivered' }
    ];

    const activeIndex = isDelivered ? 3 : isOutForDelivery ? 2 : isShipped ? 1 : 0;
    const targetProgress = activeIndex * 33.33;

    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(targetProgress);
        }, 150);
        return () => clearTimeout(timer);
    }, [targetProgress]);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <main className="flex-1 bg-[#f1f3f6] min-h-[calc(100vh-80px)] pb-10 animate-fade-in">
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
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* Left Column */}
                    <div className="flex-1 flex flex-col gap-6 w-full">

                        {/* Status & Animated Timeline Card */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h2 className={`text-2xl font-bold capitalize mb-1 ${isCancelled ? 'text-red-600' : 'text-slate-900'}`}>
                                        {localStatus}
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        {isCancelled ? "This order has been cancelled and will not be shipped." :
                                         isDelivered ? "Your package has been delivered successfully!" : 
                                         "Your order is being processed and will be shipped soon."}
                                    </p>
                                </div>
                            </div>

                            {/* HIDE TIMELINE IF CANCELLED */}
                            {!isCancelled && (
                                <div className="mt-8 mb-4 relative px-2 sm:px-6">
                                    <div className="absolute top-[15px] left-10 right-10 h-1.5 bg-slate-200 rounded-full z-0">
                                        <div
                                            className="h-full bg-[#primary] transition-all duration-1000 ease-out rounded-full shadow-[0_0_8px_rgba(40,116,240,0.5)]"
                                            style={{ width: `${progress}%`, backgroundColor: '#2874f0' }}
                                        ></div>
                                    </div>

                                    <div className="flex justify-between relative z-10">
                                        {steps.map((step, idx) => {
                                            const requiredProgress = idx * 33.33;
                                            const isReached = progress >= requiredProgress - 1;

                                            return (
                                                <div key={idx} className="flex flex-col items-center gap-2 w-16 sm:w-20">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 delay-[100ms] ${isReached
                                                        ? 'bg-[#2874f0] text-white border-[3px] border-white shadow-md'
                                                        : 'bg-white text-slate-300 border-[3px] border-slate-200'
                                                        }`}>
                                                        {isReached ? (
                                                            <span className="material-symbols-outlined text-[16px] font-black">check</span>
                                                        ) : (
                                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 hidden"></div>
                                                        )}
                                                    </div>
                                                    <span className={`text-[11px] sm:text-xs text-center font-bold tracking-tight transition-colors duration-500 delay-[100ms] ${isReached ? 'text-slate-800' : 'text-slate-400'}`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Item Details Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h3 className="text-base font-bold text-slate-900">Item Details</h3>
                            </div>
                            <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                <div className="w-24 h-24 bg-slate-50 rounded-xl p-2 flex shrink-0 items-center justify-center">
                                    <img
                                        src={getHDImage(order?.product?.image_url, order?.product?.name)}
                                        alt={order?.product?.name}
                                        className={`max-h-full max-w-full object-contain mix-blend-multiply ${isCancelled ? 'opacity-50 grayscale' : ''}`}
                                        onError={(e: any) => { if (!e.target.src.includes('bing.net')) e.target.src = 'https://cdn-icons-png.flaticon.com/512/330/330714.png'; }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start gap-4">
                                        <h4 className={`text-lg font-bold leading-snug ${isCancelled ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{order?.product?.name || "Unknown Product"}</h4>
                                        <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Qty: 1</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className={`text-xl font-bold ${isCancelled ? 'text-slate-400 line-through' : 'text-slate-900'}`}>₹{numPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Details Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
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
                                            {order?.address || "Address details not available."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[#2874f0]">person</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Contact Person</h4>
                                        <p className="text-sm text-slate-600 font-medium">{order?.customer_name || "Customer"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Sidebar Items) */}
                    <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 mb-4">Price Details</h3>
                            <div className="space-y-3 text-sm font-medium mb-4 pb-4 border-b border-slate-100">
                                <div className="flex justify-between text-slate-600">
                                    <span>Listing Price</span>
                                    <span>₹{numPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Delivery Fees</span>
                                    <span className="text-emerald-600 font-bold">FREE</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-bold text-slate-900">Total Amount</span>
                                <span className={`text-xl font-black ${isCancelled ? 'text-slate-400 line-through' : 'text-slate-900'}`}>₹{numPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Payment Method</span>
                                    <span className="font-bold text-slate-800">{order?.payment_method || 'Online'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Order Date</span>
                                    <span className="font-bold text-slate-800">{formatDate(order?.order_date)}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleDownloadInvoice}
                                    disabled={downloading}
                                    className="w-full bg-[#2874f0] hover:bg-[#1a5fce] disabled:opacity-70 disabled:cursor-wait text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">
                                        {downloading ? 'progress_activity' : 'download'}
                                    </span>
                                    {downloading ? 'Generating PDF…' : 'Download Invoice'}
                                </button>

                                {/* 🚀 The Guaranteed Cancel Button */}
                                {canCancel && (
                                    <button 
                                        onClick={handleCancelOrder}
                                        disabled={isCancelling}
                                        className="w-full bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                                    >
                                        {isCancelling ? (
                                            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        )}
                                        {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}