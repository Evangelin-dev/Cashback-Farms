import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/defaultlandingpage/defaultlandingcomponents/layout/Navbar";


import DefaultFooter from "../components/defaultlandingpage/defaultlandingcomponents/layout/Footer";

const DefaultLayout: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    
    <div className="flex flex-col min-h-screen bg-neutral-100 font-sans">
  
      <main className="flex-grow">
        <Navbar onAuthClick={() => setShowModal(true)} />
        <Outlet />
      </main>
      
     
      <DefaultFooter/>
    </div>
  );
};

export default DefaultLayout;
