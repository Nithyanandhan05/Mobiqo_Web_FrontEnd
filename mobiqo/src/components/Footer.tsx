export function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 pt-10 sm:pt-20 pb-28 sm:pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-12 mb-12 sm:mb-20">
                <div className="col-span-2 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black/5 dark:bg-white/10 rounded-lg overflow-hidden flex items-center justify-center p-0.5">
                            <img src="/logo.png" alt="Mobiqo Logo" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-xl font-extrabold tracking-tight">Mobiqo</h2>
                    </div>
                    <p className="text-slate-500 max-w-sm leading-relaxed">
                        Revolutionizing the electronics retail industry through artificial intelligence and user-centric design.
                    </p>
                    <div className="flex gap-4">
                        <a
                            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 hover:text-primary transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined">share</span>
                        </a>
                        <a
                            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 hover:text-primary transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined">public</span>
                        </a>
                    </div>
                </div>
                <div className="space-y-6">
                    <h4 className="font-bold">Shop</h4>
                    <ul className="space-y-4 text-sm text-slate-500">
                        <li><a className="hover:text-primary transition-colors" href="#">Smartphones</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Laptops</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Accessories</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Smart Home</a></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <h4 className="font-bold">Company</h4>
                    <ul className="space-y-4 text-sm text-slate-500">
                        <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">AI Tech</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <h4 className="font-bold">Support</h4>
                    <ul className="space-y-4 text-sm text-slate-500">
                        <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Warranty Info</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Order Tracking</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Returns</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-sm text-slate-500">© {new Date().getFullYear()} Mobiqo. All rights reserved.</p>
                <div className="flex gap-8 text-sm text-slate-400">
                    <a className="hover:text-slate-600" href="#">Terms of Service</a>
                    <a className="hover:text-slate-600" href="#">Privacy Policy</a>
                    <a className="hover:text-slate-600" href="#">Cookies</a>
                </div>
            </div>
        </footer>
    );
}
