import { useEffect } from 'react';

interface TermsConditionsProps {
    onNavigate: (page: string, data?: any) => void;
}

export function TermsConditions({ onNavigate }: TermsConditionsProps) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex-1 w-full max-w-4xl pb-20">
            <div className="mb-8">
                <button onClick={() => onNavigate('privacy-security')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    BACK TO SETTINGS
                </button>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-2">Terms & Conditions</h1>
                <p className="text-slate-400 text-sm font-medium">Effective Date: March 2026</p>
            </div>

            <div className="bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-slate-100 prose prose-slate max-w-none">
                <h2 className="text-xl font-bold text-slate-800 mb-4">1. Agreement to Terms</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    By accessing or using the Mobiqo / SmartElectro AI platform (both Web and Mobile applications), you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access our services.
                </p>

                <h2 className="text-xl font-bold text-slate-800 mb-4">2. User Accounts</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
                </p>

                <h2 className="text-xl font-bold text-slate-800 mb-4">3. Products & AI Recommendations</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    Our AI engine provides smartphone comparisons and recommendations based on aggregated web data. While we strive for high accuracy, we do not warrant that product descriptions, pricing, specifications, or AI analysis are entirely error-free. We reserve the right to refuse or cancel orders arising from typographical or pricing errors.
                </p>

                <h2 className="text-xl font-bold text-slate-800 mb-4">4. Warranties & Claims</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    Warranties registered through our platform are subject to manual review and approval by our Administration team. Submitting altered invoices, false purchase dates, or fraudulent repair claims is a violation of these terms and will result in immediate account termination without refund.
                </p>

                <h2 className="text-xl font-bold text-slate-800 mb-4">5. Limitation of Liability</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    In no event shall Mobiqo, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of the Service.
                </p>
            </div>
        </div>
    );
}