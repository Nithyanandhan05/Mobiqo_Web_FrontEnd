export function CTA() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-24">
            <div className="bg-primary rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 lg:p-20 relative overflow-hidden text-center lg:text-left">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
                <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6">
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                            Ready to find your <span className="text-slate-900">perfect device?</span>
                        </h2>
                        <p className="text-white/80 text-lg">
                            Join 50,000+ users who get weekly AI-curated tech deals and reviews.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            className="flex-1 px-6 py-4 rounded-xl border-none focus:ring-4 focus:ring-white/20 text-slate-900 font-medium"
                            placeholder="Enter your email"
                            type="email"
                        />
                        <button className="w-full sm:w-auto min-h-[48px] px-10 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
