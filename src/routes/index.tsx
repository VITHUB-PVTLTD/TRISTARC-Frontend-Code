import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import { PageLoader } from '@/components/common/PageLoader';
import { useAuth } from '@/context/AuthContext';

// -- Public Pages ----------------------------------------------
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const TeamPage = lazy(() => import('@/pages/TeamPage'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage'));
const { CoursesPage, AcademicSkillsPage, ResearchCoursesPage, CourseDetailPage } = {
  CoursesPage: lazy(() => import('@/pages/CoursesPages').then((m) => ({ default: m.CoursesPage }))),
  AcademicSkillsPage: lazy(() => import('@/pages/CoursesPages').then((m) => ({ default: m.AcademicSkillsPage }))),
  ResearchCoursesPage: lazy(() => import('@/pages/CoursesPages').then((m) => ({ default: m.ResearchCoursesPage }))),
  CourseDetailPage: lazy(() => import('@/pages/CoursesPages').then((m) => ({ default: m.CourseDetailPage }))),
};
const EResourcesPage = lazy(() => import('@/pages/EResourcesPage'));
const CareersPage = lazy(() => import('@/pages/CareersPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// -- Dashboard Pages -------------------------------------------
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const UsersPage = lazy(() => import('@/pages/admin/UsersPage'));
const CoursesAdminPage = lazy(() => import('@/pages/admin/CoursesAdminPage'));
const JobsAdminPage = lazy(() => import('@/pages/admin/JobsAdminPage'));
const MessagesPage = lazy(() => import('@/pages/admin/MessagesPage'));
const NotificationsAdminPage = lazy(() => import('@/pages/admin/NotificationsAdminPage'));
const ResourcesAdminPage = lazy(() => import('@/pages/admin/ResourcesAdminPage'));
const TeamAdminPage = lazy(() => import('@/pages/admin/TeamAdminPage'));
const SiteSettingsAdminPage = lazy(() => import('@/pages/admin/SiteSettingsAdminPage'));

// -- Route Guards ----------------------------------------------
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* -- Public Layout — Header + Footer --------------- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/team" element={<TeamPage />} />

        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />

        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/academic-skills" element={<AcademicSkillsPage />} />
        <Route path="/courses/research" element={<ResearchCoursesPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />

        <Route path="/e-resources" element={<EResourcesPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* -- Auth Layout — Minimal centered ---------------- */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* -- Dashboard Layout — Sidebar + Topbar ----------- */}
      <Route element={<DashboardLayout />}>
        {/* Regular user dashboard */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

        {/* Admin overview & management (admin/super_admin/editor only) */}
        <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
        <Route path="/admin/courses" element={<AdminRoute><CoursesAdminPage /></AdminRoute>} />
        <Route path="/admin/jobs" element={<AdminRoute><JobsAdminPage /></AdminRoute>} />
        <Route path="/admin/messages" element={<AdminRoute><MessagesPage /></AdminRoute>} />
        <Route path="/admin/notifications" element={<AdminRoute><NotificationsAdminPage /></AdminRoute>} />
        <Route path="/admin/resources" element={<AdminRoute><ResourcesAdminPage /></AdminRoute>} />
        <Route path="/admin/team" element={<AdminRoute><TeamAdminPage /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><SiteSettingsAdminPage /></AdminRoute>} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;

