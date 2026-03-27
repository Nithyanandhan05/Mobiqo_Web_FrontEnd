import { useState, useMemo } from 'react';
import { getHDImage } from '../utils/imageHelper';

interface AIResultProps {
    data: any;
    onBack: () => void;
    onNavigate?: (page: 'home' | 'ai-assistant' | 'product-details', data?: any) => void;
}

export function AIDecisionReport({ data, onBack, onNavigate }: AIResultProps) {
    if (!data || !data.top_match) {
        return <div className="p-8 text-center text-red-500 font-bold">Error loading AI data. Please go back and try again.</div>;
    }

    // 1. Gather ALL phones and filter out exact base-name duplicates
    const allUniquePhones = useMemo(() => {
        const list: any[] = [];
        
        // Add top match
        if (data.top_match) {
            list.push({ ...data.top_match, isHeroDefault: true });
        }
        
        // Add alternatives
        if (data.alternatives && Array.isArray(data.alternatives)) {
            data.alternatives.forEach((alt: any) => list.push(alt));
        }

        // Filter duplicates by base name (ignores "8GB RAM" differences)
        const seen = new Set();
        return list.filter((phone) => {
            const baseName = (phone.name || "").split("(")[0].trim();
            if (seen.has(baseName)) return false;
            seen.add(baseName);
            return true;
        });
    }, [data]);

    // 2. State to track the currently selected phone for the Hero section
    const [selectedPhone, setSelectedPhone] = useState<any>(allUniquePhones[0] || data.top_match);

    // 3. The alternatives list shows all phones EXCEPT the currently selected one
    const displayAlts = allUniquePhones.filter(phone => phone.name !== selectedPhone.name);

    const { analysis } = data;
    const rawTopImage = selectedPhone.image_urls ? selectedPhone.image_urls[0] : selectedPhone.image_url;
    const topMatchImage = getHDImage(rawTopImage, selectedPhone.name);

    // Parse specs safely
    const camSpec = selectedPhone.camera_spec || 'Advanced System';
    const batSpec = selectedPhone.battery_spec || 'All-Day Battery';
    const procSpec = selectedPhone.processor_spec || 'Latest Gen SoC';
    const matchPercent = selectedPhone.match_percent || '95%';

    // Extract float for SVG stroke
    const matchFloat = parseFloat(matchPercent.replace('%', '')) / 100 || 0.95;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-900 font-bold hover:text-primary transition-colors text-lg"
                >
                    <span className="material-symbols-outlined font-black">arrow_back</span>
                    AI Decision Report
                </button>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Mobiqo Engine v4.2
                    </div>
                    <button className="hidden sm:flex p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                        <span className="material-symbols-outlined text-sm font-variation-fill">dark_mode</span>
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-5 gap-8">
                {/* Left Column - Top Match */}
                <div key={selectedPhone.name} className="animate-in fade-in slide-in-from-left-4 duration-500 lg:col-span-3 bg-gradient-to-br from-blue-50/80 to-sky-50/50 rounded-3xl p-6 sm:p-10 border border-blue-100/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -z-10"></div>

                    <div className="inline-flex items-center gap-1.5 bg-white text-primary text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm border border-blue-50 mb-8">
                        <span className="material-symbols-outlined text-[14px] font-variation-fill">auto_awesome</span>
                        Top Match
                    </div>

                    <div className="grid sm:grid-cols-5 gap-8 sm:gap-10 items-center mb-10">
                        <div className="sm:col-span-2 relative aspect-[3/4] bg-white rounded-2xl p-4 shadow-sm flex items-center justify-center border border-slate-50">
                            <img
                                src={topMatchImage}
                                alt={selectedPhone.name}
                                className="w-full h-full object-contain mix-blend-multiply drop-shadow-md transition-all duration-300"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Phone&background=F4FAFF&color=2962FF&size=512';
                                }}
                            />
                        </div>
                        <div className="sm:col-span-3 space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                                {selectedPhone.name}
                            </h2>
                            <p className="text-slate-500 font-medium">
                                (Premium Device Matched to Profile)
                            </p>
                            <div className="flex items-end gap-3 pt-2">
                                <span className="text-4xl font-black text-primary tracking-tight">{selectedPhone.price}</span>
                            </div>

                            <div className="flex items-center gap-4 pt-6">
                                <div className="relative w-[72px] h-[72px] flex items-center justify-center bg-white rounded-full border-[6px] border-slate-100">
                                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                        <circle cx="30" cy="30" r="27" fill="none" className="stroke-primary drop-shadow-md" strokeWidth="6" strokeDasharray="169.6" strokeDashoffset={169.6 * (1 - matchFloat)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
                                    </svg>
                                    <span className="relative text-base font-black text-slate-900">{matchPercent}</span>
                                </div>
                                <div>
                                    <div className="text-slate-900 font-black text-sm uppercase tracking-wider">AI Confidence</div>
                                    <div className="text-slate-500 text-xs mt-0.5 font-medium">Based on your usage patterns</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                        <div className="bg-white/80 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-50">
                            <span className="material-symbols-outlined text-primary mb-3">photo_camera</span>
                            <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 mt-1">Camera</div>
                            <div className="text-sm font-black text-slate-900 leading-tight truncate">{camSpec}</div>
                        </div>
                        <div className="bg-white/80 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-50">
                            <span className="material-symbols-outlined text-primary mb-3">battery_charging_full</span>
                            <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 mt-1">Battery</div>
                            <div className="text-sm font-black text-slate-900 leading-tight truncate">{batSpec}</div>
                        </div>
                        <div className="bg-white/80 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-50">
                            <span className="material-symbols-outlined text-primary mb-3">memory</span>
                            <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 mt-1">Chipset</div>
                            <div className="text-sm font-black text-slate-900 leading-tight truncate">{procSpec}</div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => onNavigate && onNavigate('product-details', selectedPhone)} className="flex-1 bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all">
                            View Full Details
                            <span className="material-symbols-outlined font-black">arrow_forward</span>
                        </button>
                        <button className="flex-1 bg-white text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                            Add to Compare
                        </button>
                    </div>
                </div>

                {/* Right Column - Analysis */}
                <div className="lg:col-span-2 border border-slate-200 rounded-3xl p-6 sm:p-8 bg-white shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined font-variation-fill">auto_awesome</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Why AI Recommended This</h3>
                    </div>

                    <div className="prose prose-sm prose-slate mb-10 text-slate-600 leading-relaxed font-medium">
                        <p>{analysis || `The ${selectedPhone.name} is an excellent choice within your budget, offering a premium design and a standout performance profile tailored specifically to your specified requirements and brand preferences.`}</p>
                    </div>

                    {displayAlts.length > 0 && (
                        <div className="border-t border-slate-100 pt-8 mt-auto">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Alternative Contenders</h4>
                            <div className="space-y-3">
                                {displayAlts.map((alt: any, idx: number) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => setSelectedPhone(alt)} // 🚀 SWAP TRIGGER
                                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <div className="w-12 h-12 bg-white border border-slate-100 shadow-sm rounded-xl p-2 flex items-center justify-center shrink-0">
                                            <img src={getHDImage(alt.image_url, alt.name)} alt={alt.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-slate-900 text-sm truncate">{alt.name}</div>
                                            <div className="text-xs text-primary font-bold truncate mt-0.5">{alt.price} • {alt.match_percent || "85%"} Match</div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">swipe_up</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Deep Dive Analysis Bottom Section */}
            <div className="mt-10 mb-6">
                <div className="flex items-center gap-2 mb-6">
                    <span className="material-symbols-outlined text-primary font-variation-fill">bar_chart</span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Deep Dive Analysis</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4">Display Quality</h4>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full mb-4">
                            <div className="bg-primary h-2.5 rounded-full w-[85%] transition-all duration-1000"></div>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Top-tier brightness and color gamut coverage matching studio-grade visuals.</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4">Battery Efficiency</h4>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full mb-4">
                            <div className="bg-primary h-2.5 rounded-full transition-all duration-1000" style={{ width: `${(matchFloat * 100) + 2}%` }}></div>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Optimized architecture ensures all-day endurance on a single charge.</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4">Camera Score</h4>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full mb-4">
                            <div className="bg-primary h-2.5 rounded-full transition-all duration-1000" style={{ width: `${(matchFloat * 100) - 3}%` }}></div>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Outperforms competitors in its segment, specifically tuned for your needs.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}