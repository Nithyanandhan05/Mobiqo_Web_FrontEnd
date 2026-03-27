import { useState, useEffect } from 'react';
import { AIDecisionReport } from './AIDecisionReport';

interface AIAssistantProps {
    onNavigate?: (page: 'home' | 'ai-assistant' | 'product-details', data?: any) => void;
}

export function AIAssistant({ onNavigate }: AIAssistantProps) {
    const [step, setStep] = useState<number>(1);

    // Step 1: Budget
    const [selectedBudget, setSelectedBudget] = useState<string>('Mid-Range');
    const [customBudget, setCustomBudget] = useState<string>(''); 

    // Step 2: Usage
    const [selectedUseCase, setSelectedUseCase] = useState<string>('Gaming');

    // Step 3: Brand
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]); 

    // Step 4: Final Details
    const [selectedStorage, setSelectedStorage] = useState<string>('128GB');
    const [selectedBattery, setSelectedBattery] = useState<string>('Standard');
    const [specificFeatures, setSpecificFeatures] = useState<string>('');

    // AI State
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [aiResult, setAiResult] = useState<any>(null);

    // 🚀 THE FIX: Scroll to top smoothly every time the 'step' changes
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [step]);

    const budgets = [
        {
            id: 'Value',
            icon: 'savings',
            title: 'Value',
            price: 'Under ₹15k',
            desc: 'Essential features and reliable everyday performance.',
            popular: false
        },
        {
            id: 'Mid-Range',
            icon: 'star',
            title: 'Mid-Range',
            price: '₹15k - ₹35k',
            desc: 'The sweet spot for performance and build quality.',
            popular: true
        },
        {
            id: 'Premium',
            icon: 'diamond',
            title: 'Premium',
            price: '₹35k - ₹70k',
            desc: 'High-end hardware and premium materials.',
            popular: false
        },
        {
            id: 'Flagship',
            icon: 'rocket_launch',
            title: 'Flagship',
            price: 'Above ₹70k',
            desc: 'Cutting-edge tech and no-compromise speed.',
            popular: false
        }
    ];

    const useCases = [
        { id: 'Gaming', icon: 'sports_esports', title: 'Gaming' },
        { id: 'Camera', icon: 'photo_camera', title: 'Camera' },
        { id: 'Business', icon: 'work', title: 'Business' },
        { id: 'Media', icon: 'movie', title: 'Media' },
        { id: 'Student', icon: 'school', title: 'Student' },
        { id: 'General', icon: 'smartphone', title: 'General' },
    ];

    const brands = [
        'Any', 'Samsung', 'Apple', 'OnePlus',
        'Xiaomi', 'Vivo', 'Oppo', 'Google',
        'Motorola', 'Realme', 'Poco', 'iQOO'
    ];

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            onNavigate && onNavigate('home');
        }
    };

    const handleBrandToggle = (brand: string) => {
        if (brand === 'Any') {
            setSelectedBrands([]);
            return;
        }
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setStep(5);
        try {
            let budgetNum = 30000;
            if (customBudget && !isNaN(Number(customBudget))) {
                budgetNum = Number(customBudget);
            } else {
                switch (selectedBudget) {
                    case 'Value': budgetNum = 15000; break;
                    case 'Mid-Range': budgetNum = 35000; break;
                    case 'Premium': budgetNum = 70000; break;
                    case 'Flagship': budgetNum = 150000; break;
                }
            }

            const brandString = selectedBrands.length > 0 ? selectedBrands.join(', ') : 'Any';

            const response = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    budget: budgetNum,
                    brand: brandString,
                    usage: selectedUseCase,
                    storage: selectedStorage,
                    battery: selectedBattery,
                    notes: specificFeatures
                })
            });
            const data = await response.json();
            if (data.status === 'success') {
                setAiResult(data.data);
            } else {
                console.error("API error", data);
                throw new Error("API failed");
            }
        } catch (error) {
            console.error("Fetch error", error);
            // Fallback mock data if backend is offline so the UI is visible
            setAiResult({
                top_match: {
                    name: "Realme 12 Pro+ 5G", price: "₹22,999", match_percent: "95%",
                    battery_spec: "5000mAh • 67W", display_spec: "120Hz AMOLED",
                    processor_spec: "Snapdragon 7s Gen 2", camera_spec: "64MP Periscope",
                    image_url: "https://m-cdn.phonearena.com/images/phones/85257-350/Realme-12-Pro-Plus.jpg"
                },
                alternatives: [
                    { name: "Poco X6 Pro 5G", price: "₹24,999", match_percent: "92%", image_url: "https://m-cdn.phonearena.com/images/phones/84519-350/Poco-X6-Pro.jpg" },
                    { name: "OnePlus Nord CE 4 5G", price: "₹24,999", match_percent: "88%", image_url: "https://m-cdn.phonearena.com/images/phones/85375-350/OnePlus-Nord-CE-4.jpg" }
                ],
                analysis: "The Realme 12 Pro+ 5G is an excellent choice within your budget, offering a premium design and a standout camera system featuring a 64MP periscope lens. It perfectly balances daily performance, long battery life, and high-quality photography."
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] pb-20">
            <div className="max-w-6xl mx-auto px-6 pt-8">
                {step < 5 ? (
                    <>
                        {/* Header & Progress */}
                        <div className="mb-12">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-5 mb-4">
                                <div>
                                    <h2 className="text-primary font-bold text-sm tracking-wider uppercase mb-1">
                                        AI Recommendation Assistant
                                    </h2>
                                    <p className="text-slate-500 text-sm">
                                        Refining your personalized tech match
                                    </p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <div className="text-slate-900 font-bold text-sm">Step {step} of 4</div>
                                    <div className="text-primary font-bold text-xs mt-0.5">{step * 25}% Complete</div>
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div
                                    className="bg-primary h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${step * 25}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Question Section */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                                {step === 1 && "What's your target budget?"}
                                {step === 2 && "How will you use your new device?"}
                                {step === 3 && "Select Your Preferred Brands"}
                                {step === 4 && "Final Details"}
                            </h1>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                                {step === 1 && "Select a range or enter a specific amount below."}
                                {step === 2 && "Select your primary use case for personalized AI recommendations."}
                                {step === 3 && "Choose multiple brands you love or select \"Any\"."}
                                {step === 4 && "Fine-tune your requirements to get the perfect recommendation."}
                            </p>
                        </div>

                        {/* Options Grid */}
                        {step === 1 && (
                            <div className="max-w-4xl mx-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                                    {budgets.map((budget) => {
                                        const isSelected = selectedBudget === budget.id && customBudget === '';
                                        return (
                                            <div
                                                key={budget.id}
                                                onClick={() => {
                                                    setSelectedBudget(budget.id);
                                                    setCustomBudget('');
                                                }}
                                                className={`relative rounded-2xl p-6 cursor-pointer border-2 transition-all ${isSelected
                                                    ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30 transform scale-105'
                                                    : 'bg-white border-slate-100 text-slate-900 hover:border-slate-300 hover:shadow-md'
                                                    }`}
                                            >
                                                {budget.popular && (
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary text-[10px] font-black px-3 py-1 rounded-full shadow-sm border border-slate-100 tracking-wider">
                                                        MOST POPULAR
                                                    </div>
                                                )}
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${isSelected ? 'bg-white/20' : 'bg-slate-100'
                                                    }`}>
                                                    <span className={`material-symbols-outlined font-variation-fill text-2xl ${isSelected ? 'text-white' : 'text-slate-600'
                                                        }`}>
                                                        {budget.icon}
                                                    </span>
                                                </div>
                                                <h3 className={`font-bold text-xl mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                                    {budget.title}
                                                </h3>
                                                <div className={`text-lg font-medium mb-4 ${isSelected ? 'text-white' : 'text-primary'}`}>
                                                    {budget.price}
                                                </div>
                                                <p className={`text-sm leading-relaxed ${isSelected ? 'text-primary-50 text-white/90' : 'text-slate-500'}`}>
                                                    {budget.desc}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Or enter custom budget (₹)</label>
                                    <input
                                        type="number"
                                        value={customBudget}
                                        onChange={(e) => {
                                            setCustomBudget(e.target.value);
                                            setSelectedBudget('');
                                        }}
                                        placeholder="e.g. 25000"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16 max-w-4xl mx-auto">
                                {useCases.map((useCase) => {
                                    const isSelected = selectedUseCase === useCase.id;
                                    return (
                                        <div
                                            key={useCase.id}
                                            onClick={() => setSelectedUseCase(useCase.id)}
                                            className={`relative rounded-2xl p-8 cursor-pointer border-2 transition-all flex flex-col items-center justify-center text-center ${isSelected
                                                ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30 transform scale-105'
                                                : 'bg-white border-slate-100 text-slate-900 hover:border-slate-300 hover:shadow-md'
                                                }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-4 right-4 text-white">
                                                    <span className="material-symbols-outlined font-variation-fill">check_circle</span>
                                                </div>
                                            )}
                                            <div className="mb-4">
                                                <span className={`material-symbols-outlined font-variation-fill text-5xl ${isSelected ? 'text-white' : 'text-slate-400'
                                                    }`}>
                                                    {useCase.icon}
                                                </span>
                                            </div>
                                            <h3 className={`font-bold text-xl ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                                {useCase.title}
                                            </h3>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16 max-w-5xl mx-auto">
                                {brands.map((brand) => {
                                    const isSelected = selectedBrands.includes(brand) || (brand === 'Any' && selectedBrands.length === 0);
                                    return (
                                        <div
                                            key={brand}
                                            onClick={() => handleBrandToggle(brand)}
                                            className={`relative rounded-2xl py-6 px-4 sm:py-8 sm:px-6 cursor-pointer border-2 transition-all flex items-center justify-center text-center ${isSelected
                                                ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30 transform scale-105'
                                                : 'bg-white border-slate-100 text-slate-900 hover:border-slate-300 hover:shadow-md'
                                                }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-3 right-3 text-white">
                                                    <span className="material-symbols-outlined font-variation-fill text-[18px]">check_circle</span>
                                                </div>
                                            )}
                                            <h3 className={`font-bold text-lg sm:text-xl ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                                {brand}
                                            </h3>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {step === 4 && (
                            <div className="max-w-2xl mx-auto space-y-8 mb-10 sm:mb-16">
                                {/* Storage */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                    <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                                        <span className="material-symbols-outlined text-primary text-xl">dns</span>
                                        <h3>Minimum Storage</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3 sm:gap-4">
                                        {['128GB', '256GB', '512GB+'].map((storage) => (
                                            <button
                                                key={storage}
                                                onClick={() => setSelectedStorage(storage)}
                                                className={`px-6 py-3 rounded-xl font-bold transition-all border-2 flex-1 ${selectedStorage === storage
                                                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                                                    : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-300 hover:bg-white'
                                                    }`}
                                            >
                                                {storage}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Battery Life */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                    <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                                        <span className="material-symbols-outlined text-primary text-xl">battery_charging_full</span>
                                        <h3>Battery Preference</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3 sm:gap-4">
                                        {[
                                            { type: 'Standard', icon: 'battery_std' },
                                            { type: 'Massive', icon: 'battery_full' }
                                        ].map((batt) => (
                                            <button
                                                key={batt.type}
                                                onClick={() => setSelectedBattery(batt.type)}
                                                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all border-2 flex-1 ${selectedBattery === batt.type
                                                    ? 'bg-blue-50 border-primary text-primary'
                                                    : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-300 hover:bg-white'
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined">{batt.icon}</span>
                                                {batt.type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Specific Features */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                                            <span className="material-symbols-outlined text-primary text-xl">tune</span>
                                            <h3>Specific Features</h3>
                                        </div>
                                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Optional</span>
                                    </div>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute top-4 left-4 text-slate-400">edit</span>
                                        <textarea
                                            value={specificFeatures}
                                            onChange={(e) => setSpecificFeatures(e.target.value)}
                                            placeholder="E.g. Headphone jack, flat display, good for selfies, wireless charging..."
                                            className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 text-slate-700 font-medium focus:outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none placeholder:text-slate-400 placeholder:font-normal"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="max-w-2xl mx-auto border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <button
                                onClick={handleBack}
                                className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold sm:w-auto w-full order-2 sm:order-1"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                                {step === 1 ? 'Cancel' : 'Back'}
                            </button>

                            {step < 4 ? (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center justify-center gap-2 bg-primary text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-primary/30 w-full sm:w-auto order-1 sm:order-2 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all"
                                >
                                    Next Step
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className={`flex items-center justify-center gap-2 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/30 w-full sm:w-auto order-1 sm:order-2 transition-all ${isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:shadow-primary/50 hover:-translate-y-0.5'}`}
                                >
                                    {isGenerating ? 'Analyzing Requirements...' : 'Generate Recommendations'}
                                    {!isGenerating && <span className="material-symbols-outlined">auto_awesome</span>}
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {isGenerating ? (
                            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in">
                                <span className="material-symbols-outlined text-6xl text-primary animate-spin mb-6 font-variation-fill">data_usage</span>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">Mobiqo Engine Processing</h2>
                                <p className="text-slate-500 font-medium">Analyzing patterns and identifying the perfect match...</p>
                            </div>
                        ) : (
                            <AIDecisionReport data={aiResult} onBack={() => setStep(4)} onNavigate={onNavigate} />
                        )}
                    </>
                )}
            </div>
        </main>
    );
}