import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../pages/admin/AdminSidebar';
import Header from '../common/Header';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-neutral-100 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle="Admin Panel" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-100 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;