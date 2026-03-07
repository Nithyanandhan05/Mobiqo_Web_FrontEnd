


interface HeroProps {
    onNavigate?: (page: 'home' | 'ai-assistant' | 'product-details', data?: any) => void;
}

export function Hero({ onNavigate }: HeroProps) {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-24 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 fill-mode-both">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm">bolt</span>
                    Next-Gen Shopping Experience
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                    Buy Smart Devices with <span className="text-primary">AI Guidance</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                    Experience the future of electronics shopping with personalized AI
                    recommendations, real-time spec comparisons, and automated warranty management.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                    <button
                        onClick={() => onNavigate && onNavigate('ai-assistant')}
                        className="w-full sm:w-auto min-h-[48px] px-8 py-3 sm:py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">auto_awesome</span>
                        Try AI Assistant
                    </button>
                    <button className="w-full sm:w-auto min-h-[48px] px-8 py-3 sm:py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                        Learn More
                    </button>
                </div>
                <div className="flex items-center gap-4 sm:gap-6 pt-2 sm:pt-4">
                    <div className="flex -space-x-3">
                        <img
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-background-light"
                            data-alt="Customer avatar 1"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuACUbItp4XErh3ZKNw4X5Vq_dc5qk1a-cfVDPPw7Qdt80Zv0i29kyoKpuZXWQ4QiEcGMg7EVfjY5aKLT-wMe0OnaZtiEOxWFIT1ZRjR0xduqp74QLq-9AgPFlj3JbdI8QuPrirpxV-sDu4ZDtFDJOZgjYzj4XNX8r7MD-ECLYr2vm9f69l4SBfdiyXz2fYid00gm19Br08amBrNqPobdOh0KMTpCVKrlY-DueSVzOjQtJnetPUHxH448nZc-GsrLHfGIGn1n31iyEM"
                        />
                        <img
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-background-light"
                            data-alt="Customer avatar 2"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAljRPFiNy9o5l6AFl9Yz3Wr_PHV5N4YIWxMRwYEX-rPZ47GxSSdC4pZLOoji0gNjXcUPdbKOnG810oL3ECCe4rAtFFCj48iKT3zsu0yC1IDpRAufML4qCnPThVycg9rUgdFyD6jaqpFwDHk5JS3KO1FoiZV0JejE378oFxRG3poi-nizCsiZtI-OIriITYiq_ouztMJB5Z6zbXjEbBf8BA8hjqMxnA4XOWTSj-sQXror3BGXmNfeYbhVFUDjRKzOCNXq8144aanLk"
                        />
                        <img
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-background-light"
                            data-alt="Customer avatar 3"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuASRYswggF-9AiPWkswCSp1-7F0s6ELqwIxMkaRlhR93Y33ch4gY95GsE5mbR5Eix5YUwaPTojjlHjbNqmAicSBZOvzHD8uB5vo_pcDu1bjwDJ1Yh_r_M1iqvlJbACyk3-8OZb-LVy466T9-fGBIaZnh7GFptylPp33cxtAQahhI1NeiRc9J0yb9aDvQdIH7ooEDPNJxdz3RjJDe-ItqEq6u_tCuMYfPGEz4LzSU68Nfd-tmtOXGCw-dJnCq8RsgxAOVpnVrJNKz7o"
                        />
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                        Trusted by <span className="text-slate-900 dark:text-white font-bold">12k+ tech enthusiasts</span>
                    </p>
                </div>
            </div>
            <div className="relative hidden sm:block animate-in fade-in slide-in-from-right-8 duration-700 delay-300 fill-mode-both">
                <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
                <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center p-8 overflow-hidden group">
                    <img
                        className="w-full h-full object-contain drop-shadow-2xl"
                        data-alt="Futuristic AI tech concept visualization"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl_ogVZhdoSs4aHDX_QE-vKFVIAQHlSngp-yZ9oIbZ2oGvSvNQX06oKCZayB9ZNRSsbh3VdY2J30aJRTW3vmnTTdmmZzNBX0G3qYxJIx2tNADBlJ_TsjJjC5PTgfUhO7nX_mGhf2rjALnoXfInZUAGRUBMHGOCXOLjiJIT1aB43ldPrwv2_SbTkvjE3-PoGtBM_bTxQmL3HnlxLrX1EjWxfDD2Ry2qypgEjoV5PfoNne6E1Iid5q0Cqg4tT4GRjrNP4VgHm_IXZnU"
                    />
                    <div className="absolute top-10 right-10 glass p-4 rounded-2xl flex items-center gap-3 animate-bounce">
                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                        <div className="text-xs font-bold">AI Recommended</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

