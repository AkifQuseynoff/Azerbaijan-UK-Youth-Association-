import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ConfigError from "../components/ConfigError";
import ErrorBoundary from "../components/ErrorBoundary";
import Layout from "../components/Layout";
import AccountPage from "../features/account/AccountPage";
import { AuthProvider } from "../features/auth/AuthContext";
import { SiteProvider } from "../features/site/SiteContext";
import RequireAuth from "../features/auth/RequireAuth";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import EventDetailPage from "../features/events/pages/EventDetailPage";
import EventsPage from "../features/events/pages/EventsPage";
import EpisodePage from "../features/podcasts/pages/EpisodePage";
import PodcastPage from "../features/podcasts/pages/PodcastPage";
import ArticlePage from "../features/news/pages/ArticlePage";
import NewsPage from "../features/news/pages/NewsPage";
import { isMisconfigured } from "../lib/supabase";
import AboutPage from "../pages/AboutPage";
import SocietiesPage from "../features/societies/pages/SocietiesPage";
import SocietyPage from "../features/societies/pages/SocietyPage";
import HelpPage from "../pages/HelpPage";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import PrivacyPage from "../pages/PrivacyPage";
import TermsPage from "../pages/TermsPage";

// Staff screens are split out so ordinary visitors never download them.
const AdminNewsPage = lazy(() => import("../features/news/admin/AdminNewsPage"));
const AdminNewsEditorPage = lazy(() => import("../features/news/admin/AdminNewsEditorPage"));
const AdminEventsPage = lazy(() => import("../features/events/admin/AdminEventsPage"));
const AdminPodcastPage = lazy(() => import("../features/podcasts/admin/AdminPodcastPage"));
const AdminPodcastEditorPage = lazy(() => import("../features/podcasts/admin/AdminPodcastEditorPage"));
const AdminActivitiesPage = lazy(() => import("../features/activities/admin/AdminActivitiesPage"));
const AdminActivityEditorPage = lazy(() => import("../features/activities/admin/AdminActivityEditorPage"));
const AdminSitePage = lazy(() => import("../features/site/AdminSitePage"));
const AdminSocietiesPage = lazy(() => import("../features/societies/admin/AdminSocietiesPage"));
const AdminSocietyEditorPage = lazy(() => import("../features/societies/admin/AdminSocietyEditorPage"));
const AdminMembersPage = lazy(() => import("../features/members/AdminMembersPage"));
const AdminEventEditorPage = lazy(() => import("../features/events/admin/AdminEventEditorPage"));

export default function App() {
  if (isMisconfigured) return <ConfigError />;

  return (
    <ErrorBoundary>
      <AuthProvider>
        <SiteProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen pt-28 text-center text-mute">Loading…</div>}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<ArticlePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:slug" element={<EventDetailPage />} />
                <Route path="/podcast" element={<PodcastPage />} />
                <Route path="/podcast/:slug" element={<EpisodePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/societies" element={<SocietiesPage />} />
                <Route path="/societies/:slug" element={<SocietyPage />} />
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
                  <Route path="/admin/events" element={<AdminEventsPage />} />
                  <Route path="/admin/podcast" element={<AdminPodcastPage />} />
                  <Route path="/admin/podcast/:id" element={<AdminPodcastEditorPage />} />
                  <Route path="/admin/events/:id" element={<AdminEventEditorPage />} />
                  <Route path="/admin/societies" element={<AdminSocietiesPage />} />
                  <Route path="/admin/societies/:id" element={<AdminSocietyEditorPage />} />
                  <Route path="/admin/activities" element={<AdminActivitiesPage />} />
                  <Route path="/admin/activities/:id" element={<AdminActivityEditorPage />} />
                </Route>
                <Route element={<RequireAuth admin />}>
                  <Route path="/admin/members" element={<AdminMembersPage />} />
                  <Route path="/admin/site" element={<AdminSitePage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        </SiteProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
