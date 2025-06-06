import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    IconCollection,
    IconLogout,
    IconMapPin,
    IconRupee,
    IconUsers,
} from "../../constants.tsx";
import { useAuth } from "../../contexts/AuthContext";

const menuItems = [
  {
    key: "/realestate/post-plots",
    icon: <IconMapPin className="w-5 h-5" />,
    label: "Post Plots",
  },
  {
    key: "/realestate/leads",
    icon: <IconUsers className="w-5 h-5" />,
    label: "Plot Inquiries & Leads",
  },
  {
    key: "/realestate/commission",
    icon: <IconRupee className="w-5 h-5" />,
    label: "Commission Dashboard",
  },
  {
    key: "/realestate/lead-management",
    icon: <IconCollection className="w-5 h-5" />,
    label: "Lead Management",
  },
];

const RealEstateAgentPanel: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded shadow-md"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Open sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {/* Sidebar as drawer on mobile, static on desktop */}
      <aside
        className={`
          fixed z-40 top-0 left-0 h-full w-64 bg-white text-black flex flex-col p-4 space-y-2 border-r border-neutral-200
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:w-64 md:flex
        `}
        style={{ minWidth: "16rem" }}
      >
        <div className="text-2xl font-bold text-primary-light py-4 px-2 mb-4 border-b border-neutral-200">
          RealEstate<span className="text-black"> Agent</span>
        </div>
        <nav className="flex-grow space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.key}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm transition-colors duration-150 rounded-md
                ${isActive ? "bg-primary text-white font-semibold shadow-md" : "text-black hover:bg-primary hover:text-white"}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3 w-5 h-5">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm text-black hover:bg-red-600 hover:text-white transition-colors duration-150 rounded-md"
          >
            <IconLogout className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="flex-1 p-4 md:p-8 bg-neutral-100 min-w-0">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RealEstateAgentPanel;
