import React from 'react';
import Card from '../../components/Card';

const AdminSettingsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-800 mb-6">Admin Settings</h1>
      <Card>
        <p className="text-neutral-600">Admin panel settings and configuration options will be available here.</p>
        <p className="text-neutral-500 text-sm mt-2">This could include general application settings, admin user management, API key configurations (if applicable), etc.</p>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;