import { Navigate, Route, Routes } from 'react-router-dom';
import ForumLayout from './components/layout/ForumLayout';
import PostDetailLayout from './components/layout/PostDetailLayout';
import AuthShellLayout from './components/layout/AuthShellLayout';
import ProfileShellLayout from './components/layout/ProfileShellLayout';
import HomePage from './pages/home/HomePage';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyResetOTP from './components/auth/VerifyResetOTP';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import ProfilePage from './pages/profile/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PostDetailPage from './pages/post/PostDetailPage';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route element={<ForumLayout />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthShellLayout />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/verify-reset-otp" element={<VerifyResetOTP />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
      </Route>
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
      <Route path="/register" element={<Navigate to="/auth/register" replace />} />
      <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />
      <Route path="/verify-reset-otp" element={<Navigate to="/auth/verify-reset-otp" replace />} />
      <Route path="/reset-password" element={<Navigate to="/auth/reset-password" replace />} />

      {/* User / Admin */}
      <Route element={<ProfileShellLayout />}>
        <Route path="/user/profile" element={<ProfilePage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
      </Route>

      {/* Post Detail */}
      <Route element={<PostDetailLayout />}>
        <Route path="/posts/:id" element={<PostDetailPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
