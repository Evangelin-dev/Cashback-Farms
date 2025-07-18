import React, { useState } from 'react';

// Dummy data for demonstration
const initialB2B = Array.from({ length: 17 }, (_, i) => ({
  id: i + 1,
  name: `B2B Vendor ${i + 1}`,
  email: `b2b${i + 1}@example.com`,
  phone: `98765432${(10 + i).toString().padStart(2, '0')}`,
  aadhar: `1234-5678-9${i.toString().padStart(2, '0')}`,
  pan: `ABCDE${(1000 + i)}`,
  gst: `22AAAAA0000A1Z${i}`,
  status: 'pending',
}));
const initialAgents = Array.from({ length: 13 }, (_, i) => ({
  id: i + 1,
  name: `Agent ${i + 1}`,
  email: `agent${i + 1}@example.com`,
  phone: `91234567${(20 + i).toString().padStart(2, '0')}`,
  aadhar: `4321-8765-0${i.toString().padStart(2, '0')}`,
  pan: `XYZAB${(2000 + i)}`,
  status: 'pending',
}));

const PAGE_SIZE = 5;

interface KYCRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  aadhar?: string;
  pan?: string;
  gst?: string;
  status: string;
}

interface KYCSectionProps {
  title: string;
  data: KYCRow[];
  fields: string[];
  onStatusChange: (id: number, status: string) => void;
  filter: { status: string; search: string };
  setFilter: React.Dispatch<React.SetStateAction<{ status: string; search: string }>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

function KYCSection({ title, data, fields, onStatusChange, filter, setFilter, page, setPage }: KYCSectionProps) {
  const [docPopup, setDocPopup] = useState<null | { type: 'aadhar' | 'pan'; value: string; name: string }>(null);
  // Filtered and paginated data
  const filtered = data.filter((row: KYCRow) =>
    (!filter.status || row.status === filter.status) &&
    (!filter.search || row.name.toLowerCase().includes(filter.search.toLowerCase()) || row.email.toLowerCase().includes(filter.search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-lg font-bold text-green-700">{title}</h2>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border border-green-200 rounded px-2 py-1 text-sm"
            value={filter.search}
            onChange={e => setFilter((f: { status: string; search: string }) => ({ ...f, search: e.target.value }))}
          />
          <select
            className="border border-green-200 rounded px-2 py-1 text-sm"
            value={filter.status}
            onChange={e => setFilter((f: { status: string; search: string }) => ({ ...f, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-green-100 rounded-xl">
          <thead>
            <tr className="bg-green-50">
              <th className="px-3 py-2 border-b text-left">Name</th>
              <th className="px-3 py-2 border-b text-left">Email</th>
              <th className="px-3 py-2 border-b text-left">Phone</th>
              {fields.includes('aadhar') && <th className="px-3 py-2 border-b text-left">Aadhar</th>}
              {fields.includes('pan') && <th className="px-3 py-2 border-b text-left">PAN</th>}
              {fields.includes('gst') && <th className="px-3 py-2 border-b text-left">GST</th>}
              <th className="px-3 py-2 border-b text-left">Status</th>
              <th className="px-3 py-2 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={fields.length + 5} className="text-center py-6 text-gray-400">No records found.</td></tr>
            ) : paginated.map((row: KYCRow) => (
              <tr key={row.id} className="hover:bg-green-50">
                <td className="px-3 py-2 border-b">{row.name}</td>
                <td className="px-3 py-2 border-b">{row.email}</td>
                <td className="px-3 py-2 border-b">{row.phone}</td>
                {fields.includes('aadhar') && (
                  <td className="px-3 py-2 border-b">
                    <button
                      className="text-xs text-blue-600 underline hover:text-blue-800"
                      onClick={() => setDocPopup({ type: 'aadhar', value: row.aadhar || '', name: row.name })}
                      type="button"
                    >
                      View
                    </button>
                  </td>
                )}
                {fields.includes('pan') && (
                  <td className="px-3 py-2 border-b">
                    <button
                      className="text-xs text-blue-600 underline hover:text-blue-800"
                      onClick={() => setDocPopup({ type: 'pan', value: row.pan || '', name: row.name })}
                      type="button"
                    >
                      View
                    </button>
                  </td>
                )}
                {fields.includes('gst') && <td className="px-3 py-2 border-b">{row.gst}</td>}
                <td className="px-3 py-2 border-b capitalize font-semibold text-green-700">{row.status}</td>
                <td className="px-3 py-2 border-b">
                  <select
                    className="border border-green-200 rounded px-2 py-1 text-xs"
                    value={row.status}
                    onChange={e => onStatusChange(row.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-3 py-1 rounded bg-green-100 text-green-700 font-semibold border border-green-200 disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >Previous</button>
        <span className="text-green-700 font-bold">Page {page} of {totalPages}</span>
        <button
          className="px-3 py-1 rounded bg-green-100 text-green-700 font-semibold border border-green-200 disabled:opacity-50"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >Next</button>
      </div>
    {/* Document popup */}
    {docPopup && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-[90vw] relative animate-fade-in">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
            onClick={() => setDocPopup(null)}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
          <h3 className="text-lg font-bold text-green-700 mb-2">{docPopup.type === 'aadhar' ? 'Aadhar' : 'PAN'} Document</h3>
          <div className="mb-2 text-sm text-gray-700 font-semibold">{docPopup.name}</div>
          <div className="flex flex-col items-center justify-center">
            {docPopup.value && (docPopup.value.startsWith('http') || docPopup.value.startsWith('/')) ? (
              <img
                src={docPopup.value}
                alt={docPopup.type === 'aadhar' ? 'Aadhar Document' : 'PAN Document'}
                className="max-w-xs max-h-96 rounded shadow border border-green-100"
              />
            ) : docPopup.value && docPopup.value.startsWith('data:image') ? (
              <img
                src={docPopup.value}
                alt={docPopup.type === 'aadhar' ? 'Aadhar Document' : 'PAN Document'}
                className="max-w-xs max-h-96 rounded shadow border border-green-100"
              />
            ) : (
              <span className="text-base text-gray-500 italic">No image available</span>
            )}
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

const ManageKYC: React.FC = () => {
  // State for B2B
  const [b2b, setB2B] = useState(initialB2B);
  const [b2bFilter, setB2BFilter] = useState({ status: '', search: '' });
  const [b2bPage, setB2BPage] = useState(1);
  // State for Agents
  const [agents, setAgents] = useState(initialAgents);
  const [agentFilter, setAgentFilter] = useState({ status: '', search: '' });
  const [agentPage, setAgentPage] = useState(1);

  // Status change handlers
  const handleB2BStatus = (id: number, status: string) => {
    setB2B((list) => list.map((row) => row.id === id ? { ...row, status } : row));
  };
  const handleAgentStatus = (id: number, status: string) => {
    setAgents((list) => list.map((row) => row.id === id ? { ...row, status } : row));
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-green-50 py-6 px-1 sm:px-4 md:px-8 lg:px-0">
      <div className="w-full max-w-6xl flex flex-col flex-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-green-700 mb-8 text-center md:text-left">Manage KYC</h1>
        <KYCSection
          title="B2B Vendor KYC"
          data={b2b}
          fields={['aadhar', 'pan', 'gst']}
          onStatusChange={handleB2BStatus}
          filter={b2bFilter}
          setFilter={setB2BFilter}
          page={b2bPage}
          setPage={setB2BPage}
        />
        <KYCSection
          title="Real Estate Agent KYC"
          data={agents}
          fields={['aadhar', 'pan']}
          onStatusChange={handleAgentStatus}
          filter={agentFilter}
          setFilter={setAgentFilter}
          page={agentPage}
          setPage={setAgentPage}
        />
      </div>
    </div>
  );
};

export default ManageKYC;
