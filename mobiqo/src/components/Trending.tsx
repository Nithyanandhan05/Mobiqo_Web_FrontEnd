import { useEffect, useState } from 'react';

import type { CartItem } from '../App';
import { getHDImage } from '../utils/imageHelper';

interface TrendingProps {
    onNavigate?: (page: 'home' | 'ai-assistant' | 'product-details' | 'cart', data?: any) => void;
    onAddToCart?: (item: CartItem, sourceElement?: HTMLElement | null) => void;
}

export function Trending({ onNavigate, onAddToCart }: TrendingProps) {
    const defaultDevices = [
        {
            id: 1,
            name: 'SmartPhone Pro Max',
            price: '$999',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_RaMyba5WR69BSnd2KcqgvFUbXvkFnEkRpQ2CBC-_CgDArjqmcniN1EYhDkR6_Z2uqeA54R25zhQiCczxqyagUo-EKb3mhxGbdlhba19evu7Us1FDZmgMEe3NhbJTJF-gxvlu-rHqKsuf32ia8sGJK-lCjLvK1j8ULCCtL8gDDabOZSJltHPqeTrTCCq5YmucpAmTWePBzhdAHA2NwY9O9OttCsVra0XK10rPQudYG5059SencyF99z-HQsHJcCEBfluToui42Os',
            reviews: 200,
            badge: null
        },
        {
            id: 2,
            name: 'UltraBook AI',
            price: '$1,299',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnFmZc3fqPXR_WsxdWMEaKNq5J_AuyED5W_KnWHbCVQ-yjOMaRy2oQ86X76xW6O5LEwZNCJLRdSvILWJL-GceC8joifJsl1QaPxsRukn1mqK_4KfwP60NWnwmhSj1y5pf1oVZl99akkcQWMORwP-QAC_E-yS2S5fWFkw3oRZ6RfbYyreBexFiphwvxZ8d9dtBJPRDBkR2KlUPGQZn0DJBOOsOJBf61QnVUnQmSS1MPQse9WXi5blEmsT7vIWqxiwLAnZ666TgHyjA',
            reviews: 150,
            badge: 'BEST SELLER'
        },
        {
            id: 3,
            name: 'Noise-Canceling Buds',
            price: '$249',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMcPAXj5PeVkM2DQovQ_IgXag3g_5kkaOHvI_HowjeKupquRlpFcjNkTnEB1yML-t6PRZyGTyNW-MzFezSy92w7zn1cSd_uCFrAN5s-DcGhTsu0JaeRR1Fc4F7WaF9RFJ00AhCrnBiyNmHh35pydZMvYrGfmP5KUAkrn8lgQLh03zyaXuDuFFUX3w78mSgvrESarNWUvnaNG79pKU9IaWNNhIa5fAA2HNWudZvWKXvfx8HNAgswFmVlygNGIhGWvKDWawHvgtPNbk',
            reviews: 400,
            badge: null
        },
        {
            id: 4,
            name: 'SmartWatch Series X',
            price: '$399',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmKLcGuDP_Ro78LLbRYywCHm3SBp0L-se_27QjJefe_86YVoQyuIxxiUhcMmfYbeqOAqDCMq6GAG6aCaDZLURHEfSKcNzPeHVF66EhHI_bSNdtRIEc8U-tEbsgU9UBub5N8y2jWEhxjt5kp2abTfvwxc8D-Go6JBGq9nLrDQorY6jjdv3ihvkcknyhlzH4Q5HIs8_ud6K6aE-coYGW5QRTIXVY5CGq-9s3MTWyojTMYUo6oUvRgD9rQo3wSwG2Wo7IvBCm0IxUv8w',
            reviews: 320,
            badge: null
        }
    ];

    const [devices, setDevices] = useState(defaultDevices);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success' && data.products && data.products.length > 0) {
                    const fetchedDevices = data.products.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        price: `₹${p.price}`,
                        image: getHDImage(p.image_url, p.name) || defaultDevices[0].image,
                        reviews: Math.floor(Math.random() * 500) + 50, // mock reviews for UI
                        badge: null
                    }));
                    setDevices(fetchedDevices.slice(0, 4)); // Only show top 4
                }
            })
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-0 mb-12">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight">Trending Devices</h2>
                    <p className="text-slate-500">Popular tech picked by our AI for you today.</p>
                </div>
                <button className="flex items-center gap-2 text-primary font-bold hover:underline self-start sm:self-auto">
                    View all catalog <span className="material-symbols-outlined">trending_flat</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                {devices.map((device, index) => (
                    <div
                        key={device.id}
                        onClick={() => onNavigate && onNavigate('product-details', device)}
                        className="group bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        <div className="relative aspect-square rounded-xl bg-slate-100 dark:bg-slate-900 mb-4 overflow-hidden">
                            <img
                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                alt={device.name}
                                src={getHDImage(device.image, device.name)}
                            />
                            {device.badge && (
                                <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-[10px] text-white font-bold rounded">
                                    {device.badge}
                                </div>
                            )}
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <span className="material-symbols-outlined text-rose-500 font-variation-fill">favorite</span>
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-lg leading-tight">{device.name}</h4>
                                <span className="text-primary font-black">{device.price}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <div className="flex text-amber-400">
                                    <span className="material-symbols-outlined text-sm font-variation-fill">star</span>
                                    <span className="material-symbols-outlined text-sm font-variation-fill">star</span>
                                    <span className="material-symbols-outlined text-sm font-variation-fill">star</span>
                                    <span className="material-symbols-outlined text-sm font-variation-fill">star</span>
                                    <span className="material-symbols-outlined text-sm font-variation-fill">star</span>
                                </div>
                                <span>({device.reviews} reviews)</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onAddToCart) {
                                            onAddToCart({
                                                id: String(device.id),
                                                name: device.name,
                                                specs: 'Standard Configuration',
                                                price: parseInt(device.price.replace(/[^0-9]/g, '')),
                                                originalPrice: parseInt(device.price.replace(/[^0-9]/g, '')) + 5000,
                                                image: device.image,
                                                quantity: 1
                                            }, e.currentTarget);
                                        }
                                    }}
                                    className="flex-1 min-h-[44px] py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors btn-press">
                                    Add to Cart
                                </button>
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    title="Compare"
                                >
                                    <span className="material-symbols-outlined text-sm">compare_arrows</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}