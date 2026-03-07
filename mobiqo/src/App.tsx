import { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Trending } from './components/Trending';
import { TrendingDevices } from './components/TrendingDevices';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ForgotPassword } from './components/ForgotPassword';
import { AIAssistant } from './components/AIAssistant';
import { ProductDetails } from './components/ProductDetails';
import { Cart } from './components/Cart';
import { Address } from './components/Address';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';
import { CompareSearch } from './components/CompareSearch';
import { CompareResults } from './components/CompareResults';
import { ProfileLayout } from './components/ProfileLayout';
import { ProfileDashboard } from './components/ProfileDashboard';
import { WarrantyMain } from './components/WarrantyMain';
import { WarrantyRegister } from './components/WarrantyRegister';
import { WarrantyDetail } from './components/WarrantyDetail';
import { WarrantyClaim } from './components/WarrantyClaim';
import { WarrantyExtend } from './components/WarrantyExtend';
import { Orders } from './components/Orders';
import { OrderDetails } from './components/OrderDetails';
import { Notifications } from './components/Notifications';
import { PrivacySecurity } from './components/PrivacySecurity';
import { AIDeliveryLocations } from './components/AIDeliveryLocations';

import { AdminDashboard } from './components/AdminDashboard';
import { AdminUserManagement } from './components/AdminUserManagement';
import { AdminInventory } from './components/AdminInventory';
import { AdminAddProduct } from './components/AdminAddProduct';
import { AdminEditProduct } from './components/AdminEditProduct';
import { AdminOrders } from './components/AdminOrders';
import { AdminWarranties } from './components/AdminWarranties';
import { AdminReports } from './components/AdminReports';
import { AdminSettings } from './components/AdminSettings';

export interface CartItem {
    id: string;
    name: string;
    specs: string;
    price: number;
    originalPrice: number;
    image: string;
    quantity: number;
}

type Page =
    | 'home' | 'login' | 'register' | 'forgot-password'
    | 'ai-assistant' | 'product-details' | 'cart' | 'address' | 'checkout' | 'order-confirmation'
    | 'compare' | 'compare-results'
    | 'profile' | 'orders' | 'order-details' | 'warranty' | 'warranty-register' | 'warranty-detail' | 'warranty-claim' | 'warranty-extend'
    | 'addresses' | 'notifications' | 'privacy' | 'ai-delivery'
    | 'admin-dashboard' | 'admin-users' | 'admin-inventory' | 'admin-add-product' | 'admin-edit-product'
    | 'admin-orders' | 'admin-warranties' | 'admin-reports' | 'admin-settings';

