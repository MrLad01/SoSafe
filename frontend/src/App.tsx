// import React from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from './Pages/Landing Page/Home';
import 'rsuite/dist/rsuite-no-reset.min.css';



function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route index element={<Home />} />
            </Route>
        )
    );

    return (
        <RouterProvider router={router} />
    );
}

export default App;