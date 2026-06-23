import { useEffect } from 'react';   // ← was missing
import {
  Route, RouterProvider, createBrowserRouter,
  createRoutesFromElements, useLocation, Outlet, Navigate,
} from "react-router-dom";
import { AgencyPage, ContactPage, ManagementTeamPage } from "./Pages/AboutPage";
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReactNode } from 'react';
import { usePostHog } from 'posthog-js/react';
import AdminAgency from "./Pages/AdminAgency";
import AdminContact from "./Pages/AdminContact";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminDatabase from "./Pages/AdminDatabase";
import AdminDepartments from "./Pages/AdminDepartments";
import AdminManagement from "./Pages/AdminManagement";
import AdminNews from "./Pages/AdminNews";
import AdminPersonnel from "./Pages/AdminPersonnel";
import AdminTracking from "./Pages/AdminTracking";
import ZoneAreaDivisionTable from "./Pages/ZonesPage";
import DepartmentsPage from "./Pages/DepartmentsPage";
import Home from './Pages/Landing Page/Home';
import NewsDetail from "./components/NewsDetail";
import NewsPage from "./Pages/NewsPage";
import OfficerDashboard from "./Pages/Officer Page/OfficerDashboard";
import OfficerLoginPage from "./Pages/OfficerLoginPage";
import PersonAlertDetail from "./components/PersonAlertDetail";
import PersonnelPage from "./Pages/PersonnelPage";
import SuperAdminRegistration from "./Pages/SuperAdmin Page/SuperAdminRegistration";
import UnderConstructionPage from "./Pages/UnderConstructionPage";
import AssignUser from "./Pages/AssignUser";
import 'rsuite/dist/rsuite-no-reset.min.css';
import BiometricsPage from './Pages/BiometricsPage';

// ── Tracks page views on every route change ──────────────────────────────────
function PageViewTracker() {
  const location = useLocation()
  const posthog = usePostHog()

  useEffect(() => {
    posthog?.capture('$pageview', {
      $current_url: window.location.href,
    })
  }, [location.pathname])

  return null
}

// ── Root layout: renders PageViewTracker once for the whole app ───────────────
function RootLayout() {
  return (
    <>
      <PageViewTracker />
      <Outlet />
    </>
  )
}

// ── Auth guard ────────────────────────────────────────────────────────────────
interface ProtectedRouteProps { children: ReactNode }

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-green-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const RedirectRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  useEffect(() => {
    window.location.replace("https://sosafecorps.og.gov.ng/");
  }, []);

  // Render children (or a loading state) while the redirect happens
  return <>{children}</>;
};

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      // RootLayout wraps everything so PageViewTracker fires on every navigation
      <Route element={<RootLayout />}>

        {/* Public routes */}
        {/* <Route index element={<Home />} />
          <Route path="/about/agency"      element={<AgencyPage />} />
          <Route path="/about/contact"     element={<ContactPage />} />
          <Route path="/about/management"  element={<ManagementTeamPage />} />
          <Route path="/announcement/:slug" element={<NewsDetail />} />
          <Route path="/departments"       element={<DepartmentsPage />} />
          <Route path="/missing/:person"   element={<PersonAlertDetail />} />
          <Route path="/news"              element={<NewsPage />} />
          <Route path="/news/:slug"        element={<NewsDetail />} />
          <Route path="/wanted/:person"    element={<PersonAlertDetail />} />
          <Route path="/login"             element={<OfficerLoginPage />} />
          <Route path="/personnel"         element={<PersonnelPage />} />
          <Route path="/under-construction" element={<UnderConstructionPage />} /> */}

        <Route index element={<RedirectRoute><Home /></RedirectRoute>} />
        <Route path="/about/agency" element={<RedirectRoute><AgencyPage /></RedirectRoute>} />
        <Route path="/about/contact" element={<RedirectRoute><ContactPage /></RedirectRoute>} />
        <Route path="/about/management" element={<RedirectRoute><ManagementTeamPage /></RedirectRoute>} />
        <Route path="/announcement/:slug" element={<RedirectRoute><NewsDetail /></RedirectRoute>} />
        <Route path="/departments" element={<RedirectRoute><DepartmentsPage /></RedirectRoute>} />
        <Route path="/missing/:person" element={<RedirectRoute><PersonAlertDetail /></RedirectRoute>} />
        <Route path="/news" element={<RedirectRoute><NewsPage /></RedirectRoute>} />
        <Route path="/news/:slug" element={<RedirectRoute><NewsDetail /></RedirectRoute>} />
        <Route path="/wanted/:person" element={<RedirectRoute><PersonAlertDetail /></RedirectRoute>} />
        <Route path="/login" element={<OfficerLoginPage />} />
        <Route path="/personnel" element={<RedirectRoute><PersonnelPage /></RedirectRoute>} />
        <Route path="/under-construction" element={<RedirectRoute><UnderConstructionPage /></RedirectRoute>} />

        {/* Protected admin routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/agency" element={<ProtectedRoute><AdminAgency /></ProtectedRoute>} />
        <Route path="/admin/contact" element={<ProtectedRoute><AdminContact /></ProtectedRoute>} />
        <Route path="/admin/database" element={<ProtectedRoute><AdminDatabase /></ProtectedRoute>} />
        <Route path="/admin/zones" element={<ProtectedRoute><ZoneAreaDivisionTable /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute><AdminDepartments /></ProtectedRoute>} />
        <Route path="/admin/management-team" element={<ProtectedRoute><AdminManagement /></ProtectedRoute>} />
        <Route path="/admin/news" element={<ProtectedRoute><AdminNews /></ProtectedRoute>} />
        <Route path="/admin/personnel" element={<ProtectedRoute><AdminPersonnel /></ProtectedRoute>} />
        <Route path="/admin/biometrics" element={<ProtectedRoute><BiometricsPage /></ProtectedRoute>} />
        <Route path="/admin/assign-user" element={<ProtectedRoute><AssignUser /></ProtectedRoute>} />
        <Route path="/admin/tracking" element={<ProtectedRoute><AdminTracking /></ProtectedRoute>} />

        {/* Protected officer routes */}
        <Route path="/officer/:name" element={<OfficerDashboard />} />

        {/* Super admin */}
        <Route path="/so-admin" element={<SuperAdminRegistration />} />

      </Route>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App; 