export default function App() {
    const [page, setPage] = useState<Page>('home');
    const [pageData, setPageData] = useState<any>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartBounce, setCartBounce] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('jwt_token'));
    const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
    const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail') || '');

    const navigate = useCallback((dest: Page, data?: any) => {
        setPage(dest);
        setPageData(data || null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleLoginSuccess = (token: string, name: string, email: string) => {
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        setIsAuthenticated(true);
        setUserName(name);
        setUserEmail(email);
        navigate('home');
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        setIsAuthenticated(false);
        setUserName('');
        setUserEmail('');
        setCart([]);
        navigate('home');
    };

    const handleAddToCart = (item: CartItem, sourceElement?: HTMLElement | null) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id && i.specs === item.specs);
            if (existing) {
                return prev.map(i => i.id === item.id && i.specs === item.specs ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, item];
        });

        // Bounce animation
        setCartBounce(true);
        setTimeout(() => setCartBounce(false), 700);

        // Flying animation to cart icon
        if (sourceElement) {
            const cartBtn = document.getElementById('cart-icon-btn');
            if (cartBtn) {
                const srcRect = sourceElement.getBoundingClientRect();
                const dstRect = cartBtn.getBoundingClientRect();
                const flyEl = document.createElement('div');
                flyEl.style.cssText = `
          position: fixed;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #135bec;
          z-index: 9999;
          left: ${srcRect.left + srcRect.width / 2}px;
          top: ${srcRect.top + srcRect.height / 2}px;
          transition: left 0.65s cubic-bezier(.5,0,.5,1.2),
                      top 0.65s cubic-bezier(.5,0,.5,1.2),
                      opacity 0.65s, transform 0.65s;
          pointer-events: none;
        `;
                document.body.appendChild(flyEl);
                requestAnimationFrame(() => {
                    flyEl.style.left = `${dstRect.left + dstRect.width / 2}px`;
                    flyEl.style.top = `${dstRect.top + dstRect.height / 2}px`;
                    flyEl.style.opacity = '0';
                    flyEl.style.transform = 'scale(0.3)';
                });
                setTimeout(() => flyEl.remove(), 800);
            }
        }
    };

    const handleBuyNow = (item: CartItem) => {
        setCart([item]);
        navigate('address');
    };

    const handleRemoveFromCart = (id: string, specs: string) => {
        setCart(prev => prev.filter(i => !(i.id === id && i.specs === specs)));
    };

    const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);



    // Pages that hide the standard Navbar + BottomNav
    const hideNav = ['login', 'register', 'forgot-password'].includes(page);
    const isAdminPage = page.startsWith('admin-');

    const renderPage = () => {
        switch (page) {
            case 'login':
                return <Login onNavigate={navigate as any} onLoginSuccess={handleLoginSuccess} />;
            case 'register':
                return <Register onNavigate={navigate as any} onLoginSuccess={handleLoginSuccess} />;
            case 'forgot-password':
                return <ForgotPassword onNavigate={navigate as any} />;

            case 'ai-assistant':
                return <AIAssistant onNavigate={navigate as any} />;

            case 'product-details':
                return (
                    <ProductDetails
                        onNavigate={navigate as any}
                        product={pageData}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                    />
                );

            case 'cart':
                return (
                    <Cart
                        onNavigate={navigate as any}
                        cart={cart}
                        onRemoveFromCart={handleRemoveFromCart}
                    />
                );

            case 'address':
                return <Address onNavigate={navigate as any} cart={cart} />;

            case 'checkout':
                return (
                    <Checkout
                        onNavigate={navigate as any}
                        cart={cart}
                        selectedAddress={pageData?.address}
                    />
                );

            case 'order-confirmation':
                return (
                    <OrderConfirmation
                        onNavigate={navigate as any}
                        amount={pageData?.amount}
                        paymentMethod={pageData?.paymentMethod}
                        transactionId={pageData?.transactionId}
                    />
                );

            case 'compare':
                return <CompareSearch onNavigate={navigate as any} />;

            case 'compare-results':
                return <CompareResults onNavigate={navigate as any} device1Name={pageData?.device1} device2Name={pageData?.device2} />;

            case 'profile':
                return <ProfileDashboard onNavigate={navigate as any} />;

            case 'orders':
                return <Orders onNavigate={navigate as any} />;

            case 'order-details':
                return <OrderDetails onNavigate={navigate as any} order={pageData} />;

            case 'warranty':
                return (
                    <ProfileLayout activeTab="warranty" onNavigate={navigate as any}>
                        <WarrantyMain onNavigate={navigate as any} />
                    </ProfileLayout>
                );

            case 'warranty-register':
                return (
                    <ProfileLayout activeTab="warranty" onNavigate={navigate as any}>
                        <WarrantyRegister onNavigate={navigate as any} />
                    </ProfileLayout>
                );

            case 'warranty-detail':
                return (
                    <ProfileLayout activeTab="warranty" onNavigate={navigate as any}>
                        <WarrantyDetail onNavigate={navigate as any} warrantyId={pageData?.id ?? 0} device={pageData} />
                    </ProfileLayout>
                );

            case 'warranty-claim':
                return (
                    <ProfileLayout activeTab="warranty" onNavigate={navigate as any}>
                        <WarrantyClaim onNavigate={navigate as any} warranty={pageData} />
                    </ProfileLayout>
                );

            case 'warranty-extend':
                return (
                    <ProfileLayout activeTab="warranty" onNavigate={navigate as any}>
                        <WarrantyExtend onNavigate={navigate as any} warranty={pageData} />
                    </ProfileLayout>
                );

            case 'addresses':
                return (
                    <ProfileLayout activeTab="addresses" onNavigate={navigate as any}>
                        <Address onNavigate={navigate as any} cart={cart} />
                    </ProfileLayout>
                );

            case 'notifications':
                return <Notifications onNavigate={navigate as any} />;

            case 'privacy':
                return <PrivacySecurity onNavigate={navigate as any} />;

            case 'ai-delivery':
                return <AIDeliveryLocations onNavigate={navigate as any} />;

            // Admin Pages
            case 'admin-dashboard':
                return <AdminDashboard onNavigate={navigate as any} />;
            case 'admin-users':
                return <AdminUserManagement onNavigate={navigate as any} />;
            case 'admin-inventory':
                return <AdminInventory onNavigate={navigate as any} />;
            case 'admin-add-product':
                return <AdminAddProduct onNavigate={navigate as any} />;
            case 'admin-edit-product':
                return <AdminEditProduct onNavigate={navigate as any} productData={pageData} />;
            case 'admin-orders':
                return <AdminOrders onNavigate={navigate as any} />;
            case 'admin-warranties':
                return <AdminWarranties onNavigate={navigate as any} />;
            case 'admin-reports':
                return <AdminReports onNavigate={navigate as any} />;
            case 'admin-settings':
                return <AdminSettings onNavigate={navigate as any} />;

            // Home page (default)
            default:
                return (
                    <>
                        <Hero onNavigate={navigate as any} />
                        <Features />
                        <Trending onNavigate={navigate as any} onAddToCart={handleAddToCart} />
                        <TrendingDevices />
                        <CTA />
                        <Footer />
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            {!hideNav && !isAdminPage && (
                <Navbar
                    onNavigate={navigate as any}
                    cartCount={cartCount}
                    cartBounce={cartBounce}
                    isAuthenticated={isAuthenticated}
                    userName={userName}
                    userEmail={userEmail}
                    onLogout={handleLogout}
                />
            )}

            <div className={!hideNav && !isAdminPage ? 'pt-20 flex flex-col flex-1' : 'flex flex-col flex-1'}>
                {renderPage()}
            </div>

            {!hideNav && !isAdminPage && (
                <BottomNav onNavigate={navigate as any} currentPage={page} />
            )}
        </div>
    );
}
