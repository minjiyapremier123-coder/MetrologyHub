import { useState, useMemo, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Trophy, Medal, Award, Search, TrendingUp, TrendingDown, Minus, ShieldCheck, FileScan } from 'lucide-react';

export const Rankings = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [lang, setLang] = useState(localStorage.getItem('appLang') || 'English');

    useEffect(() => {
        const h = () => setLang(localStorage.getItem('appLang') || 'English');
        window.addEventListener('storage', h);
        return () => window.removeEventListener('storage', h);
    }, []);
    const isHindi = lang === 'Hindi';

    const t = {
        title: isHindi ? 'वैश्विक निरीक्षक रैंकिंग' : 'Global Inspector Rankings',
        subtitle: isHindi ? 'क्षेत्रीय अधिकारियों का प्रदर्शन और अनुपालन ऑडिट मीट्रिक।' : 'Performance and compliance audit metrics for field officers.',
        search: isHindi ? 'अधिकारी खोजें...' : 'Search officers...',
        rank: isHindi ? 'रैंक' : 'Rank',
        officer: isHindi ? 'अधिकारी' : 'Officer',
        audits: isHindi ? 'ऑडिट किए गए' : 'Audits',
        accuracy: isHindi ? 'सटीकता' : 'Accuracy',
        points: isHindi ? 'कुल अंक' : 'Total Points',
        trend: isHindi ? 'रुझान' : 'Trend'
    };

    const generateMockData = () => {
        const firstNames = ['Arjun', 'Riya', 'Mehta', 'Karthik', 'Priya', 'Vikram', 'Sneha', 'Rahul', 'Ananya', 'Deepak', 'Suresh', 'Pooja', 'Aisha', 'Vivek', 'Neha'];
        const lastNames = ['K.', 'S.', 'B.', 'R.', 'M.', 'T.', 'V.', 'G.', 'L.', 'P.', 'D.', 'N.', 'C.', 'J.', 'W.'];
        const data = [];
        let pts = 3000;
        let auds = 150;
        for (let i = 0; i < 15; i++) {
            data.push({
                id: i + 1,
                name: `${firstNames[i]} ${lastNames[i]}`,
                audits: auds,
                accuracy: 99 - i,
                points: pts,
                trend: i < 3 ? 'up' : (i > 10 ? 'down' : 'flat')
            });
            pts -= Math.floor(Math.random() * 150) + 50;
            auds -= Math.floor(Math.random() * 8) + 2;
        }
        return data;
    };

    const officers = useMemo(() => generateMockData(), []);
    const filtered = officers.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const getIcon = (index: number) => {
        if (index === 0) return <Trophy size={24} color="gold" />;
        if (index === 1) return <Medal size={24} color="silver" />;
        if (index === 2) return <Award size={24} color="#cd7f32" />;
        return <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>#{index + 1}</span>;
    };

    return (
        <div>
            <div className="d-flex justify-between align-center mb-6">
                <div>
                    <h1 className="page-title">{t.title}</h1>
                    <p className="page-subtitle">{t.subtitle}</p>
                </div>
            </div>

            <Card style={{ marginBottom: 24, background: 'linear-gradient(to right, var(--primary-light), var(--bg-app))' }}>
                <div className="d-flex justify-between align-center" style={{ flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} className="text-muted" style={{ position: 'absolute', top: 11, left: 14 }} />
                            <input
                                type="text"
                                placeholder={t.search}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '50px', border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text-primary)', outline: 'none' }}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((o, i) => (
                    <Card key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', transition: 'all 0.2s', transform: 'translateY(0)', cursor: 'default' }} className="officer-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24, width: '40%' }}>
                            <div style={{ width: 48, height: 48, borderRadius: 24, background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                {getIcon(i)}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{o.name}</h3>
                                <p className="text-secondary" style={{ margin: 0, fontSize: '0.85rem' }}>Inspector ID: LMP-{2000 + o.id}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 48, width: '40%', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)' }}><FileScan size={16} /> <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{o.audits}</span></div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.audits}</span>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)' }}><ShieldCheck size={16} /> <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{o.accuracy}%</span></div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.accuracy}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 24, width: '20%', justifyContent: 'flex-end' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '6px 12px', borderRadius: 16, fontWeight: 800, fontSize: '1rem', display: 'inline-block' }}>
                                    {o.points} pts
                                </div>
                            </div>
                            <div>
                                {o.trend === 'up' && <TrendingUp className="text-success" />}
                                {o.trend === 'down' && <TrendingDown className="text-danger" />}
                                {o.trend === 'flat' && <Minus className="text-muted" />}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <style>{`
                .officer-card:hover {
                    box-shadow: var(--shadow-md) !important;
                    border-color: var(--primary) !important;
                }
            `}</style>
        </div>
    );
};
