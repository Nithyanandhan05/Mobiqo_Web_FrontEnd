import { useState, useEffect } from 'react';
import { User, Sparkles, Mic } from 'lucide-react';
import './Dashboard.css';
import { getHDImage } from '../utils/imageHelper';

interface Product {
    id: number;
    name: string;
    price: string;
    image_url: string;
}

export function Dashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [aiQuery, setAiQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const categories = ['All', 'Gaming', 'Camera', 'Battery', 'Budget'];
    const [activeCategory, setActiveCategory] = useState('All');

    // Fetch initial products
    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setProducts(data.products || []);
                }
            })
            .catch(err => console.error("Error fetching Top Picks:", err));
    }, []);

    const handleAiSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiQuery.trim()) return;

        setIsLoading(true);
        try {
            // Very basic parser for budget from query (e.g., "under 40k")
            let budget = 30000;
            const budgetMatch = aiQuery.match(/(\d+)(k|000)/i);
            if (budgetMatch) {
                budget = parseInt(budgetMatch[1]) * (budgetMatch[2].toLowerCase() === 'k' ? 1000 : 1);
            }

            const res = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ budget, brand: 'Any' })
            });
            const data = await res.json();
            console.log("AI Result:", data);
            // In a real app we'd show this in a modal or navigate.
            alert(`AI Recommends: ${data.data?.top_match?.name || 'Error'}`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            {/* 1. Header Section */}
            <header className="dash-header animate-fade-in delay-100">
                <div className="header-text">
                    <p className="greeting">Good Morning,</p>
                    <h1 className="main-title">AI is ready to assist you today</h1>
                </div>
                <div className="profile-icon">
                    <User size={24} color="var(--primary)" />
                </div>
            </header>

            {/* 2. Generic Search Section */}
            <div className="search-wrapper animate-fade-in delay-100">
                <div className="search-box">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search smart devices..."
                        className="search-input-field"
                    />
                </div>
            </div>

            {/* 3. AI Assistant Banner Component */}
            <div className="ai-banner animate-fade-in delay-100">
                <div className="ai-banner-header">
                    <Sparkles size={24} color="#FFF" />
                    <h2>Ask AI Assistant</h2>
                </div>
                <form onSubmit={handleAiSearch} className="ai-input-wrapper">
                    <input
                        type="text"
                        className="ai-input"
                        placeholder="e.g., 'Best Gaming Phone under 40k'"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" className="ai-mic-btn" disabled={isLoading}>
                        <Mic size={18} color="#FFF" />
                    </button>
                </form>
            </div>

            {/* 4. Filter Chips */}
            <div className="category-scroll hide-scrollbar animate-fade-in delay-200">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* 5. AI Top Picks Grid */}
            <div className="top-picks-section animate-fade-in delay-200">
                <h3 className="section-title">AI Top Picks for You</h3>

                <div className="product-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="match-badge">99% Match</div>
                            <div className="product-img-wrapper">
                                <img
                                    src={getHDImage(product.image_url, product.name)}
                                    alt={product.name}
                                    className="product-img"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(product.name) + '&background=random';
                                    }}
                                />
                            </div>
                            {/* <h4 className="card-title">{product.name}</h4>
              <p className="card-price">₹{product.price}</p> */}
                        </div>
                    ))}

                    {/* Fallback mock data if DB is empty */}
                    {products.length === 0 && (
                        <>
                            <div className="product-card">
                                <div className="match-badge">99% Match</div>
                                <div className="product-img-wrapper">
                                    <img src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400" alt="Phone" className="product-img" />
                                </div>
                            </div>
                            <div className="product-card">
                                <div className="match-badge">99% Match</div>
                                <div className="product-img-wrapper">
                                    <img src="https://images.unsplash.com/photo-1707227155452-19e09d5718a3?auto=format&fit=crop&q=80&w=400" alt="Phone" className="product-img" />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
