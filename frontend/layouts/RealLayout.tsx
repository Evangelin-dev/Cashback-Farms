// filepath: d:\cashback-farm-plot-manager (3)\layouts\RealLayout.tsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import RealSideNav from "../pages/realestate/components/realsidenav"; // Adjust path if needed
import Header from "../components/Header"; // Adjust path if needed

function getRealEstatePageTitle(pathname: string): string {
  if (pathname === "/realestate/post-plots") return "Post Plots";
  if (pathname === "/realestate/leads") return "Plot Inquiries & Leads";
  if (pathname === "/realestate/commission") return "Commission Dashboard";
  if (pathname === "/realestate/lead-management") return "Lead Management";
  if (pathname === "/realestate/realprofile") return "Agent Profile";
  if(pathname === "/realestate/dashboard") return "Dashboard";
  return "RealEstate Agent Panel";
}

const RealLayout: React.FC = () => {
  const location = useLocation();
  const pageTitle = getRealEstatePageTitle(location.pathname);

  return (
    <div className="flex h-screen bg-neutral-100 font-sans">
      <RealSideNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={pageTitle} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RealLayout;