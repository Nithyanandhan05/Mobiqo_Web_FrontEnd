import { useState, useEffect } from 'react';

interface NotificationsProps {
    onNavigate: (page: string, data?: any) => void;
}

export function Notifications({ onNavigate }: NotificationsProps) {
    const [prefs, setPrefs] = useState({
        orders: true,
        warranty: true,
        ai: true,
        promos: false
    });

    const [frequency, setFrequency] = useState('daily');
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        const fetchPrefs = async () => {
            const token = localStorage.getItem('jwt_token');
            if (!token) return;
            try {
                const res = await fetch('/api/notifications/preferences', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.status === 'success' && data.preferences) {
                    const p = data.preferences;
                    setPrefs({
                        orders: p.order_updates,
                        warranty: p.warranty_alerts,
                        ai: p.ai_updates,
                        promos: p.promotions
                    });
                    setFrequency(p.frequency === 'Instant' ? 'instant' : p.frequency === 'Weekly summary' ? 'weekly' : 'daily');
                }
            } catch (err) {
                console.error("Failed to fetch notification preferences", err);
            }
        };

        const fetchNotifications = async () => {
            const token = localStorage.getItem('jwt_token');
            if (!token) return;
            try {
                const res = await fetch('/api/notifications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.status === 'success' && data.notifications) {
                    setNotifications(data.notifications);
                }
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            }
        };

        fetchPrefs();
        fetchNotifications();
    }, []);

    const updatePrefs = async (newPrefs: any, newFreq?: string) => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        const freqMap: any = { 'instant': 'Instant', 'daily': 'Daily summary', 'weekly': 'Weekly summary' };

        try {
            await fetch('/api/notifications/preferences', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_updates: newPrefs.orders,
                    warranty_alerts: newPrefs.warranty,
                    ai_updates: newPrefs.ai,
                    promotions: newPrefs.promos,
                    frequency: freqMap[newFreq || frequency]
                })
            });
        } catch (err) {
            console.error("Failed to update preferences", err);
        }
    };

    const togglePref = (key: keyof typeof prefs) => {
        const newPrefs = { ...prefs, [key]: !prefs[key] };
        setPrefs(newPrefs);
        updatePrefs(newPrefs);
    };

    const handleFrequencyChange = (f: string) => {
        setFrequency(f);
        updatePrefs(prefs, f);
    };

    const markAsRead = async (id: number) => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;
        try {
            await fetch(`/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    return (
        // 🚀 FIX: Removed the <ProfileLayout> wrapper because your App router
        // is already providing the layout. Wrapping it twice caused the double sidebar!
        <div className="w-full flex flex-col gap-6 animate-fade-in">
            <div className="mb-2">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Notifications & Alerts</h1>
                <p className="text-sm font-medium text-slate-500">Manage how you receive updates and communication from the platform.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                
                {/* --- LEFT COLUMN: PREFERENCES --- */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-blue-50 text-[#1f93f6] rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined font-variation-fill">settings</span>
                        </div>
                        <h2 className="text-xl font-black text-slate-900">Preferences</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Order Updates */}
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h3 className="text-base font-black text-slate-900">Order Updates</h3>
                                <p className="text-xs font-bold text-slate-500 mt-1 max-w-[250px]">Track your electronics purchases and shipping status in real-time.</p>
                            </div>
                            <button
                                onClick={() => togglePref('orders')}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${prefs.orders ? 'bg-[#1f93f6]' : 'bg-slate-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prefs.orders ? 'translate-x-5' : 'translate-x-0'}`}></span>
                            </button>
                        </div>

                        {/* Warranty Alerts */}
                        <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-100">
                            <div>
                                <h3 className="text-base font-black text-slate-900">Warranty Alerts</h3>
                                <p className="text-xs font-bold text-slate-500 mt-1 max-w-[250px]">Get notified before your product coverage ends.</p>
                            </div>
                            <button
                                onClick={() => togglePref('warranty')}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${prefs.warranty ? 'bg-[#1f93f6]' : 'bg-slate-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prefs.warranty ? 'translate-x-5' : 'translate-x-0'}`}></span>
                            </button>
                        </div>

                        {/* AI Updates */}
                        <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-100">
                            <div>
                                <h3 className="text-base font-black text-slate-900">AI Recommendations</h3>
                                <p className="text-xs font-bold text-slate-500 mt-1 max-w-[250px]">New electronics matched for you based on browsing history.</p>
                            </div>
                            <button
                                onClick={() => togglePref('ai')}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${prefs.ai ? 'bg-[#1f93f6]' : 'bg-slate-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prefs.ai ? 'translate-x-5' : 'translate-x-0'}`}></span>
                            </button>
                        </div>

                        {/* Promos */}
                        <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-100">
                            <div>
                                <h3 className="text-base font-black text-slate-900">Promotional Offers</h3>
                                <p className="text-xs font-bold text-slate-500 mt-1 max-w-[250px]">Exclusive deals, discounts, and early access events.</p>
                            </div>
                            <button
                                onClick={() => togglePref('promos')}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${prefs.promos ? 'bg-[#1f93f6]' : 'bg-slate-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prefs.promos ? 'translate-x-5' : 'translate-x-0'}`}></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: NOTIFICATIONS & FREQUENCY --- */}
                <div className="flex flex-col gap-8">
                    
                    {/* Recent Alerts */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined font-variation-fill">notifications</span>
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Recent Alerts</h2>
                        </div>

                        {notifications.length === 0 ? (
                            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-center shadow-inner mt-4">
                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">notifications_paused</span>
                                <h3 className="text-sm font-bold text-slate-500">You're all caught up!</h3>
                                <p className="text-xs text-slate-400 mt-1">No new notifications right now.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {notifications.map((notif: any) => (
                                    <div key={notif.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-sm font-black text-slate-900">{notif.title}</h3>
                                            <p className="text-xs font-semibold text-slate-600 mt-1">{notif.message}</p>
                                        </div>
                                        <button onClick={() => markAsRead(notif.id)} className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
                                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reminder Frequency */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-black text-slate-900 mb-4">Reminder Frequency</h2>
                        <div className="flex flex-col gap-3">
                            <label className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-colors cursor-pointer ${frequency === 'instant' ? 'border-[#1f93f6] bg-blue-50/30' : 'border-slate-100 bg-white'}`}>
                                <input
                                    type="radio"
                                    name="frequency"
                                    value="instant"
                                    checked={frequency === 'instant'}
                                    onChange={() => handleFrequencyChange('instant')}
                                    className="w-4 h-4 accent-[#1f93f6]"
                                />
                                <span className="text-sm font-bold text-slate-700">Instant Push Notifications</span>
                            </label>

                            <label className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-colors cursor-pointer ${frequency === 'daily' ? 'border-[#1f93f6] bg-blue-50/30' : 'border-slate-100 bg-white'}`}>
                                <input
                                    type="radio"
                                    name="frequency"
                                    value="daily"
                                    checked={frequency === 'daily'}
                                    onChange={() => handleFrequencyChange('daily')}
                                    className="w-4 h-4 accent-[#1f93f6]"
                                />
                                <span className="text-sm font-bold text-slate-700">Daily Summary</span>
                            </label>

                            <label className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-colors cursor-pointer ${frequency === 'weekly' ? 'border-[#1f93f6] bg-blue-50/30' : 'border-slate-100 bg-white'}`}>
                                <input
                                    type="radio"
                                    name="frequency"
                                    value="weekly"
                                    checked={frequency === 'weekly'}
                                    onChange={() => handleFrequencyChange('weekly')}
                                    className="w-4 h-4 accent-[#1f93f6]"
                                />
                                <span className="text-sm font-bold text-slate-700">Weekly Summary</span>
                            </label>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}