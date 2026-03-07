import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';

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
        if (newTracking === null) return; // cancelled

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

    return (
        <AdminLayout activeTab="orders" onNavigate={onNavigate}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order Management</h1>
                    <p className="text-sm font-bold text-slate-500 mt-2">Track, update and fulfill customer orders</p>
                </div>
                <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
                    <button onClick={fetchOrders} className="px-5 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">refresh</span>
                        Refresh
                    </button>
                    <button className="px-5 py-2 rounded-lg text-sm font-bold bg-[#1f93f6] text-white hover:bg-[#157ad2] transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1 p-6">
                    {loading ? (
                        <div className="p-12 text-center text-slate-400">
                            <span className="material-symbols-outlined text-4xl animate-spin mb-4">progress_activity</span>
                            <p className="font-bold">Loading orders data...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <span className="material-symbols-outlined text-4xl mb-4">inbox</span>
                            <p className="font-bold">No orders found.</p>
                        </div>
                    ) : (
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
                                                <img src={order.image_url} alt="product" className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/f8fafc/94a3b8?text=Device'; }} />
                                                <div className="truncate">
                                                    <div className="font-bold text-sm text-slate-800 truncate">{order.product_name}</div>
                                                    <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mt-0.5">{order.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 text-right font-black text-slate-900 whitespace-nowrap">
                                            {order.price}
                                        </td>
                                        <td className="py-5 px-4 text-center">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className={`text-xs font-black tracking-wider uppercase px-3 py-1.5 rounded-lg border-2 outline-none cursor-pointer hover:opacity-80 transition-opacity ${order.status === 'Processing' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                    order.status === 'Shipped' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                            'bg-slate-50 text-slate-600 border-slate-200'
                                                    }`}
                                            >
                                                <option value="Pending">PENDING</option>
                                                <option value="Processing">PROCESSING</option>
                                                <option value="Shipped">SHIPPED</option>
                                                <option value="Delivered">DELIVERED</option>
                                            </select>
                                        </td>
                                        <td className="py-5 px-4">
                                            <button
                                                onClick={() => updateTracking(order.id, order.tracking_number)}
                                                className="group-hover:visible flex items-center gap-2"
                                            >
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
                                                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-colors tooltip-trigger relative" title="View details">
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
