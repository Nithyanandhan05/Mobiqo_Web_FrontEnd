import { ProfileLayout } from './ProfileLayout';

interface AIDeliveryLocationsProps {
    onNavigate: (page: string, data?: any) => void;
}

export function AIDeliveryLocations({ onNavigate }: AIDeliveryLocationsProps) {
    return (
        <ProfileLayout activeTab="addresses" onNavigate={onNavigate}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900">AI Delivery Locations</h1>
                    <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold mt-1">
                        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                        Optimized for fastest delivery
                    </div>
                </div>
                <button className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-[#1f93f6] hover:bg-[#157ad2] text-white rounded-full font-bold text-sm shadow-lg shadow-blue-500/30 transition-all">
                    <span className="material-symbols-outlined text-sm font-bold">add</span>
                    Add New Location
                </button>
            </div>

            <div className="flex flex-col gap-6 mt-4">
                <h2 className="text-lg font-black text-slate-900 mb-2">Saved Locations</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Location */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-primary relative overflow-hidden transition-all hover:shadow-md cursor-pointer group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-100 transition-colors"></div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <span className="bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                                Primary AI Delivery Location
                            </span>
                            <div className="flex items-center gap-2">
                                <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#1f93f6] hover:border-[#1f93f6] transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-[15px]">edit</span>
                                </button>
                                <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-[15px]">delete</span>
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-lg font-black text-slate-900 mb-1">Nithi</h3>
                            <p className="text-sm font-bold text-slate-500 mb-4">9363441126</p>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                30 Rajan Nagar Orikkai<br />
                                Kanchipuram - 631502
                            </p>
                        </div>
                    </div>

                    {/* Secondary Location */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden transition-all hover:shadow-md hover:border-slate-300 cursor-pointer group">
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <span className="bg-slate-50 border border-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                Secondary Location
                            </span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#1f93f6] hover:border-[#1f93f6] transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-[15px]">edit</span>
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-lg font-black text-slate-900 mb-1">Workspace</h3>
                            <p className="text-sm font-bold text-slate-500 mb-4">9876543210</p>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                Tech Park Phase II, DLF IT City<br />
                                Chennai - 600089
                            </p>
                        </div>
                    </div>

                    {/* Add New Location (Empty State style) */}
                    <div className="h-full min-h-[220px] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-[#1f93f6] hover:border-[#1f93f6] hover:bg-blue-50/50 transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-[#1f93f6] group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined font-variation-fill">location_on</span>
                        </div>
                        <span className="font-black text-sm">Add New Address</span>
                    </div>
                </div>

                {/* Smart Route Optimization info banner */}
                <div className="mt-6 sm:mt-8 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-100 flex flex-col xl:flex-row items-center gap-4 sm:gap-6 shadow-sm relative overflow-hidden text-center xl:text-left">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-3xl font-variation-fill">temp_preferences_custom</span>
                    </div>
                    <div className="flex-1 text-center xl:text-left">
                        <h3 className="text-lg font-black text-slate-900 mb-2">Smart Route Optimization</h3>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-2xl">
                            Our AI engine analyzes traffic patterns and delivery agent locations in real-time. We automatically prioritize addresses that offer the lowest latency for your scheduled deliveries.
                        </p>
                    </div>
                    <div className="flex-shrink-0 mt-4 xl:mt-0">
                        <button className="px-6 py-3 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-full font-bold text-sm transition-colors shadow-sm">
                            Configure AI Prefs
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile sticky add button */}
            <div className="md:hidden fixed bottom-24 right-4 z-40">
                <button className="w-14 h-14 bg-[#1f93f6] text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 font-bold">
                    <span className="material-symbols-outlined text-2xl">add</span>
                </button>
            </div>
        </ProfileLayout>
    );
}
