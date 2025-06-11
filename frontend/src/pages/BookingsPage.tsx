import React from 'react';
import { TableView } from '@/components/TableView';

export function BookingsPage() {
  const columns = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'property', label: 'Property' },
    { key: 'user', label: 'User' },
    { key: 'check_in', label: 'Check In', type: 'date' },
    { key: 'check_out', label: 'Check Out', type: 'date' },
    { key: 'total_price', label: 'Total Price', type: 'number' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Created At', type: 'date' },
  ];

  return (
    <TableView
      endpoint="/api/bookings/"
      title="Bookings"
      columns={columns}
    />
  );
} 