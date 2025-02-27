import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./private/Dashboard/Dashboard";
import LicencasMap from "./private/Licencas/LicencasMap";
import Layout from "./components/Layout";
import ObrasMap from "./private/Obras/ObrasMap";

function Router() {
    return (
        <Routes>
            {/* Todas as rotas agora passam pelo Layout */}
            <Route element={<Layout />}>
                <Route path="/" element={<LicencasMap />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/licencas" element={<LicencasMap />} />
                <Route path="/obras" element={<ObrasMap />} />
            </Route>
        </Routes>
    );
}

export default Router;
