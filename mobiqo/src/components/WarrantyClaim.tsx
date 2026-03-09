import { useState, useRef } from 'react';

interface WarrantyClaimProps {
    onNavigate?: (page: any, data?: any) => void;
    warranty?: any;
}

export function WarrantyClaim({ onNavigate, warranty }: WarrantyClaimProps) {
    const [claimType, setClaimType] = useState('repair');
    const [description, setDescription] = useState('');
    const [invoiceImage, setInvoiceImage] = useState<File | null>(null);
    const [deviceImage, setDeviceImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const invoiceInputRef = useRef<HTMLInputElement>(null);
    const deviceInputRef = useRef<HTMLInputElement>(null);

    const device = warranty?.device_name || 'Your Device';

    const handleSubmit = async () => {
        if (!description.trim()) return;
        setSubmitting(true);
        setError('');
        try {
            const token = localStorage.getItem('jwt_token');
            if (token) {
                const formData = new FormData();
                formData.append('issue_type', claimType);
                formData.append('description', description);
                formData.append('service_mode', 'center'); // Default to center for now
                if (invoiceImage) formData.append('invoice_image', invoiceImage);
                if (deviceImage) formData.append('device_image', deviceImage);

                const res = await fetch(`/api/warranties/${warranty?.id}/claim`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }, // Note: No 'Content-Type' when sending FormData
                    body: formData
                });

                const data = await res.json();
                if (res.ok && data.status === 'success') {
                    setSubmitted(true);
                } else {
                    setError(data.message || 'Failed to submit claim.');
                }
            } else {
                setError('Authentication error. Please login again.');
            }
        } catch (err) {
            setError('Server connection error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-emerald-600 text-4xl font-variation-fill">check_circle</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Claim Submitted!</h2>
                <p className="text-slate-500 font-medium mb-6">Our team will review your claim and get back to you within 2-3 business days.</p>
                <button
                    onClick={() => onNavigate && onNavigate('warranty')}
                    className="bg-primary text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all"
                >
                    Back to Warranties
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => onNavigate && onNavigate('warranty')} className="hover:text-primary transition-colors">
                    <span className="material-symbols-outlined font-black">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl font-black text-slate-900">File a Warranty Claim</h1>
                    <p className="text-slate-500 text-sm font-medium">{device}</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
                {/* Device Info */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-2xl font-variation-fill">smartphone</span>
                    </div>
                    <div>
                        <p className="font-black text-slate-900">{device}</p>
                        <p className="text-xs text-slate-500 font-medium hidden sm:block">IMEI: {warranty?.imei || 'N/A'} · Model: {warranty?.model_number || 'N/A'}</p>
                    </div>
                </div>

                {/* Claim Type */}
                <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Claim Type</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { id: 'repair', label: 'Repair', icon: 'build' },
                            { id: 'replacement', label: 'Replacement', icon: 'swap_horiz' },
                            { id: 'refund', label: 'Refund', icon: 'payments' },
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setClaimType(t.id)}
                                className={`flex items-center gap-3 p-4 rounded-2xl border-2 font-bold text-sm transition-all ${claimType === t.id
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                            >
                                <span className="material-symbols-outlined text-xl">{t.icon}</span>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Upload Proof */}
                <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Upload Proof</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Invoice Upload */}
                        <div
                            onClick={() => invoiceInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center gap-2 text-center transition-colors cursor-pointer ${invoiceImage ? 'border-primary/50 bg-primary/5' : 'border-slate-200 hover:border-primary/50'}`}
                        >
                            <span className={`material-symbols-outlined text-3xl ${invoiceImage ? 'text-primary' : 'text-slate-300'}`}>
                                {invoiceImage ? 'image' : 'upload_file'}
                            </span>
                            <p className="font-bold text-slate-600 text-sm">
                                {invoiceImage ? invoiceImage.name : 'Purchase Receipt'}
                            </p>
                            <p className="text-xs text-slate-400">JPG, PNG, PDF up to 5MB</p>
                            <input
                                type="file"
                                ref={invoiceInputRef}
                                onChange={(e) => setInvoiceImage(e.target.files?.[0] || null)}
                                className="hidden"
                                accept=".jpg,.jpeg,.png,.pdf"
                            />
                        </div>

                        {/* Device Photo Upload */}
                        <div
                            onClick={() => deviceInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center gap-2 text-center transition-colors cursor-pointer ${deviceImage ? 'border-primary/50 bg-primary/5' : 'border-slate-200 hover:border-primary/50'}`}
                        >
                            <span className={`material-symbols-outlined text-3xl ${deviceImage ? 'text-primary' : 'text-slate-300'}`}>
                                {deviceImage ? 'image' : 'upload_file'}
                            </span>
                            <p className="font-bold text-slate-600 text-sm">
                                {deviceImage ? deviceImage.name : 'Device Photos'}
                            </p>
                            <p className="text-xs text-slate-400">JPG, PNG, PDF up to 5MB</p>
                            <input
                                type="file"
                                ref={deviceInputRef}
                                onChange={(e) => setDeviceImage(e.target.files?.[0] || null)}
                                className="hidden"
                                accept=".jpg,.jpeg,.png,.pdf"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Issue Description</h3>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Describe the issue in detail — when it started, what happens, any error messages..."
                        rows={4}
                        className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none text-slate-700 placeholder:text-slate-400"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-xs font-bold">
                        <span className="material-symbols-outlined text-base">error</span>
                        {error}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={!description.trim() || submitting}
                    className="w-full bg-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span className="material-symbols-outlined">send</span>
                            Submit Claim
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
