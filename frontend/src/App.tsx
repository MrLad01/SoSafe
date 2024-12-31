// import React from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from './Pages/Landing Page/Home';
import 'rsuite/dist/rsuite-no-reset.min.css';
import NewsDetail from "./components/NewsDetail";
import PersonAlertDetail from "./components/PersonAlertDetail";
import NewsPage from "./Pages/NewsPage";
import { AgencyPage, ContactPage, ManagementTeamPage } from "./Pages/AboutPage";
import DepartmentsPage from "./Pages/DepartmentsPage";
import PersonnelPage from "./Pages/PersonnelPage";
import UnderConstructionPage from "./Pages/UnderConstructionPage";
import OfficerLoginPage from "./Pages/OfficerLoginPage";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminNews from "./Pages/AdminNews";
import AdminAgency from "./Pages/AdminAgency";
import AdminManagement from "./Pages/AdminManagement";
import AdminContact from "./Pages/AdminContact";
import AdminDepartments from "./Pages/AdminDepartments";
import AdminPersonnel from "./Pages/AdminPersonnel";
import OfficerDashboard from "./Pages/Officer Page/OfficerDashboard";
import AdminDatabase from "./Pages/AdminDatabase";



function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route index element={<Home />} />
                <Route path="/announcement/:slug" element={<NewsDetail />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<NewsDetail />} />
                <Route path="/about/agency" element={<AgencyPage />} />
                <Route path="/about/management" element={<ManagementTeamPage />} />
                <Route path="/about/contact" element={<ContactPage />} />
                <Route path="/missing/:person" element={<PersonAlertDetail />} />
                <Route path="/wanted/:person" element={<PersonAlertDetail />} />
                <Route path="/departments" element={<DepartmentsPage />} />
                <Route path="/personnel" element={<PersonnelPage />} />
                <Route path="/login" element={<OfficerLoginPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/news" element={<AdminNews />} />
                <Route path="/admin/agency" element={<AdminAgency />} />
                <Route path="/admin/management-team" element={<AdminManagement />} />
                <Route path="/admin/contact" element={<AdminContact />} />
                <Route path="/admin/departments" element={<AdminDepartments />} />
                <Route path="/admin/personnel" element={<AdminPersonnel />} />
                <Route path="/admin/database" element={<AdminDatabase />} />
                <Route path="/under-construction" element={<UnderConstructionPage />} />
                <Route path="/officer/name" element={<OfficerDashboard />} />
            </Route>
        )
    );

    return (
        <RouterProvider router={router} />
    );
}

export default App;