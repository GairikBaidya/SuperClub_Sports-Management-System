import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import RegistrationPage from '../pages/RegistrationPage';
import SuccessPage from '../pages/SuccessPage';
import LoginPage from '../pages/admin/LoginPage';
import DashboardPage from '../pages/admin/DashboardPage';
import AthleteDetailPage from '../pages/admin/AthleteDetailPage';
import ProtectedRoute from './ProtectedRoute';

function NotFoundPage() {
  return (
    <div className="sc-page flex items-center justify-center">
      <div className="text-center sc-fade-in">
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '120px', letterSpacing: '8px', background: 'linear-gradient(135deg, var(--gold), var(--crimson))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>404</p>
        <p style={{ color: 'var(--text-muted)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '14px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '24px' }}>Page not found.</p>
        <a href="/" className="btn-primary">Go Home</a>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/success" element={<SuccessPage />} />

      {/* Admin */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
      />
      <Route
        path="/admin/athletes/:id"
        element={<ProtectedRoute><AthleteDetailPage /></ProtectedRoute>}
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
