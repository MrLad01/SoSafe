// import React from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from './Pages/Landing Page/Home';
import 'rsuite/dist/rsuite-no-reset.min.css';
import NewsDetail from "./components/NewsDetail";



function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route index element={<Home />} />
                <Route path="/news/:slug" element={<NewsDetail />} />
            </Route>
        )
    );

    return (
        <RouterProvider router={router} />
    );
}

export default App;