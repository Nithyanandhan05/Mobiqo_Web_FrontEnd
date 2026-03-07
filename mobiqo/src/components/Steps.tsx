export function Steps() {
    return (
        <section className="bg-slate-100 dark:bg-slate-900/50 py-14 sm:py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
                    <div>
                        <h2 className="text-2xl sm:text-4xl font-black mb-6 sm:mb-8 leading-tight">Shopping Reimagined in 3 Simple Steps</h2>
                        <div className="space-y-8 sm:space-y-12">
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white font-black flex items-center justify-center rounded-xl text-xl">
                                    1
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold">Describe Your Needs</h4>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Tell our AI what you need the device for—be it gaming, professional creative work, or daily commute.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white font-black flex items-center justify-center rounded-xl text-xl">
                                    2
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold">Review AI Analysis</h4>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Receive a curated comparison of top-rated devices with a "Match Score" tailored to your profile.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white font-black flex items-center justify-center rounded-xl text-xl">
                                    3
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold">Secure One-Click Purchase</h4>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Buy with confidence knowing our AI has validated the price, specs, and future-proof rating.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                className="w-full h-full object-cover"
                                data-alt="Dashboard interface showing AI device data analysis"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQofxybC2h6i-yfjvrkWhLY3EvP8_M76FgJCSGn4iriFUM8U2RVehwZBNzzh9QYgl8XF0cGL7MO7Uc9Fybm21qBZTdRtBJnD1eG6jdM9Wu5bGDzIDbHXgsF4HVyXIOKol8c_qyNgU4Iu1RuRCWnwtCD8z7QOoezgJ9IrWXzOr10EcK2XFhLt6Tl0CHAa1CyGKoVmmyes6HeQNNfCv2DnfyX8nN-ChkJv08nvrWA011IP8ij_2qnWikxKgJESKQaTlFFRL8SzJmm_I"
                            />
                        </div>
                        <div className="absolute -bottom-4 left-4 sm:-bottom-6 sm:-left-6 glass p-4 sm:p-6 rounded-2xl shadow-xl max-w-[180px] sm:max-w-[200px]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">System Status</span>
                            </div>
                            <p className="text-[10px] sm:text-xs font-semibold">AI is analyzing 4,500+ device specs in real-time</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
