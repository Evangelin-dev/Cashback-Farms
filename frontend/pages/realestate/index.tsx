import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import RealEstateAgentPanel from "./RealEstateAgentPanel";
import CommissionDashboard from "./components/CommissionDashboard";
import LeadManagement from "./components/LeadManagement";
import Leads from "./components/Leads";
import PostPlots from "./components/PostPlots";

const RealEstateRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<RealEstateAgentPanel />}>
      <Route index element={<Navigate to="post-plots" replace />} />
      <Route path="post-plots" element={<PostPlots />} />
      <Route path="leads" element={<Leads />} />
      <Route path="commission" element={<CommissionDashboard />} />
      <Route path="lead-management" element={<LeadManagement />} />
    </Route>
  </Routes>
);

export default RealEstateRoutes;
