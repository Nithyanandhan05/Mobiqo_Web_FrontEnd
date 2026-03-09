import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { getHDImage } from '../utils/imageHelper';

interface AdminOrdersProps {
    onNavigate: (page: any, data?: any) => void;
}

export function AdminOrders({ onNavigate }: AdminOrdersProps) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/admin/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Error fetching admin orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: number, newStatus: string) => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            } else {
                alert(data.message || "Failed to update order status.");
            }
        } catch (error) {
            console.error("Error updating admin order:", error);
        }
    };

    const updateTracking = async (orderId: number, currentTracking: string) => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        const newTracking = prompt("Enter new tracking number:", currentTracking);
        if (newTracking === null) return;

        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tracking_number: newTracking })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setOrders(orders.map(o => o.id === orderId ? { ...o, tracking_number: newTracking } : o));
            } else {
                alert(data.message || "Failed to update tracking.");
            }
        } catch (error) {
            console.error("Error updating tracking info:", error);
        }
    };

    const statusClass = (status: string) =>
        status === 'Processing' ? 'bg-amber-50 text-amber-600 border-amber-200' :
        status === 'Shipped' ? 'bg-blue-50 text-blue-600 border-blue-200' :
        status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
        'bg-slate-50 text-slate-600 border-slate-200';

    return (
        <AdminLayout activeTab="orders" onNavigate={onNavigate}>
            {/* Page header — stacks on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Order Management</h1>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">Track, update and fulfill customer orders</p>
                </div>
                <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 self-start sm:self-auto">
                    <button onClick={fetchOrders} className="px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">refresh</span>
                        Refresh
                    </button>
                    <button className="px-4 py-2 rounded-lg text-sm font-bold bg-[#1f93f6] text-white hover:bg-[#157ad2] transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center text-slate-400 bg-white rounded-[32px] border border-slate-200">
                    <span className="material-symbols-outlined text-4xl animate-spin mb-4 block">progress_activity</span>
                    <p className="font-bold">Loading orders data...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="p-12 text-center text-slate-400 bg-white rounded-[32px] border border-slate-200">
                    <span className="material-symbols-outlined text-4xl mb-4 block">inbox</span>
                    <p className="font-bold">No orders found.</p>
                </div>
            ) : (
                <>
                    {/* ── Desktop table (md+) ── */}
                    <div className="hidden md:block bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto p-6">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-slate-100">
                                        <th className="pb-4 pt-2 px-4 text-xs font-black tracking-widest text-slate-400 uppercase">Order ID</th>
                                        <th className="pb-4 pt-2 px-4 text-xs font-black tracking-widest text-slate-400 uppercase">Customer</th>
                                        <th className="pb-4 pt-2 px-4 text-xs font-black tracking-widest text-slate-400 uppercase">Product</th>
                                        <th className="pb-4 pt-2 px-4 text-xs font-black tracking-widest text-slate-400 uppercase text-right">Price</th>
                                        <th className="pb-4 pt-2 px-4 text-xs font-black tracking-widest text-slate-400 uppercase text-center">Status</th>
                                        <th className="pb-4 pt-2 px-4 text-xs font-black tracking-widest text-slate-400 uppercase">Tracking</th>
                                        <th className="pb-4 pt-2 px-4 text-xs font-black tracking-widest text-slate-400 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-5 px-4">
                                                <div className="font-bold text-slate-900">{order.invoice_no}</div>
                                            </td>
                                            <td className="py-5 px-4 font-bold text-slate-700 w-48 truncate">
                                                {order.customer_name}
                                                <div className="text-xs text-slate-400 font-semibold truncate w-48 mt-1" title={order.address}>{order.address}</div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <div className="flex items-center gap-3 w-48">
                                                    <img
                                                        src={getHDImage(order.image_url, order.product_name)}
                                                        alt={order.product_name}
                                                        className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = `https://tse1.mm.bing.net/th?q=${encodeURIComponent((order.product_name || 'device').split('(')[0].trim() + ' smartphone')}&w=200&h=200&c=7&rs=1`; }}
                                                    />
                                                    <div className="truncate">
                                                        <div className="font-bold text-sm text-slate-800 truncate">{order.product_name}</div>
                                                        <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mt-0.5">{order.sku}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4 text-right font-black text-slate-900 whitespace-nowrap">{order.price}</td>
                                            <td className="py-5 px-4 text-center">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    className={`text-xs font-black tracking-wider uppercase px-3 py-1.5 rounded-lg border-2 outline-none cursor-pointer hover:opacity-80 transition-opacity ${statusClass(order.status)}`}
                                                >
                                                    <option value="Pending">PENDING</option>
                                                    <option value="Processing">PROCESSING</option>
                                                    <option value="Shipped">SHIPPED</option>
                                                    <option value="Delivered">DELIVERED</option>
                                                </select>
                                            </td>
                                            <td className="py-5 px-4">
                                                <button onClick={() => updateTracking(order.id, order.tracking_number)} className="group-hover:visible flex items-center gap-2">
                                                    {order.tracking_number ? (
                                                        <span className="text-sm font-bold text-blue-600 border-b border-blue-600/30 font-mono tracking-tight">{order.tracking_number}</span>
                                                    ) : (
                                                        <span className="text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors">+ Add Tracking</span>
                                                    )}
                                                    <span className="material-symbols-outlined text-[14px] text-slate-300 group-hover:text-blue-500 transition-colors">edit</span>
                                                </button>
                                            </td>
                                            <td className="py-5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-colors" title="View details">
                                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Mobile card list (< md) ── */}
                    <div className="md:hidden space-y-3">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                                {/* Top row: product image + name + invoice */}
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={getHDImage(order.image_url, order.product_name)}
                                        alt={order.product_name}
                                        className="w-12 h-12 object-contain rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0"
                                        onError={(e) => { (e.target as HTMLImageElement).src = `https://tse1.mm.bing.net/th?q=${encodeURIComponent((order.product_name || 'device').split('(')[0].trim() + ' smartphone')}&w=200&h=200&c=7&rs=1`; }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-sm text-slate-800 truncate">{order.product_name}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.invoice_no}</p>
                                    </div>
                                    <span className="font-black text-slate-900 text-sm flex-shrink-0">{order.price}</span>
                                </div>

                                {/* Customer */}
                                <div className="mb-3 pb-3 border-b border-slate-100">
                                    <p className="text-xs font-bold text-slate-700">{order.customer_name}</p>
                                    <p className="text-[11px] text-slate-400 font-medium truncate">{order.address}</p>
                                </div>

                                {/* Status + Tracking */}
                                <div className="flex items-center justify-between gap-3">
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                        className={`text-xs font-black tracking-wider uppercase px-3 py-1.5 rounded-lg border-2 outline-none cursor-pointer flex-1 ${statusClass(order.status)}`}
                                    >
                                        <option value="Pending">PENDING</option>
                                        <option value="Processing">PROCESSING</option>
                                        <option value="Shipped">SHIPPED</option>
                                        <option value="Delivered">DELIVERED</option>
                                    </select>
                                    <button
                                        onClick={() => updateTracking(order.id, order.tracking_number)}
                                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 flex-shrink-0"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        {order.tracking_number || 'Add Tracking'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </AdminLayout>
    );
}
