import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { isMisconfigured } from "./lib/supabase";
import ConfigError from "./components/ConfigError";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import ArticlePage from "./pages/ArticlePage";
import EventsPage from "./pages/EventsPage";
import HelpPage from "./pages/HelpPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AccountPage from "./pages/AccountPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import AdminNewsPage from "./pages/admin/AdminNewsPage";
import AdminNewsEditorPage from "./pages/admin/AdminNewsEditorPage";

export default function App() {
  if (isMisconfigured) return <ConfigError />;

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<ArticlePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route element={<RequireAuth />}>
              <Route path="/account" element={<AccountPage />} />
            </Route>
            <Route element={<RequireAuth staff />}>
              <Route path="/admin/news" element={<AdminNewsPage />} />
              <Route path="/admin/news/:id" element={<AdminNewsEditorPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
