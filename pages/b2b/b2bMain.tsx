import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    IconCollection,
    IconMapPin,
    IconRupee,
    IconUsers,
    IconWallet,
} from "../../constants.tsx"; // Adjust path if needed
import { useAuth } from "../../contexts/AuthContext";

const menuItems = [
  {
    key: "/b2b/plots",
    icon: <IconMapPin className="w-5 h-5" />,
    label: "Manage Plots",
  },
  {
    key: "/b2b/orders",
    icon: <IconCollection className="w-5 h-5" />,
    label: "Plot Orders",
  },
  {
    key: "/b2b/pricing",
    icon: <IconRupee className="w-5 h-5" />,
    label: "Pricing & Offers",
  },
  {
    key: "/b2b/customers",
    icon: <IconUsers className="w-5 h-5" />,
    label: "Customers",
  },
  {
    key: "/b2b/wallet",
    icon: <IconWallet className="w-5 h-5" />,
    label: "Wallet / Settlement",
  },
];

const B2BMain: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <aside className="w-64 bg-white text-black flex flex-col p-4 space-y-2 border-r border-neutral-200">
        <div className="text-2xl font-bold text-primary-light py-4 px-2 mb-4 border-b border-neutral-200">
          Plot<span className="text-black">Vendor</span>
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
            >
              <span className="mr-3 w-5 h-5">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center w-full px-4 py-3 text-sm text-black rounded-md transition-colors duration-150 hover:bg-red-600 hover:text-red-500"
          style={{ border: "none", background: "none", outline: "none", cursor: "pointer" }}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Logout
        </button>
      </aside>
      <main className="flex-1 p-8 bg-neutral-100">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default B2BMain;
