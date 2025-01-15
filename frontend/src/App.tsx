// import React from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { AgencyPage, ContactPage, ManagementTeamPage } from "./Pages/AboutPage";
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
import 'rsuite/dist/rsuite-no-reset.min.css';



function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
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

                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/agency" element={<AdminAgency />} />
                <Route path="/admin/contact" element={<AdminContact />} />
                <Route path="/admin/database" element={<AdminDatabase />} />
                <Route path="/admin/departments" element={<AdminDepartments />} />
                <Route path="/admin/management-team" element={<AdminManagement />} />
                <Route path="/admin/news" element={<AdminNews />} />
                <Route path="/admin/personnel" element={<AdminPersonnel />} />
                <Route path="/admin/tracking" element={<AdminTracking />} />

                <Route path="/officer/name" element={<OfficerDashboard />} />
                
                <Route path="/under-construction" element={<UnderConstructionPage />} />

                <Route path="/so-admin" element={<SuperAdminRegistration />} />

            </Route>
        )
    );

    return (
        <RouterProvider router={router} />
    );
}

export default App;