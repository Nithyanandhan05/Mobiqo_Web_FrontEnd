import { Home, ArrowLeftRight, Sparkles, ShieldCheck, User } from 'lucide-react';
import './BottomNav.css';

interface BottomNavProps {
    onNavigate?: (page: any, data?: any) => void;
    currentPage?: string;
}

export function BottomNav({ onNavigate, currentPage }: BottomNavProps) {
    const navigate = (page: string) => {
        onNavigate && onNavigate(page);
    };

    return (
        <div className="bottom-nav-container">
            <div className="bottom-nav">
                <a
                    href="#"
                    className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); navigate('home'); }}
                    aria-label="Home"
                >
                    <Home size={22} className={currentPage === 'home' ? 'text-primary' : ''} />
                    <span className="nav-label">Home</span>
                </a>
                <a
                    href="#"
                    className={`nav-item ${currentPage === 'compare' || currentPage === 'compare-results' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); navigate('compare'); }}
                    aria-label="Compare"
                >
                    <ArrowLeftRight size={22} className={currentPage === 'compare' || currentPage === 'compare-results' ? 'text-primary' : ''} />
                    <span className="nav-label">Compare</span>
                </a>

                {/* Center Prominent Button - AI Assistant */}
                <div className="nav-item-center-wrapper">
                    <button
                        className="nav-item-center"
                        onClick={() => navigate('ai-assistant')}
                        aria-label="AI Assistant"
                    >
                        <Sparkles size={26} color="#FFF" />
                    </button>
                </div>

                <a
                    href="#"
                    className={`nav-item ${currentPage === 'warranty' || currentPage?.startsWith('warranty') ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); navigate('warranty'); }}
                    aria-label="Warranty"
                >
                    <ShieldCheck size={22} className={currentPage?.startsWith('warranty') ? 'text-primary' : ''} />
                    <span className="nav-label">Warranty</span>
                </a>
                <a
                    href="#"
                    className={`nav-item ${currentPage === 'profile' || currentPage === 'orders' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); navigate('profile'); }}
                    aria-label="Profile"
                >
                    <User size={22} className={currentPage === 'profile' || currentPage === 'orders' ? 'text-primary' : ''} />
                    <span className="nav-label">Profile</span>
                </a>
            </div>
        </div>
    );
}
