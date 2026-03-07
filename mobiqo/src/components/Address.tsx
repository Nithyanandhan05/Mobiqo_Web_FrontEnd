import { useState, useEffect, useRef, useCallback } from 'react';
import type { CartItem } from '../App';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface BackendAddress {
    id: number;
    full_name: string;
    mobile: string;
    pincode: string;
    city: string;
    address_line: string;
    is_default: boolean;
}

interface AddressProps {
    onNavigate?: (page: 'home' | 'ai-assistant' | 'product-details' | 'cart' | 'address' | 'checkout', data?: any) => void;
    cart: CartItem[];
}

export function Address({ onNavigate, cart: _cart }: AddressProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentLocation, setCurrentLocation] = useState('30 Rajan Nagar, Orikkai');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [addresses, setAddresses] = useState<BackendAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAddress, setNewAddress] = useState({ full_name: '', mobile: '', pincode: '', city: '', address_line: '' });
    const [mapCenter, setMapCenter] = useState<[number, number]>([12.8342, 79.7036]); // Kanchipuram default

    // Fetch addresses from backend
    const fetchAddresses = useCallback(async () => {
        try {
            setLoading(true);
            // Try backend first
            const token = localStorage.getItem('jwt_token');
            if (token) {
                const res = await fetch('/api/get_addresses', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'success' && data.addresses?.length > 0) {
                        setAddresses(data.addresses);
                        const defaultAddr = data.addresses.find((a: BackendAddress) => a.is_default) || data.addresses[0];
                        setSelectedId(defaultAddr.id);
                        setLoading(false);
                        return;
                    }
                }
            }
            // Fallback to demo addresses if backend is unreachable or no token
            setAddresses([
                {
                    id: 1,
                    full_name: 'Nithi',
                    mobile: '9363441126',
                    pincode: '631502',
                    city: 'Kanchipuram',
                    address_line: '30 Rajan Nagar Orikkai, Kanchipuram - 631502',
                    is_default: true
                },
                {
                    id: 2,
                    full_name: 'Office',
                    mobile: '9363441126',
                    pincode: '631502',
                    city: 'Kanchipuram',
                    address_line: 'Mobiqo Tech Park, Floor 4, Suite 402, Kanchipuram',
                    is_default: false
                }
            ]);
            setSelectedId(1);
        } catch {
            // Fallback demo data
            setAddresses([
                {
                    id: 1,
                    full_name: 'Nithi',
                    mobile: '9363441126',
                    pincode: '631502',
                    city: 'Kanchipuram',
                    address_line: '30 Rajan Nagar Orikkai, Kanchipuram - 631502',
                    is_default: true
                }
            ]);
            setSelectedId(1);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

    // Initialize Leaflet Map
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, {
            center: mapCenter,
            zoom: 15,
            zoomControl: true,
            attributionControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        // Custom blue marker icon
        const blueIcon = L.divIcon({
            className: '',
            html: `<div style="width:32px;height:32px;background:#135bec;border:3px solid white;border-radius:50%;box-shadow:0 4px 12px rgba(19,91,236,0.5);display:flex;align-items:center;justify-content:center">
                    <div style="width:8px;height:8px;background:white;border-radius:50%"></div>
                  </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });

        const marker = L.marker(mapCenter, { icon: blueIcon }).addTo(map);
        markerRef.current = marker;
        mapInstanceRef.current = map;

        // Fix map rendering after initial load
        setTimeout(() => map.invalidateSize(), 200);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Update map marker when center changes
    useEffect(() => {
        if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView(mapCenter, 15, { animate: true });
            markerRef.current.setLatLng(mapCenter);
        }
    }, [mapCenter]);

    const handleSelectAddress = (id: number) => {
        setSelectedId(id);
        const addr = addresses.find(a => a.id === id);
        if (addr) {
            setCurrentLocation(addr.address_line.split(',')[0]);
            // Could geocode the address here for map centering
        }
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setMapCenter([lat, lng]);
                    setCurrentLocation(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
                },
                () => {
                    alert('Unable to get your location. Please allow location access.');
                }
            );
        }
    };

    const handleAddAddress = async () => {
        if (!newAddress.full_name || !newAddress.address_line || !newAddress.mobile || !newAddress.pincode || !newAddress.city) return;

        try {
            const token = localStorage.getItem('jwt_token');
            if (token) {
                const res = await fetch('/api/add_address', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newAddress)
                });
                if (res.ok) {
                    await fetchAddresses();
                    setNewAddress({ full_name: '', mobile: '', pincode: '', city: '', address_line: '' });
                    setShowAddForm(false);
                    return;
                }
            }
            // Fallback: add locally
            const localAddr: BackendAddress = {
                id: Date.now(),
                ...newAddress,
                is_default: addresses.length === 0
            };
            setAddresses(prev => [...prev, localAddr]);
            setNewAddress({ full_name: '', mobile: '', pincode: '', city: '', address_line: '' });
            setShowAddForm(false);
        } catch {
            // Local fallback
            const localAddr: BackendAddress = {
                id: Date.now(),
                ...newAddress,
                is_default: addresses.length === 0
            };
            setAddresses(prev => [...prev, localAddr]);
            setNewAddress({ full_name: '', mobile: '', pincode: '', city: '', address_line: '' });
            setShowAddForm(false);
        }
    };

    const handleDeleteAddress = async (id: number) => {
        try {
            const token = localStorage.getItem('jwt_token');
            if (token) {
                await fetch(`/api/delete_address/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
        } catch { /* ignore */ }
        setAddresses(prev => prev.filter(a => a.id !== id));
        if (selectedId === id) {
            const remaining = addresses.filter(a => a.id !== id);
            setSelectedId(remaining.length > 0 ? remaining[0].id : null);
        }
    };

    const selectedAddress = addresses.find(a => a.id === selectedId);

    const getAddressLabel = (addr: BackendAddress) => {
        if (addr.is_default) return 'HOME';
        if (addr.address_line.toLowerCase().includes('office') || addr.address_line.toLowerCase().includes('tech park')) return 'WORK';
        return 'OTHER';
    };

    return (
        <main className="flex-1 bg-background-light min-h-[calc(100vh-80px)] pb-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <button onClick={() => onNavigate && onNavigate('cart')} className="hover:text-primary transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined font-black">arrow_back</span>
                        </button>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Select Delivery Address</h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <span>Step 2 of 3</span>
                        <div className="flex gap-1.5">
                            <div className="w-8 h-2 rounded-full bg-primary"></div>
                            <div className="w-8 h-2 rounded-full bg-primary"></div>
                            <div className="w-8 h-2 rounded-full bg-slate-200"></div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Left Column - Map */}
                    <div className="lg:col-span-3">
                        <div className="relative rounded-3xl overflow-hidden border border-slate-100 shadow-sm" style={{ minHeight: '520px' }}>
                            {/* Leaflet Map Container */}
                            <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" style={{ minHeight: '520px' }}></div>

                            {/* Search Bar Overlay */}
                            <div className="absolute top-5 left-5 right-5 z-[1000]">
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for your area, street, or landmark"
                                        className="w-full bg-white/95 backdrop-blur-md rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-slate-700 border border-slate-200/50 shadow-lg focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Location Tooltip Overlay */}
                            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[1000]">
                                <div className="bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3 border border-slate-100">
                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary font-variation-fill text-lg">location_on</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Location</p>
                                        <p className="text-sm font-bold text-slate-900">{currentLocation}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Use Current Location Button */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
                                <button
                                    onClick={handleUseCurrentLocation}
                                    className="bg-white text-slate-800 font-bold py-3 px-6 rounded-2xl shadow-xl flex items-center gap-2.5 hover:shadow-2xl hover:-translate-y-0.5 transition-all border border-slate-100 text-sm btn-press"
                                >
                                    <span className="material-symbols-outlined text-primary font-variation-fill text-lg">my_location</span>
                                    Use my current location
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Saved Addresses */}
                    <div className="lg:col-span-2 space-y-5">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Saved Addresses</h2>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse">
                                        <div className="h-4 bg-slate-200 rounded w-24 mb-3"></div>
                                        <div className="h-3 bg-slate-100 rounded w-full mb-2"></div>
                                        <div className="h-3 bg-slate-100 rounded w-32"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Address Cards */}
                                {addresses.map(addr => {
                                    const label = getAddressLabel(addr);
                                    const isSelected = addr.id === selectedId;
                                    return (
                                        <div
                                            key={addr.id}
                                            onClick={() => handleSelectAddress(addr.id)}
                                            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${isSelected
                                                ? 'border-primary bg-white shadow-md shadow-primary/5'
                                                : 'border-slate-200 border-dashed bg-white/50 hover:border-slate-300 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Radio indicator */}
                                                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${isSelected ? 'border-primary' : 'border-slate-300'}`}>
                                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-black text-slate-900">{addr.full_name}</span>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${label === 'HOME'
                                                            ? 'bg-blue-50 text-primary'
                                                            : label === 'WORK'
                                                                ? 'bg-slate-100 text-slate-600'
                                                                : 'bg-amber-50 text-amber-600'
                                                            }`}>
                                                            {label}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed mb-1">{addr.address_line}</p>
                                                    <p className="text-xs text-slate-500 mb-2">{addr.city} - {addr.pincode}</p>
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                        <span className="material-symbols-outlined text-[16px]">call</span>
                                                        <span className="font-medium">{addr.mobile}</span>
                                                    </div>
                                                </div>
                                                {/* Edit/Delete buttons */}
                                                <div className="flex flex-col gap-1 shrink-0">
                                                    {isSelected && (
                                                        <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                                                            <span className="material-symbols-outlined text-slate-400 text-lg">edit</span>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                                                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-slate-300 hover:text-red-400 text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Add New Address */}
                                {!showAddForm ? (
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="w-full p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 text-primary font-bold text-sm btn-press"
                                    >
                                        <span className="material-symbols-outlined text-lg">add</span>
                                        Add a new address manually
                                    </button>
                                ) : (
                                    <div className="bg-white rounded-2xl border-2 border-primary p-5 space-y-4 page-enter">
                                        <h3 className="font-bold text-slate-900 text-sm">New Address</h3>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={newAddress.full_name}
                                            onChange={e => setNewAddress(p => ({ ...p, full_name: e.target.value }))}
                                            className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm font-medium border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            value={newAddress.mobile}
                                            onChange={e => setNewAddress(p => ({ ...p, mobile: e.target.value }))}
                                            className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm font-medium border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Pincode"
                                                value={newAddress.pincode}
                                                onChange={e => setNewAddress(p => ({ ...p, pincode: e.target.value }))}
                                                className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm font-medium border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                            <input
                                                type="text"
                                                placeholder="City"
                                                value={newAddress.city}
                                                onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))}
                                                className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm font-medium border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                            />
                                        </div>
                                        <textarea
                                            placeholder="Full Address (Street, Building, Landmark)"
                                            value={newAddress.address_line}
                                            onChange={e => setNewAddress(p => ({ ...p, address_line: e.target.value }))}
                                            rows={3}
                                            className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm font-medium border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                        />
                                        <div className="flex gap-3">
                                            <button onClick={() => setShowAddForm(false)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
                                                Cancel
                                            </button>
                                            <button onClick={handleAddAddress} className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all btn-press">
                                                Save Address
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Safe Delivery Badge */}
                        <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-5 flex items-start gap-4">
                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                                <span className="material-symbols-outlined text-white font-variation-fill text-lg">check_circle</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Safe & Contactless Delivery</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">Your location is verified for secure handling and sanitized delivery process.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sticky Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl shadow-black/10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-4">
                        <p className="text-xs text-slate-400 font-medium">Ready to checkout?</p>
                        <p className="text-sm font-black text-slate-900 truncate">
                            {selectedAddress ? `${selectedAddress.full_name}'s ${getAddressLabel(selectedAddress).charAt(0) + getAddressLabel(selectedAddress).slice(1).toLowerCase()}` : 'Select an address'}
                            {selectedAddress && (
                                <span className="text-slate-400 font-medium ml-2">| {selectedAddress.address_line.split(',')[0]}...</span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={() => onNavigate && onNavigate('cart')}
                            className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors btn-press"
                        >
                            Back to Cart
                        </button>
                        <button
                            onClick={() => {
                                if (selectedAddress && onNavigate) {
                                    onNavigate('checkout', { address: selectedAddress });
                                }
                            }}
                            className="px-8 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!selectedAddress}
                        >
                            Deliver Here
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
