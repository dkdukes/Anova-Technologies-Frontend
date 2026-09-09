
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";





export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Authentication */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />


                {/* Store */}

                <Route element={<MainLayout />}>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

