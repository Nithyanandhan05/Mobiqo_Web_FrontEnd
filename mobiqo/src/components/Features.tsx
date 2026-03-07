export function Features() {
    return (
        <section className="bg-slate-100 dark:bg-slate-900/50 py-14 sm:py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-8 sm:mb-16 space-y-4">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black">Experience the AI Advantage</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Our cutting-edge tools are designed to remove friction from your tech journey.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
                    <div className="glass p-5 sm:p-8 rounded-3xl space-y-4 sm:space-y-6 hover:translate-y-[-8px] transition-transform duration-300">
                        <div className="w-14 h-14 bg-primary/10 text-primary flex items-center justify-center rounded-2xl">
                            <span className="material-symbols-outlined text-3xl">smart_toy</span>
                        </div>
                        <h3 className="text-xl font-bold">AI Device Recommendation</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Personalized suggestions based on your specific usage patterns and budget requirements.
                        </p>
                    </div>
                    <div className="glass p-5 sm:p-8 rounded-3xl space-y-4 sm:space-y-6 hover:translate-y-[-8px] transition-transform duration-300">
                        <div className="w-14 h-14 bg-primary/10 text-primary flex items-center justify-center rounded-2xl">
                            <span className="material-symbols-outlined text-3xl">compare_arrows</span>
                        </div>
                        <h3 className="text-xl font-bold">Real-time Device Comparison</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Side-by-side technical specification breakdowns with real-world performance benchmarks.
                        </p>
                    </div>
                    <div className="glass p-5 sm:p-8 rounded-3xl space-y-4 sm:space-y-6 hover:translate-y-[-8px] transition-transform duration-300">
                        <div className="w-14 h-14 bg-primary/10 text-primary flex items-center justify-center rounded-2xl">
                            <span className="material-symbols-outlined text-3xl">verified_user</span>
                        </div>
                        <h3 className="text-xl font-bold">Digital Warranty Management</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            One secure vault for all your tech warranties. AI-driven alerts before coverage expires.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
