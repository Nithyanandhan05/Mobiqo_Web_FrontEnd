import { useState } from 'react';
import type { CartItem } from '../App';
import { getHDImage } from '../utils/imageHelper';

interface ProductDetailsProps {
    onNavigate?: (page: 'home' | 'ai-assistant' | 'product-details' | 'cart', data?: any) => void;
    product?: any;
    onAddToCart?: (item: CartItem, sourceElement?: HTMLElement | null) => void;
    onBuyNow?: (item: CartItem) => void;
}

export function ProductDetails({ onNavigate, product, onAddToCart, onBuyNow }: ProductDetailsProps) {
    const [selectedStorage, setSelectedStorage] = useState('128 GB');

    // Parse given product or default to mock data
    const phoneName = product?.name || 'Motorola Edge 70';
    const rawImage = product?.image_url || product?.image || 'https://m-cdn.phonearena.com/images/phones/85375-350/OnePlus-Nord-CE-4.jpg';
    const mainImage = getHDImage(rawImage, phoneName);
    const matchPercent = product?.match_percent || '99%';

    const parsePriceStr = (priceStr: any, defaultVal: number) => {
        if (!priceStr) return defaultVal;
        if (typeof priceStr === 'number') return priceStr;
        const parsed = parseInt(String(priceStr).replace(/[^0-9]/g, ''), 10);
        return isNaN(parsed) ? defaultVal : parsed;
    };

    const displayPrice = parsePriceStr(product?.price, 29999);
    const displayOriginalPrice = displayPrice + 5000;
    const discountPercent = Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100);

    const aiAnalysis = [
        { label: 'Performance', score: '99%', desc: 'Flagship Octa-Core Processor', width: '99%' },
        { label: 'Camera', score: '94%', desc: '50MP Triple Camera Setup', width: '94%' },
        { label: 'Battery', score: '97%', desc: '5000mAh Long Life Battery', width: '97%' },
        { label: 'Gaming', score: '93%', desc: 'Optimized Heat Management', width: '93%' },
        { label: 'Display', score: '97%', desc: '6.7 inch Fluid AMOLED', width: '97%' },
    ];

    const storages = ['128 GB', '256 GB', '512 GB'];

    return (
        <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] pb-20">
            <div className="max-w-7xl mx-auto px-6 py-6 sm:py-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
                    <button onClick={() => onNavigate && onNavigate('home')} className="hover:text-primary transition-colors">Home</button>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <button className="hover:text-primary transition-colors">Smartphones</button>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-slate-900 font-bold">{phoneName}</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
                    {/* Left Column: Image Gallery (Thumbnails Removed) */}
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-700 delay-150 fill-mode-both">
                        <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-white rounded-3xl border border-slate-100 flex items-center justify-center p-8 shadow-sm group">
                            <button className="absolute top-6 right-6 w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors z-10">
                                <span className="material-symbols-outlined font-medium">favorite</span>
                            </button>
                            <img
                                src={mainImage}
                                alt={phoneName}
                                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + phoneName + '&background=F4FAFF&color=2962FF&size=512';
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col animate-in fade-in slide-in-from-right-8 duration-700 delay-300 fill-mode-both">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">
                                    {phoneName}
                                </h1>
                                <p className="text-slate-500 font-medium">Released: Q4 2024 &bull; 5G Enabled</p>
                            </div>
                            <div className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[3px] border-primary bg-blue-50/50 shrink-0 shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 border-[6px] border-transparent border-t-primary rounded-full transform rotate-45"></div>
                                <span className="font-black text-primary text-base sm:text-xl leading-none">{matchPercent}</span>
                                <span className="text-[8px] sm:text-[10px] font-bold text-primary uppercase tracking-wider">Match</span>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 sm:gap-4 mb-2">
                                <span className="text-3xl sm:text-4xl font-black text-primary">₹{displayPrice.toLocaleString('en-IN')}</span>
                                <span className="text-xl sm:text-2xl font-bold text-slate-300 line-through">₹{displayOriginalPrice.toLocaleString('en-IN')}</span>
                                <span className="bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-bold px-2 py-1 rounded-md uppercase tracking-wider">{discountPercent}% OFF</span>
                            </div>
                        </div>

                        {/* AI Match Analysis */}
                        <div className="bg-blue-50/30 border border-blue-100 rounded-3xl p-6 sm:p-8 mb-8">
                            <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold">
                                <span className="material-symbols-outlined text-primary font-variation-fill text-xl">auto_awesome</span>
                                <h3>AI Match Analysis</h3>
                            </div>
                            <div className="space-y-5">
                                {aiAnalysis.map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-end mb-1.5">
                                            <span className="font-bold text-slate-800 text-sm">{item.label}</span>
                                            <span className="font-bold text-primary text-sm">{item.score}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-2 rounded-full mb-1">
                                            <div className="bg-primary h-2 rounded-full" style={{ width: item.width }}></div>
                                        </div>
                                        <div className="text-[10px] sm:text-xs text-slate-400 font-medium">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Storage Variant */}
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Storage Variant</h3>
                            <div className="flex flex-wrap gap-3">
                                {storages.map(storage => (
                                    <button
                                        key={storage}
                                        onClick={() => setSelectedStorage(storage)}
                                        className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${selectedStorage === storage
                                            ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                                            : 'bg-white border-slate-100 text-slate-700 hover:border-slate-300'
                                            }`}
                                    >
                                        {storage}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Warranty */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all mb-10 group">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined font-variation-fill">verified_user</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 text-sm">Warranty & Protection</h4>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">1 Year Standard Manufacturer Warranty</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                        </div>

                        {/* Sticky Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-auto sticky top-0 sm:static">
                            <button
                                onClick={(e) => {
                                    if (onAddToCart) {
                                        onAddToCart({
                                            id: product?.id || phoneName,
                                            name: phoneName,
                                            specs: `Flagship Processor | Storage: ${selectedStorage}`,
                                            price: displayPrice,
                                            originalPrice: displayOriginalPrice,
                                            image: mainImage,
                                            quantity: 1
                                        }, e.currentTarget);
                                    }
                                }}
                                className="flex-1 bg-white text-primary font-bold py-4 lg:py-5 rounded-2xl flex items-center justify-center gap-2 border-2 border-primary hover:bg-blue-50/50 transition-colors text-lg btn-press">
                                <span className="material-symbols-outlined font-variation-fill">shopping_bag</span>
                                Add to Cart
                            </button>
                            <button
                                onClick={() => {
                                    if (onBuyNow) {
                                        onBuyNow({
                                            id: product?.id || phoneName,
                                            name: phoneName,
                                            specs: `Flagship Processor | Storage: ${selectedStorage}`,
                                            price: displayPrice,
                                            originalPrice: displayOriginalPrice,
                                            image: mainImage,
                                            quantity: 1
                                        });
                                    }
                                }}
                                className="flex-1 bg-primary text-white font-bold py-4 lg:py-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all text-lg">
                                <span className="material-symbols-outlined font-variation-fill">bolt</span>
                                Buy Now
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}