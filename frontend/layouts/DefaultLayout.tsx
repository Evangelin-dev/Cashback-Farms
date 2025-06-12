import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/landingpage/landingpagecomponents/layout/Navbar";
import { Layout } from "antd";

const { Footer } = Layout;

const DefaultLayout: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    
    <div className="flex flex-col min-h-screen bg-neutral-100 font-sans">
  
      <main className="flex-grow">
        <Navbar onAuthClick={() => setShowModal(true)} />
        <Outlet />
      </main>
      
      <Footer style={{ textAlign: "center" }}>
        {/* Your footer content here */}
        ©2025 Green Heap
      </Footer>
    </div>
  );
};

export default DefaultLayout;
