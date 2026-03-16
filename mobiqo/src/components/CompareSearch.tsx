import { useState } from 'react';
import { getHDImage } from '../utils/imageHelper';

interface SearchResult {
    id: number;
    name: string;
    price: string;
    match_percent: string;
    specs: string;
    category: string;
    image_url: string;
}

interface CompareDevice {
    name: string;
    image_url: string;
}

interface CompareSearchProps {
    onNavigate?: (page: 'home' | 'compare' | 'compare-results' | 'product-details', data?: any) => void;
}

const FILTER_CHIPS = ['All', 'Budget', 'Gaming', 'Camera', 'Flagship'];

export function CompareSearch({ onNavigate }: CompareSearchProps) {
    const [query, setQuery] = useState('');
    const [activeQuery, setActiveQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDevices, setSelectedDevices] = useState<CompareDevice[]>([]);
    const [activeFilter, setActiveFilter] = useState('All');

    const handleSearch = async () => {
        if (query.trim().length < 2) {
            setActiveQuery('');
            setResults([]);
            return;
        }

        setActiveQuery(query);
        setLoading(true);
        try {
            const res = await fetch(`/api/search_devices?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') {
                    const fetched = data.results || [];
                    fetched.sort((a: SearchResult, b: SearchResult) => {
                        if (a.match_percent === 'Exact Match' && b.match_percent !== 'Exact Match') return -1;
                        if (a.match_percent !== 'Exact Match' && b.match_percent === 'Exact Match') return 1;
                        return 0;
                    });
                    setResults(fetched);
                }
            }
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const isAdded = (name: string) => selectedDevices.some(d => d.name === name);

    const handleAdd = (result: SearchResult) => {
        if (isAdded(result.name)) return;
        if (selectedDevices.length >= 2) return;
        setSelectedDevices(prev => [...prev, { name: result.name, image_url: getHDImage(result.image_url, result.name) }]);
    };

    const handleRemove = (name: string) => {
        setSelectedDevices(prev => prev.filter(d => d.name !== name));
    };

    const handleCompare = () => {
        if (selectedDevices.length === 2 && onNavigate) {
            onNavigate('compare-results', {
                device1: selectedDevices[0].name,
                device2: selectedDevices[1].name
            });
        }
    };

    return (
        <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] pb-40">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <button onClick={() => onNavigate && onNavigate('home')} className="hover:text-primary transition-colors">
                        <span className="material-symbols-outlined font-black">arrow_back</span>
                    </button>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Compare Devices</h1>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (e.target.value.trim().length === 0) {
                                setActiveQuery('');
                                setResults([]);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch();
                        }}
                        placeholder="Search smartphones... e.g. Samsung S24 (Press Enter)"
                        className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-base font-medium text-slate-700 border border-slate-200 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none placeholder:text-slate-400"
                    />
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {FILTER_CHIPS.map(chip => (
                        <button
                            key={chip}
                            onClick={() => setActiveFilter(chip)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeFilter === chip
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            {chip}
                        </button>
                    ))}
                </div>

                {/* Results Section */}
                {activeQuery.length >= 2 && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-black text-slate-900">Search Results</h2>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                <span className="material-symbols-outlined text-sm">info</span>
                                Live Web Data
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse">
                                        <div className="w-20 h-20 bg-slate-100 rounded-xl mx-auto mb-4"></div>
                                        <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-slate-50 rounded w-1/2 mb-4"></div>
                                        <div className="h-10 bg-slate-100 rounded-xl"></div>
                                    </div>
                                ))}
                            </div>
                        ) : results.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.map((result, index) => {
                                    const added = isAdded(result.name);
                                    const isExactMatch = result.match_percent === 'Exact Match';
                                    return (
                                        <div key={index} className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all page-enter ${isExactMatch ? 'border-primary shadow-primary/10' : 'border-slate-100'}`} style={{ animationDelay: `${index * 80}ms` }}>
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shrink-0 p-2">
                                                    <img
                                                        src={getHDImage(result.image_url, result.name)}
                                                        alt={result.name}
                                                        className="w-full h-full object-contain"
                                                        // 🚀 FIXED: Replaced GSM Arena with a bulletproof unblocked placeholder!
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(result.name || 'Phone')}&background=f8fafc&color=2962ff&size=400`;
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded ${isExactMatch ? 'bg-primary text-white' : 'bg-blue-50 text-primary'}`}>
                                                            {result.match_percent}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-slate-900 text-sm leading-tight mb-0.5 truncate">{result.name}</h3>
                                                    <p className="text-xs text-primary font-bold">{result.price}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium italic">{result.specs}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAdd(result)}
                                                disabled={added || (selectedDevices.length >= 2 && !added)}
                                                className={`w-full py-3 rounded-xl font-bold text-sm transition-all btn-press ${added
                                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                                        : selectedDevices.length >= 2
                                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                            : 'bg-white text-primary border-2 border-primary hover:bg-blue-50'
                                                    }`}
                                            >
                                                {added ? '✓ Added' : '+ Add to Compare'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                                <span className="material-symbols-outlined text-4xl text-slate-200 mb-2 block">search_off</span>
                                <p className="text-slate-500 font-medium">No devices found for "{activeQuery}"</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {activeQuery.length < 2 && (
                    <div className="text-center py-16">
                        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">compare_arrows</span>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Search & Compare Smartphones</h2>
                        <p className="text-slate-500 font-medium max-w-md mx-auto">Type a smartphone name above and press Enter to search. Add 2 devices to compare their specifications side by side.</p>
                    </div>
                )}
            </div>

            {/* Bottom Compare Bar */}
            {selectedDevices.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl shadow-black/10 page-enter">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            {selectedDevices.map((device, i) => (
                                <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-2.5 border border-slate-100 relative">
                                    <button
                                        onClick={() => handleRemove(device.name)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                    <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center p-1 shrink-0">
                                        <img
                                            src={getHDImage(device.image_url, device.name)}
                                            alt={device.name}
                                            className="w-full h-full object-contain"
                                            // 🚀 FIXED: Replaced GSM Arena here too!
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f8fafc/2962ff?text=Smartphone'; }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 truncate max-w-[120px]">{device.name}</span>
                                </div>
                            ))}

                            {selectedDevices.length === 1 && (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="text-primary font-black text-xs">VS</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                        <span className="material-symbols-outlined text-lg">add_circle_outline</span>
                                        Add 2nd device
                                    </div>
                                </>
                            )}

                            {selectedDevices.length === 2 && (
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="text-primary font-black text-xs">VS</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleCompare}
                            disabled={selectedDevices.length < 2}
                            className="px-8 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            Compare Specifications
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}