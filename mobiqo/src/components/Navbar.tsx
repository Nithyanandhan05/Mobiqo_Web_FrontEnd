import { useState, useEffect, useRef, useCallback } from 'react';
import { getHDImage } from '../utils/imageHelper';

interface NavbarProps {
  onNavigate?: (page: any, data?: any) => void;
  cartCount?: number;
  cartBounce?: boolean;
  isAuthenticated?: boolean;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export function Navbar({ onNavigate, cartCount = 0, cartBounce = false, isAuthenticated = false, userName = '', userEmail = '', onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── Search state ──
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFetched, setSearchFetched] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Fetch all products once on first focus
  const ensureProductsFetched = useCallback(async () => {
    if (searchFetched) return;
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.status === 'success' && data.products) {
        setAllProducts(data.products);
      }
    } catch { /* silent */ }
    setSearchFetched(true);
  }, [searchFetched]);

  // Filter products as user types
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); setSearchOpen(false); return; }
    const filtered = allProducts
      .filter(p => p.name?.toLowerCase().includes(q))
      .slice(0, 6);
    setResults(filtered);
    setSearchOpen(filtered.length > 0);
  }, [query, allProducts]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !desktopRef.current?.contains(e.target as Node) &&
        !mobileRef.current?.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (product: any) => {
    onNavigate && onNavigate('product-details', product);
    setQuery('');
    setResults([]);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setSearchOpen(false); }
  };

  const navigate = (page: any) => {
    onNavigate && onNavigate(page);
    setMobileMenuOpen(false);
  };

  // Reusable search results dropdown
  const SearchDropdown = () =>
    searchOpen && results.length > 0 ? (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-slate-900/10 z-[60] overflow-hidden">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">
          Products from Database
        </p>
        {results.map(p => {
          const rawPrice = String(p.price || '').replace(/[^0-9.]/g, '');
          const numPrice = parseFloat(rawPrice);
          return (
            <button
              key={p.id}
              onMouseDown={() => handleSelect(p)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={getHDImage(p.image_url, p.name)}
                  alt={p.name}
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                <p className="text-xs font-bold text-primary">
                  {numPrice ? `₹${numPrice.toLocaleString('en-IN')}` : p.price}
                </p>
              </div>
              <span className="material-symbols-outlined text-slate-300 text-base shrink-0">arrow_forward</span>
            </button>
          );
        })}
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-400 font-medium">
            {results.length} product{results.length > 1 ? 's' : ''} found
          </p>
        </div>
      </div>
    ) : null;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-6">

          {/* ── Logo ── */}
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate('home')}>
            <img src="/logo.png" alt="Mobiqo Logo" className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-sm" />
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none">Mobiqo</h2>
          </div>

          {/* ── Nav Links (desktop only) ── */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 flex-1 justify-center">
            <a className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer whitespace-nowrap" onClick={() => navigate('compare')}>Compare Devices</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer whitespace-nowrap" onClick={() => navigate('ai-assistant')}>AI Assistant</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer whitespace-nowrap" onClick={() => navigate('warranty')}>Warranty</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors cursor-pointer whitespace-nowrap" onClick={() => navigate('orders')}>My Orders</a>
            {userEmail === 'admin@gmail.com' && (
              <a className="text-sm font-bold text-primary hover:underline transition-colors cursor-pointer flex items-center gap-1" onClick={() => navigate('admin-dashboard')}>
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>Admin
              </a>
            )}
          </nav>

          {/* ── Right: Search + Actions ── */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

            {/* Desktop live search */}
            <div className="hidden lg:flex items-center group" ref={desktopRef}>
              <div className="relative w-52">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] group-focus-within:text-primary transition-colors">search</span>
                <input
                  className="w-full bg-slate-200/50 dark:bg-slate-800/50 border-none rounded-lg pl-8 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500 outline-none"
                  placeholder="Search devices..."
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => ensureProductsFetched()}
                  onKeyDown={handleKey}
                />
                <SearchDropdown />
              </div>
            </div>

            {/* Auth buttons / User pill — desktop only */}
            <div className="hidden lg:flex items-center gap-2">
              {!isAuthenticated ? (
                <>
                  <button onClick={() => navigate('login')} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">Login</button>
                  <button onClick={() => navigate('register')} className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold bg-[#1f93f6] text-white hover:bg-[#157ad2] rounded-lg transition-colors shadow-sm shadow-[#1f93f6]/20">Sign Up</button>
                </>
              ) : (
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 py-1.5 px-3 rounded-full">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">{userName.charAt(0).toUpperCase()}</div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{userName.split(' ')[0]}</span>
                  <button onClick={onLogout} className="text-slate-400 hover:text-red-500 transition-colors ml-1">
                    <span className="material-symbols-outlined text-sm">logout</span>
                  </button>
                </div>
              )}
            </div>

            <div className="hidden lg:block h-6 w-px bg-slate-300 dark:bg-slate-700"></div>

            {/* Cart */}
            <button
              id="cart-icon-btn"
              onClick={() => navigate('cart')}
              className={`relative p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${cartBounce ? 'cart-wiggle' : ''}`}
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span key={cartCount} className={`absolute top-1 right-1 w-5 h-5 bg-primary text-[10px] text-white flex items-center justify-center rounded-full font-bold ${cartBounce ? 'cart-badge-pop' : ''}`}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile avatar — desktop only */}
            {isAuthenticated && (
              <button onClick={() => navigate('profile')} className="hidden lg:flex p-1 rounded-full border-2 border-primary/20 hover:scale-105 transition-transform">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#1f93f6' }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
              </button>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu Drawer ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-4 flex flex-col gap-1 animate-in slide-in-from-top-4 duration-200">

            {/* Mobile live search */}
            <div className="relative mb-3" ref={mobileRef}>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input
                className="w-full bg-slate-200/50 dark:bg-slate-800/50 border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500 outline-none"
                placeholder="Search devices..."
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => ensureProductsFetched()}
                onKeyDown={handleKey}
              />
              <SearchDropdown />
            </div>

            {/* Nav links */}
            {[
              { label: 'Compare Devices', page: 'compare', icon: 'compare_arrows' },
              { label: 'AI Assistant', page: 'ai-assistant', icon: 'auto_awesome' },
              { label: 'Warranty', page: 'warranty', icon: 'verified_user' },
              { label: 'My Orders', page: 'orders', icon: 'package_2' },
            ].map(item => (
              <button key={item.page} onClick={() => navigate(item.page)} className="flex items-center gap-3 px-3 py-3.5 text-sm font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left w-full min-h-[48px]">
                <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                {item.label}
              </button>
            ))}

            {userEmail === 'admin@gmail.com' && (
              <button onClick={() => navigate('admin-dashboard')} className="flex items-center gap-3 px-3 py-3.5 text-sm font-bold text-primary rounded-xl hover:bg-primary/10 transition-colors text-left w-full min-h-[48px]">
                <span className="material-symbols-outlined text-xl">admin_panel_settings</span>Admin Panel
              </button>
            )}

            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

            {/* Auth section */}
            {!isAuthenticated ? (
              <div className="flex gap-3 pt-1">
                <button onClick={() => navigate('login')} className="flex-1 py-3 text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition-colors min-h-[48px]">Login</button>
                <button onClick={() => navigate('register')} className="flex-1 py-3 text-sm font-bold bg-[#1f93f6] text-white rounded-xl hover:bg-[#157ad2] transition-colors min-h-[48px]">Sign Up</button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#1f93f6' }}>{userName.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="text-sm font-bold">{userName}</p>
                    <p className="text-xs text-slate-500">{userEmail}</p>
                  </div>
                </div>
                <button onClick={() => { onLogout && onLogout(); setMobileMenuOpen(false); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-xl">logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
