import { useEffect } from 'react';

interface PrivacyPolicyProps {
    onNavigate: (page: string, data?: any) => void;
}

export function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
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
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-2">Privacy Policy</h1>
                <p className="text-slate-400 text-sm font-medium">Last Updated: March 2026</p>
            </div>

            <div className="bg-white rounded-[24px] p-6 md:p-10 shadow-sm border border-slate-100 prose prose-slate max-w-none">
                <h2 className="text-xl font-bold text-slate-800 mb-4">1. Information We Collect</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    We collect information you provide directly to us when you register for an account, make a purchase, or submit a warranty claim. This includes your name, email address, phone number, shipping address, and payment transaction IDs. We also collect usage data when you interact with our AI comparison tools.
                </p>

                <h2 className="text-xl font-bold text-slate-800 mb-4">2. How We Use Your Information</h2>
                <p className="text-slate-600 mb-4 leading-relaxed">We use the information we collect to:</p>
                <ul className="list-disc pl-5 text-slate-600 mb-6 space-y-2">
                    <li>Process and fulfill your electronics orders.</li>
                    <li>Manage your device warranties and repair claims.</li>
                    <li>Provide personalized AI smartphone recommendations based on your searches.</li>
                    <li>Send order updates, security alerts, and support messages.</li>
                </ul>

                <h2 className="text-xl font-bold text-slate-800 mb-4">3. Data Security & Payments</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    Your payment information is processed securely through Razorpay. We do not store your full credit card numbers or UPI PINs on our servers. All data transfers between our Web/App clients and our servers are encrypted.
                </p>

                <h2 className="text-xl font-bold text-slate-800 mb-4">4. Your Rights (Account Deletion)</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    You have the right to request the complete deletion of your account and personal data. You can execute a hard-delete at any time via the 'Privacy & Security' settings dashboard. Note that permanently deleting your account will instantly void any active warranties and wipe your order history.
                </p>

                <h2 className="text-xl font-bold text-slate-800 mb-4">5. Contact Us</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    If you have any questions about this Privacy Policy or how we handle your data, please contact our privacy team at <strong>mobiqoapp.com</strong>.
                </p>
            </div>
        </div>
    );
}