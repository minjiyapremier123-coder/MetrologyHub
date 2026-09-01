import { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Lock, Palette, Shield } from 'lucide-react';

export const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [passwordStatus, setPasswordStatus] = useState('');
    const [saveStatus, setSaveStatus] = useState('');
    const [langStatus, setLangStatus] = useState('');
    const [mfaActive, setMfaActive] = useState(true);

    // Translation Setup
    const [lang, setLang] = useState(localStorage.getItem('appLang') || 'English');
    useEffect(() => {
        const h = () => setLang(localStorage.getItem('appLang') || 'English');
        window.addEventListener('storage', h);
        return () => window.removeEventListener('storage', h);
    }, []);
    const isHindi = lang === 'Hindi';

    const [editName, setEditName] = useState(localStorage.getItem('userName') || 'Admin User');
    const [editEmail, setEditEmail] = useState(localStorage.getItem('userEmail') || 'admin@gov.in');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(localStorage.getItem('userAvatar') || null);

    const roleDisplay = localStorage.getItem('userRole') === 'admin' ? (isHindi ? 'सिस्टम एडमिन' : 'System Admin')
        : localStorage.getItem('userRole') === 'supervisor' ? (isHindi ? 'पर्यवेक्षक' : 'Supervisor')
            : (isHindi ? 'निरीक्षक' : 'Inspector');

    const fileRef = useRef<HTMLInputElement>(null);

    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length > 1) return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
        return name.slice(0, 2).toUpperCase();
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                localStorage.setItem('userAvatar', base64);
                setAvatarUrl(base64);
                window.dispatchEvent(new Event('storage'));
            };
            reader.readAsDataURL(f);
        }
    };

    const handleProfileSave = () => {
        localStorage.setItem('userName', editName);
        localStorage.setItem('userEmail', editEmail);
        setSaveStatus(isHindi ? 'प्रोफाइल अद्यतन हो गया' : 'Profile Updated');
        setTimeout(() => setSaveStatus(''), 3000);
        window.dispatchEvent(new Event('storage'));
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const l = e.target.value;
        localStorage.setItem('appLang', l);
        window.dispatchEvent(new Event('storage'));
        setLangStatus(l === 'Hindi' ? `भाषा बदलकर ${l} हो गई` : `Language changed to ${l}`);
        setTimeout(() => setLangStatus(''), 3000);
    };

    const handlePasswordUpdate = () => {
        setPasswordStatus(isHindi ? 'सुरक्षित वॉल्ट को अपडेट किया जा रहा है...' : 'Updating secure vault...');
        setTimeout(() => setPasswordStatus(isHindi ? 'पासवर्ड सफलतापूर्वक अपडेट किया गया!' : 'Password Updated Successfully!'), 1500);
        setTimeout(() => setPasswordStatus(''), 4000);
    };

    const t = {
        settings: isHindi ? 'सेटिंग्स' : 'Settings',
        subtitle: isHindi ? 'अपना खाता, सुरक्षा और एप्लिकेशन प्राथमिकताएं प्रबंधित करें।' : 'Manage your account, security, and application preferences.',
        profile_tab: isHindi ? 'उपयोगकर्ता प्रोफ़ाइल' : 'User Profile',
        security_tab: isHindi ? 'सुरक्षा और प्रमाणीकरण' : 'Security & Auth',
        pref_tab: isHindi ? 'प्राथमिकताएँ' : 'Preferences',

        profile_title: isHindi ? 'प्रोफ़ाइल जानकारी' : 'Profile Information',
        avatar_btn: isHindi ? 'अवतार बदलें' : 'Change Avatar',
        avatar_desc: isHindi ? 'अनुशंसित: 256px JPG/PNG' : 'Recommended: 256px JPG/PNG',
        full_name: isHindi ? 'पूरा नाम' : 'Full Name',
        email_addr: isHindi ? 'ईमेल पता' : 'Email Address',
        role_label: isHindi ? 'भूमिका' : 'Role',
        save_btn: isHindi ? 'परिवर्तन सहेजें' : 'Save Changes',

        sec_title: isHindi ? 'सुरक्षा सेटिंग्स' : 'Security Settings',
        sec_mfa: isHindi ? 'टू-फैक्टर ऑथेंटिकेशन (MFA)' : 'Two-Factor Authentication (MFA)',
        sec_mfa_desc: mfaActive
            ? (isHindi ? 'बायोमेट्रिक्स / युबिकी वर्तमान में सक्रिय है।' : 'Biometrics / YubiKey is currently active.')
            : (isHindi ? 'प्रमाणीकरण वर्तमान में अक्षम है।' : 'Authentication is currently disabled.'),
        sec_manage: mfaActive
            ? (isHindi ? 'अक्षम करें' : 'Disable')
            : (isHindi ? 'सक्षम करें' : 'Enable'),
        sec_change: isHindi ? 'पासवर्ड बदलें' : 'Change Password',
        sec_curr: isHindi ? 'वर्तमान पासवर्ड' : 'Current Password',
        sec_new: isHindi ? 'नया पासवर्ड' : 'New Password',
        sec_upd: isHindi ? 'पासवर्ड अपडेट करें' : 'Update Password',

        pref_title: isHindi ? 'सिस्टम प्राथमिकताएँ' : 'System Preferences',
        pref_dark: isHindi ? 'डार्क मोड' : 'Dark Mode',
        pref_dark_desc: isHindi ? 'वैश्विक डार्क थीम टॉगल करें।' : 'Toggle the global dark theme.',
        pref_tog: isHindi ? 'थीम टॉगल करें' : 'Toggle Theme',
        pref_notif: isHindi ? 'ईमेल सूचनाएं' : 'Email Notifications',
        pref_notif_desc: isHindi ? 'गैर-अनुपालन स्कैन पर अद्यतन प्राप्त करें।' : 'Receive updates on non-compliant scans.',
        pref_lang: isHindi ? 'भाषा' : 'Language',
        pref_lang_desc: isHindi ? 'एप्लिकेशन भाषा चुनें।' : 'Select application language.',
    };

    const tabs = [
        { id: 'profile', label: t.profile_tab, icon: User },
        { id: 'security', label: t.security_tab, icon: Lock },
        { id: 'preferences', label: t.pref_tab, icon: Palette },
    ];

    return (
        <div>
            <h1 className="page-title">{t.settings}</h1>
            <p className="page-subtitle">{t.subtitle}</p>

            <div className="d-flex gap-6" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <Card style={{ flex: '0 0 250px', padding: 8 }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                width: '100%', padding: '12px 16px',
                                borderRadius: 8, border: 'none',
                                background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                                fontWeight: activeTab === tab.id ? 600 : 500,
                                cursor: 'pointer', textAlign: 'left',
                                marginBottom: 4, transition: 'all 0.2s'
                            }}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </Card>

                <div style={{ flex: '1 1 400px' }}>
                    {activeTab === 'profile' && (
                        <Card>
                            <h2 className="mb-6">{t.profile_title}</h2>
                            <div className="d-flex gap-4 align-center mb-6">
                                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 600, overflow: 'hidden' }}>
                                    {avatarUrl ? <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(editName)}
                                </div>
                                <div>
                                    <input type="file" ref={fileRef} accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                                    <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>{t.avatar_btn}</Button>
                                    <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>{t.avatar_desc}</p>
                                </div>
                            </div>

                            <div className="input-group mb-4">
                                <label className="text-muted" style={{ display: 'block', marginBottom: 8 }}>{t.full_name}</label>
                                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text-primary)' }} />
                            </div>
                            <div className="input-group mb-4">
                                <label className="text-muted" style={{ display: 'block', marginBottom: 8 }}>{t.email_addr}</label>
                                <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text-primary)' }} />
                            </div>
                            <div className="input-group mb-6">
                                <label className="text-muted" style={{ display: 'block', marginBottom: 8 }}>{t.role_label}</label>
                                <input type="text" value={roleDisplay} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text-primary)' }} disabled />
                            </div>

                            <div className="d-flex align-center gap-4">
                                <Button onClick={handleProfileSave}>{t.save_btn}</Button>
                                {saveStatus && <span className="text-success">{saveStatus}</span>}
                            </div>
                        </Card>
                    )}

                    {activeTab === 'security' && (
                        <Card>
                            <h2 className="mb-6">{t.sec_title}</h2>

                            <div className="mb-6" style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 8 }}>
                                <div className="d-flex justify-between align-center mb-4">
                                    <div className="d-flex gap-4 align-center">
                                        <Shield size={24} className={mfaActive ? "text-success" : "text-muted"} />
                                        <div>
                                            <h4 style={{ marginBottom: 4 }}>{t.sec_mfa}</h4>
                                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>{t.sec_mfa_desc}</p>
                                        </div>
                                    </div>
                                    <Button variant={mfaActive ? "outline" : "primary"} size="sm" onClick={() => setMfaActive(!mfaActive)}>{t.sec_manage}</Button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="mb-4">{t.sec_change}</h4>
                                <div className="input-group mb-4">
                                    <input type="password" placeholder={t.sec_curr} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text-primary)' }} />
                                </div>
                                <div className="input-group mb-4">
                                    <input type="password" placeholder={t.sec_new} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text-primary)' }} />
                                </div>
                                <div className="d-flex align-center gap-4">
                                    <Button onClick={handlePasswordUpdate}>{t.sec_upd}</Button>
                                    {passwordStatus && (
                                        <span className={passwordStatus.includes('successfully') || passwordStatus.includes('सफलतापूर्वक') ? 'text-success' : 'text-muted'}>
                                            {passwordStatus}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'preferences' && (
                        <Card>
                            <h2 className="mb-6">{t.pref_title}</h2>

                            <div className="d-flex justify-between align-center mb-6 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
                                <div>
                                    <h4 style={{ marginBottom: 4 }}>{t.pref_dark}</h4>
                                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>{t.pref_dark_desc}</p>
                                </div>
                                <Button variant="secondary" size="sm" onClick={() => document.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')}>{t.pref_tog}</Button>
                            </div>

                            <div className="d-flex justify-between align-center mb-6 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
                                <div>
                                    <h4 style={{ marginBottom: 4 }}>{t.pref_notif}</h4>
                                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>{t.pref_notif_desc}</p>
                                </div>
                                <input type="checkbox" defaultChecked style={{ width: 20, height: 20 }} />
                            </div>

                            <div className="d-flex justify-between align-center">
                                <div>
                                    <h4 style={{ marginBottom: 4 }}>{t.pref_lang}</h4>
                                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>{t.pref_lang_desc}</p>
                                    {langStatus && <p className="text-success" style={{ fontSize: '0.8rem', marginTop: 4 }}>{langStatus}</p>}
                                </div>
                                <select
                                    value={lang}
                                    onChange={handleLanguageChange}
                                    style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}
                                >
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                </select>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
