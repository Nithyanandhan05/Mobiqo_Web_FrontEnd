import { ChevronRight, Cpu, Battery, Camera } from 'lucide-react';
import './TrendingDevices.css';

const devices = [
    {
        id: 1,
        name: 'Samsung Galaxy S24 Ultra',
        price: '₹1,29,999',
        image: 'https://images.unsplash.com/photo-1707227155452-19e09d5718a3?auto=format&fit=crop&q=80&w=600',
        specs: { cpu: 'Snapdragon 8 Gen 3', battery: '5000 mAh', camera: '200 MP' }
    },
    {
        id: 2,
        name: 'iPhone 15 Pro Max',
        price: '₹1,59,900',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600',
        specs: { cpu: 'A17 Pro', battery: '4422 mAh', camera: '48 MP' }
    },
    {
        id: 3,
        name: 'OnePlus 12',
        price: '₹64,999',
        image: 'https://images.unsplash.com/photo-1706606990494-df764319c500?auto=format&fit=crop&q=80&w=600',
        specs: { cpu: 'Snapdragon 8 Gen 3', battery: '5400 mAh', camera: '50 MP' }
    }
];

export function TrendingDevices() {
    return (
        <section className="trending" id="trending">
            <div className="container">
                <div className="trending-header flex-between animate-fade-in-up">
                    <div>
                        <span className="section-tag" style={{ display: 'block', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.875rem', marginBottom: '1rem' }}>Live Market Data</span>
                        <h2 className="section-title mb-0">Trending <span className="text-gradient">Devices</span></h2>
                    </div>
                    <button className="btn btn-secondary view-all-btn">
                        View All <ChevronRight size={18} />
                    </button>
                </div>

                <div className="device-slider">
                    {devices.map((device, idx) => (
                        <div key={device.id} className={`device-card glass-panel animate-fade-in-up delay-${(idx + 1) * 100}`}>
                            <div className="device-img-wrapper">
                                <img src={device.image} alt={device.name} className="device-img" />
                                <div className="device-overlay">
                                    <button className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Compare Specs</button>
                                </div>
                            </div>
                            <div className="device-info">
                                <h3 className="device-name">{device.name}</h3>
                                <div className="device-price">{device.price}</div>

                                <div className="device-specs-mini">
                                    <div className="spec-chip">
                                        <Cpu size={14} /> <span>{device.specs.cpu}</span>
                                    </div>
                                    <div className="spec-chip">
                                        <Battery size={14} /> <span>{device.specs.battery}</span>
                                    </div>
                                    <div className="spec-chip">
                                        <Camera size={14} /> <span>{device.specs.camera}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
