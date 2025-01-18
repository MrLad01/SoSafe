import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { AgencyPage, ContactPage, ManagementTeamPage } from "./Pages/AboutPage";
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReactNode } from 'react';
import AdminAgency from "./Pages/AdminAgency";
import AdminContact from "./Pages/AdminContact";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminDatabase from "./Pages/AdminDatabase";
import AdminDepartments from "./Pages/AdminDepartments";
import AdminManagement from "./Pages/AdminManagement";
import AdminNews from "./Pages/AdminNews";
import AdminPersonnel from "./Pages/AdminPersonnel";
import AdminTracking from "./Pages/AdminTracking";
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
import { Navigate } from "react-router-dom";
import 'rsuite/dist/rsuite-no-reset.min.css';
import AssignUser from "./Pages/AssignUser";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
    const { isAuthenticated, loading } = useAuth();
  
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
  
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                {/* Public routes */}
                <Route index element={<Home />} />
                <Route path="/about/agency" element={<AgencyPage />} />
                <Route path="/about/contact" element={<ContactPage />} />
                <Route path="/about/management" element={<ManagementTeamPage />} />
                <Route path="/announcement/:slug" element={<NewsDetail />} />
                <Route path="/departments" element={<DepartmentsPage />} />
                <Route path="/missing/:person" element={<PersonAlertDetail />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<NewsDetail />} />
                <Route path="/wanted/:person" element={<PersonAlertDetail />} />
                <Route path="/login" element={<OfficerLoginPage />} />
                <Route path="/personnel" element={<PersonnelPage />} />
                <Route path="/under-construction" element={<UnderConstructionPage />} />

                {/* Protected admin routes */}
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/agency" element={<ProtectedRoute><AdminAgency /></ProtectedRoute>} />
                <Route path="/admin/contact" element={<ProtectedRoute><AdminContact /></ProtectedRoute>} />
                <Route path="/admin/database" element={<ProtectedRoute><AdminDatabase /></ProtectedRoute>} />
                <Route path="/admin/departments" element={<ProtectedRoute><AdminDepartments /></ProtectedRoute>} />
                <Route path="/admin/management-team" element={<ProtectedRoute><AdminManagement /></ProtectedRoute>} />
                <Route path="/admin/news" element={<ProtectedRoute><AdminNews /></ProtectedRoute>} />
                <Route path="/admin/personnel" element={<ProtectedRoute><AdminPersonnel /></ProtectedRoute>} />
                <Route path="/admin/assign-user" element={<ProtectedRoute><AssignUser /></ProtectedRoute>} />
                <Route path="/admin/tracking" element={<ProtectedRoute><AdminTracking /></ProtectedRoute>} />

                {/* Protected officer routes */}
                <Route path="/officer/name" element={<ProtectedRoute><OfficerDashboard /></ProtectedRoute>} />

                {/* Protected super admin route */}
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