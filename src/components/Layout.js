import React from "react";
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="d-flex">
      <Sidebar /> {/* ✅ Sidebar fixo */}
      <div className="p-2 w-100">
        <Outlet /> {/* ✅ Renderiza as páginas aqui */}
      </div>
    </div>
  );
}

export default Layout;
