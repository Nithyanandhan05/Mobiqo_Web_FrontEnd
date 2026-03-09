import { ProfileLayout } from './ProfileLayout';
import { useState, useEffect } from 'react';
import { getHDImage } from '../utils/imageHelper';

interface OrdersProps {
    onNavigate: (page: string, data?: any) => void;
}

export function Orders({ onNavigate }: OrdersProps) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('jwt_token');
            if (!token) { setLoading(false); return; }

            try {
                const res = await fetch('/api/my_orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.status === 'success') {
                    // 🚀 CORRECTLY MAPPING ALL NEW BACKEND FIELDS
                    const normalized = (data.orders || []).map((o: any) => ({
                        id: o.order_id,
                        invoice_no: o.invoice_no,
                        status: o.status,
                        order_date: o.date,
                        address: o.delivery_address,
                        customer_name: o.delivery_name,
                        payment_method: o.payment_method,
                        phone: o.delivery_phone,
                        product: {
                            name: o.product_name,
                            price: o.price,
                            image_url: o.image_url,
                        }
                    }));
                    setOrders(normalized);
                }
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getStatusText = (status: string, date: string) => {
        const s = status.toLowerCase();
        if (s.includes('delivered')) return `Delivered on ${formatDate(date)}`;
        if (s.includes('shipped')) return `Shipped on ${formatDate(date)}`;
        return `Confirmed on ${formatDate(date)}`;
    };

    const getStatusSubtext = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('delivered')) return 'Your 1-Year Warranty is now active';
        if (s.includes('shipped')) return 'Your item has been shipped';
        return 'Your item is being processed';
    };

    return (
        <ProfileLayout activeTab="orders" onNavigate={onNavigate}>
            {/* CSS ANIMATION INJECTION */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.4s ease-out forwards;
                    opacity: 0;
                }
            `}} />

            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="relative w-full md:w-2/3 flex">
                    <input type="text" placeholder="Search your orders here" className="w-full pl-4 pr-4 py-3 bg-white border border-slate-200 rounded-l-lg text-sm focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]" />
                    <button className="bg-[#2874f0] hover:bg-[#1a5fce] text-white px-6 py-3 rounded-r-lg font-bold text-sm flex items-center gap-2 transition-colors whitespace-nowrap">
                        <span className="material-symbols-outlined text-[18px]">search</span>
                        Search
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin w-8 h-8 border-4 border-[#1f93f6] border-t-transparent rounded-full"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-10 rounded-3xl border border-slate-100 text-center shadow-sm">
                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">shopping_bag</span>
                        <h3 className="text-xl font-black text-slate-900 mb-1">No Orders Yet</h3>
                        <button onClick={() => onNavigate('home')} className="mt-6 px-6 py-2.5 bg-[#1f93f6] hover:bg-[#157ad2] text-white font-bold rounded-xl shadow-md transition-colors">Start Shopping</button>
                    </div>
                ) : (
                    orders.map((order: any, idx: number) => {
                        const isDelivered = order.status?.toLowerCase().includes('delivered');
                        const isShipped = order.status?.toLowerCase().includes('shipped');

                        // Robust Price Formatting
                        const safePriceStr = String(order.product?.price || '0').replace(/[^0-9.]/g, '');
                        const numPrice = parseFloat(safePriceStr) || 0;

                        return (
                            <div
                                key={order.id || idx}
                                onClick={() => onNavigate('order-details', order)}
                                className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 hover:shadow-md transition-shadow cursor-pointer mb-[-1px] animate-fade-in-up"
                                style={{ animationDelay: `${idx * 0.08}s` }}
                            >
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
                                    {/* Left: Image */}
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center flex-shrink-0 bg-slate-50 rounded-lg border border-slate-100 p-1">
                                        <img
                                            src={getHDImage(order.product?.image_url, order.product?.name)}
                                            alt={order.product?.name}
                                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                                            onError={(e: any) => { if (!e.target.src.includes('bing.net')) e.target.src = 'https://cdn-icons-png.flaticon.com/512/330/330714.png'; }}
                                        />
                                    </div>

                                    {/* Middle: Title & Price */}
                                    <div className="flex-1 min-w-0 pr-4 flex flex-col sm:flex-row sm:gap-4 md:gap-12 w-full">
                                        <h3 className="text-sm sm:text-[15px] font-semibold text-slate-800 flex-1 truncate sm:whitespace-normal sm:line-clamp-2 leading-snug">
                                            {order.product?.name}
                                        </h3>
                                        <div className="text-sm sm:text-[15px] font-medium text-slate-800 mt-2 sm:mt-0 whitespace-nowrap">
                                            ₹{numPrice.toLocaleString('en-IN')}
                                        </div>
                                    </div>

                                    {/* Right: Status */}
                                    <div className="w-full sm:w-72 xl:w-80 flex flex-col gap-1 sm:pl-4 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isDelivered ? 'bg-green-500' : isShipped ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                                            <span className="text-sm sm:text-[15px] font-semibold text-slate-800">{getStatusText(order.status, order.order_date)}</span>
                                        </div>
                                        <p className="text-[11px] sm:text-xs text-slate-500 ml-[18px]">{getStatusSubtext(order.status)}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </ProfileLayout>
    );
}