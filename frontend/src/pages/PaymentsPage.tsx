import React from 'react';
import { TableView } from '@/components/TableView';

export function PaymentsPage() {
  const columns = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'booking', label: 'Booking' },
    { key: 'amount', label: 'Amount', type: 'number' },
    { key: 'payment_method', label: 'Payment Method' },
    { key: 'status', label: 'Status' },
    { key: 'transaction_id', label: 'Transaction ID' },
    { key: 'created_at', label: 'Created At', type: 'date' },
  ];

  return (
    <TableView
      endpoint="/api/payments/"
      title="Payments"
      columns={columns}
    />
  );
} 