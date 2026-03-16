import { useState, useEffect } from 'react';
import { getHDImage } from '../utils/imageHelper';

interface DeviceSpecs {
    id?: number;
    name: string;
    price: string;
    spec_score: string;
    release_date: string;
    image_url: string;
    performance: { processor: string; cores: string; ram: string };
    display: { type: string; resolution: string; refresh_rate: string; size: string };
    camera: { rear_main: string; rear_secondary: string; rear_tertiary: string; front: string };
    battery: { capacity: string; charging: string };
    storage: { internal: string; type: string };
    pros: string[];
    cons: string[];
    antutu_score: string;
    battery_life: string;
    expert_score: string;
}

interface CompareResultsProps {
    onNavigate?: (page: 'home' | 'compare' | 'compare-results' | 'product-details', data?: any) => void;
    device1Name: string;
    device2Name: string;
}

interface SpecSection {
    title: string;
    rows: { label: string; val1: string; val2: string }[];
}

export function CompareResults({ onNavigate, device1Name, device2Name }: CompareResultsProps) {
    const [device1, setDevice1] = useState<DeviceSpecs | null>(null);
    const [device2, setDevice2] = useState<DeviceSpecs | null>(null);
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // 1. Create a flag to track if the component is actively on screen
        let isMounted = true;

        const fetchComparison = async () => {
            setLoading(true);
            setError('');
            try {
                // Keep the /api prefix since you set up the Vite proxy!
                const res = await fetch('/api/compare_devices', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ device1: device1Name, device2: device2Name })
                });

                // 2. If the component unmounted (or this is the ghost request), STOP HERE.
                if (!isMounted) return;

                if (res.ok) {
                    const json = await res.json();
                    if (json.status === 'success') {
                        setDevice1(json.data.device1);
                        setDevice2(json.data.device2);
                        setAnalysis(json.data.ai_analysis || '');
                    } else {
                        setError('Failed to compare devices. Please try again.');
                    }
                } else {
                    setError('Server error. Please try again later.');
                }
            } catch {
                if (isMounted) setError('Unable to connect to the server. Please check your connection.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchComparison();

        // 3. Cleanup function: When React runs the ghost request, it instantly unmounts the previous one.
        return () => {
            isMounted = false;
        };
    }, [device1Name, device2Name]);

    const buildSpecSections = (): SpecSection[] => {
        if (!device1 || !device2) return [];
        return [
            {
                title: 'Summary',
                rows: [
                    { label: 'Spec Score', val1: device1.spec_score, val2: device2.spec_score },
                    { label: 'Release Date', val1: device1.release_date, val2: device2.release_date },
                ]
            },
            {
                title: 'Performance',
                rows: [
                    { label: 'Processor', val1: device1.performance.processor, val2: device2.performance.processor },
                    { label: 'Cores (Max Freq)', val1: device1.performance.cores, val2: device2.performance.cores },
                    { label: 'RAM', val1: device1.performance.ram, val2: device2.performance.ram },
                ]
            },
            {
                title: 'Display',
                rows: [
                    { label: 'Screen Size', val1: device1.display.size, val2: device2.display.size },
                    { label: 'Type', val1: device1.display.type, val2: device2.display.type },
                    { label: 'Resolution', val1: device1.display.resolution, val2: device2.display.resolution },
                    { label: 'Refresh Rate', val1: device1.display.refresh_rate, val2: device2.display.refresh_rate },
                ]
            },
            {
                title: 'Camera',
                rows: [
                    { label: 'Main Rear', val1: device1.camera.rear_main, val2: device2.camera.rear_main },
                    { label: 'Secondary', val1: device1.camera.rear_secondary, val2: device2.camera.rear_secondary },
                    { label: 'Tertiary', val1: device1.camera.rear_tertiary, val2: device2.camera.rear_tertiary },
                    { label: 'Front', val1: device1.camera.front, val2: device2.camera.front },
                ]
            },
            {
                title: 'Battery',
                rows: [
                    { label: 'Capacity', val1: device1.battery.capacity, val2: device2.battery.capacity },
                    { label: 'Charging', val1: device1.battery.charging, val2: device2.battery.charging },
                ]
            },
            {
                title: 'Storage',
                rows: [
                    { label: 'Internal', val1: device1.storage.internal, val2: device2.storage.internal },
                    { label: 'Type', val1: device1.storage.type, val2: device2.storage.type },
                ]
            },
            {
                title: 'Benchmarks',
                rows: [
                    { label: 'AnTuTu Score', val1: device1.antutu_score, val2: device2.antutu_score },
                    { label: 'Battery Life', val1: device1.battery_life, val2: device2.battery_life },
                    { label: 'Expert Score', val1: device1.expert_score, val2: device2.expert_score },
                ]
            },
        ];
    };

    if (loading) {
        return (
            <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                    <div className="flex items-center gap-3 mb-8">
                        <button onClick={() => onNavigate && onNavigate('compare')} className="hover:text-primary transition-colors">
                            <span className="material-symbols-outlined font-black">arrow_back</span>
                        </button>
                        <h1 className="text-2xl font-black text-slate-900">Compare Devices</h1>
                    </div>

                    <div className="text-center py-20">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">AI is comparing devices...</h2>
                        <p className="text-slate-500 font-medium">Fetching live specifications from the web</p>
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse w-40 h-14"></div>
                            <span className="text-primary font-black">VS</span>
                            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse w-40 h-14"></div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                    <div className="flex items-center gap-3 mb-8">
                        <button onClick={() => onNavigate && onNavigate('compare')} className="hover:text-primary transition-colors">
                            <span className="material-symbols-outlined font-black">arrow_back</span>
                        </button>
                        <h1 className="text-2xl font-black text-slate-900">Compare Devices</h1>
                    </div>
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                        <span className="material-symbols-outlined text-5xl text-red-300 mb-4 block">error</span>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Comparison Failed</h2>
                        <p className="text-slate-500 font-medium mb-6">{error}</p>
                        <button onClick={() => onNavigate && onNavigate('compare')} className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all btn-press">
                            Try Again
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (!device1 || !device2) return null;

    const specSections = buildSpecSections();

    return (
        <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] pb-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <button onClick={() => onNavigate && onNavigate('compare')} className="hover:text-primary transition-colors">
                            <span className="material-symbols-outlined font-black">arrow_back</span>
                        </button>
                        <h1 className="text-2xl font-black text-slate-900">Compare Devices</h1>
                    </div>
                    <button
                        onClick={() => onNavigate && onNavigate('compare')}
                        className="bg-primary text-white font-bold py-2.5 px-5 rounded-xl text-sm flex items-center gap-1.5 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all btn-press"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add Device
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-10">
                    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm text-center page-enter">
                        <div className="w-32 h-32 mx-auto mb-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-3">
                            <img src={getHDImage(device1.image_url, device1.name)} alt={device1.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g-sm-s928-u1.jpg'; }} />
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mb-2">
                            <span className="material-symbols-outlined text-emerald-500 text-sm font-variation-fill">verified</span>
                            <span className="text-xs font-bold text-emerald-600">{device1.spec_score} Score</span>
                        </div>
                        <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight mb-1">{device1.name}</h3>
                        <p className="text-primary font-black text-lg">{device1.price}</p>
                    </div>

                    <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl p-5 sm:p-6 border border-blue-100/50 shadow-sm flex flex-col items-center justify-center text-center page-enter" style={{ animationDelay: '100ms' }}>
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
                        </div>
                        <h3 className="font-black text-slate-900 text-sm mb-2">AI Comparison Summary</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{analysis}</p>
                        <div className="flex gap-2 mt-3">
                            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500">Display Focus</span>
                            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500">Next-gen CPU</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm text-center page-enter" style={{ animationDelay: '200ms' }}>
                        <div className="w-32 h-32 mx-auto mb-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-3">
                            <img src={getHDImage(device2.image_url, device2.name)} alt={device2.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g-sm-s928-u1.jpg'; }} />
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mb-2">
                            <span className="material-symbols-outlined text-emerald-500 text-sm font-variation-fill">verified</span>
                            <span className="text-xs font-bold text-emerald-600">{device2.spec_score} Score</span>
                        </div>
                        <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight mb-1">{device2.name}</h3>
                        <p className="text-primary font-black text-lg">{device2.price}</p>
                    </div>
                </div>

                {specSections.map((section, sIdx) => (
                    <div key={sIdx} className="mb-2">
                        <div className="px-2 py-3 border-b border-slate-200">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{section.title}</h3>
                        </div>

                        {section.rows.map((row, rIdx) => (
                            <div
                                key={rIdx}
                                className={`grid grid-cols-3 py-4 px-2 border-b border-slate-100 text-sm ${rIdx % 2 === 0 ? 'bg-white/50' : ''}`}
                            >
                                <div className="font-bold text-slate-600 flex items-center">{row.label}</div>
                                <div className="text-center font-medium text-slate-800">{row.val1 || '—'}</div>
                                <div className="text-center font-medium text-slate-800">{row.val2 || '—'}</div>
                            </div>
                        ))}
                    </div>
                ))}

                <div className="grid grid-cols-2 gap-6 mt-8 mb-8">
                    <div className="space-y-4">
                        <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-100/50">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-emerald-500 font-variation-fill text-lg">thumb_up</span>
                                <h4 className="font-black text-emerald-700 text-sm uppercase tracking-wider">Pros</h4>
                            </div>
                            <ul className="space-y-2">
                                {device1.pros.map((pro, i) => (
                                    <li key={i} className="text-xs text-slate-600 font-medium flex items-start gap-2">
                                        <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                                        {pro}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-red-50/60 rounded-2xl p-5 border border-red-100/50">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-red-400 font-variation-fill text-lg">thumb_down</span>
                                <h4 className="font-black text-red-600 text-sm uppercase tracking-wider">Cons</h4>
                            </div>
                            <ul className="space-y-2">
                                {device1.cons.map((con, i) => (
                                    <li key={i} className="text-xs text-slate-600 font-medium flex items-start gap-2">
                                        <span className="text-red-400 mt-0.5 shrink-0">•</span>
                                        {con}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-100/50">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-emerald-500 font-variation-fill text-lg">thumb_up</span>
                                <h4 className="font-black text-emerald-700 text-sm uppercase tracking-wider">Pros</h4>
                            </div>
                            <ul className="space-y-2">
                                {device2.pros.map((pro, i) => (
                                    <li key={i} className="text-xs text-slate-600 font-medium flex items-start gap-2">
                                        <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                                        {pro}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-red-50/60 rounded-2xl p-5 border border-red-100/50">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-red-400 font-variation-fill text-lg">thumb_down</span>
                                <h4 className="font-black text-red-600 text-sm uppercase tracking-wider">Cons</h4>
                            </div>
                            <ul className="space-y-2">
                                {device2.cons.map((con, i) => (
                                    <li key={i} className="text-xs text-slate-600 font-medium flex items-start gap-2">
                                        <span className="text-red-400 mt-0.5 shrink-0">•</span>
                                        {con}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="text-center py-6 text-xs text-slate-400 font-medium border-t border-slate-100">
                    © 2026 Mobiqo. Expert Comparison Dashboard.
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl shadow-black/10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-center gap-4 flex-wrap">
                    <button onClick={() => onNavigate && onNavigate('product-details', { name: device1.name, image: getHDImage(device1.image_url, device1.name) })} className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors btn-press">
                        View Details
                    </button>
                    <button onClick={() => onNavigate && onNavigate('product-details', { name: device1.name, image: getHDImage(device1.image_url, device1.name) })} className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all btn-press">
                        Buy Now
                    </button>

                    <button onClick={() => onNavigate && onNavigate('product-details', { name: device2.name, image: getHDImage(device2.image_url, device2.name) })} className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors btn-press">
                        View Details
                    </button>
                    <button onClick={() => onNavigate && onNavigate('product-details', { name: device2.name, image: getHDImage(device2.image_url, device2.name) })} className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all btn-press">
                        Buy Now
                    </button>

                    <button onClick={() => onNavigate && onNavigate('compare')} className="px-4 py-3 rounded-xl text-red-500 font-bold text-xs hover:bg-red-50 transition-colors btn-press flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">delete</span>
                        Remove All
                    </button>
                </div>
            </div>
        </main>
    );
}