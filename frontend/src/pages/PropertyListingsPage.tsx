import React from 'react';
import { TableView } from '@/components/TableView';

export function PropertyListingsPage() {
  const columns = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price', type: 'number' },
    { key: 'location', label: 'Location' },
    { key: 'property_type', label: 'Property Type' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Created At', type: 'date' },
  ];

  return (
    <TableView
      endpoint="/api/property-listings/"
      title="Property Listings"
      columns={columns}
    />
  );
} 