import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';

interface AdminSettingsProps {
    onNavigate: (page: any, data?: any) => void;
}

export function AdminSettings({ onNavigate }: AdminSettingsProps) {
    const [settings, setSettings] = useState<any>({
        is_enabled: true,
        gaming: 30,
        camera: 30,
        battery: 20,
        budget: 20,
        engine_mode: 'balanced'
    });
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchSettings = async () => {
            const token = localStorage.getItem('jwt_token');
            const res = await fetch('/api/admin/ai_settings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSettings({
                    is_enabled: data.data.is_enabled,
                    gaming: data.data.gaming,
                    camera: data.data.camera,
                    battery: data.data.battery,
                    budget: data.data.budget,
                    engine_mode: data.data.engine_mode
                });
                setLogs(data.data.logs);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        const token = localStorage.getItem('jwt_token');
        await fetch('/api/admin/ai_settings', {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        alert('Settings saved successfully!');
    };

    return (
        <AdminLayout activeTab="settings" onNavigate={onNavigate}>
            {/* Page header — stacks on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-10">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">System Settings</h1>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Manage AI recommendation engine priorities and configurations.</p>
                </div>
                <button onClick={handleSave} className="w-full sm:w-auto px-5 py-2.5 bg-primary rounded-xl text-sm font-black text-white hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-xl">save</span>
                    Save Configuration
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Algorithm Weights */}
                <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-lg md:text-xl font-black text-slate-900 mb-5 md:mb-6">Algorithm Weights</h2>

                    <div className="space-y-5 md:space-y-6">
                        {[
                            { key: 'gaming', label: 'Gaming Importance' },
                            { key: 'camera', label: 'Camera Importance' },
                            { key: 'battery', label: 'Battery Importance' },
                            { key: 'budget', label: 'Budget Importance' },
                        ].map(({ key, label }) => (
                            <div key={key}>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-slate-700">{label}</label>
                                    <span className="text-primary font-black">{settings[key]}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={settings[key]}
                                    onChange={e => setSettings({ ...settings, [key]: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Usage Logs */}
                <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-lg md:text-xl font-black text-slate-900 mb-5 md:mb-6">AI Usage Logs</h2>
                    <div className="space-y-3 md:space-y-4 max-h-[300px] overflow-y-auto pr-1">
                        {logs.map((log, i) => (
                            <div key={i} className="flex flex-col p-3 md:p-4 border border-slate-100 rounded-2xl bg-slate-50">
                                <div className="flex justify-between items-center mb-2 gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{log.date} - {log.log_id}</span>
                                    <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-md flex-shrink-0">{log.match_percent}% Match</span>
                                </div>
                                <span className="text-xs md:text-sm font-bold text-slate-800 break-words mb-1">Q: {log.preferences}</span>
                                <span className="text-xs md:text-sm font-bold text-emerald-600">A: {log.product}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
