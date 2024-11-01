// import React from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from './Pages/Landing Page/Home';
import 'rsuite/dist/rsuite-no-reset.min.css';
import NewsDetail from "./components/NewsDetail";
import PersonAlertDetail from "./components/PersonAlertDetail";



function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route index element={<Home />} />
                <Route path="/announcement/:slug" element={<NewsDetail />} />
                <Route path="/news/:slug" element={<NewsDetail />} />
                <Route path="/missing/:person" element={<PersonAlertDetail />} />
                <Route path="/wanted/:person" element={<PersonAlertDetail />} />
            </Route>
        )
    );

    return (
        <RouterProvider router={router} />
    );
}

export default App;