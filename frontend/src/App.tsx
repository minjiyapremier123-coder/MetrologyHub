import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Scanner } from './pages/Scanner';
import { Auth } from './pages/Auth';
import { Repository } from './pages/Repository';
import { Rankings } from './pages/Rankings';
import { Verify } from './pages/Verify';
import { Settings } from './pages/Settings';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    return localStorage.getItem('auth') === '1' ? children : <Navigate to="/auth" />;
};

function App() {
    useEffect(() => {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route path="/verify/:id" element={<Verify />} />
                <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="scan" element={<Scanner />} />
                    <Route path="repository" element={<Repository />} />
                    <Route path="rankings" element={<Rankings />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
