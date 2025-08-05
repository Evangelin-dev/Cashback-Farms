import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../src/utils/api/apiClient';
import { message } from 'antd';

const PAGE_SIZE = 5;

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  user_type: 'b2b_vendor' | 'real_estate_agent' | 'client';
}

interface KYCDocument {
  id: number;
  document_type: string;
  file: string;
  status: 'pending' | 'approved' | 'rejected' | 'submitted';
  upload_date: string;
  user: User;
}

interface KYCSectionProps {
  title: string;
  data: KYCDocument[];
  onStatusChange: (id: number, status: string) => void;
  filter: { status: string; search: string };
  setFilter: React.Dispatch<React.SetStateAction<{ status: string; search: string }>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

function getFileExtension(filename: string) {
  return filename.split('.').pop()?.toLowerCase();
}

function KYCSection({ title, data, onStatusChange, filter, setFilter, page, setPage }: KYCSectionProps) {
  const [docPopup, setDocPopup] = useState<null | { fileUrl: string; name: string; docType: string }>(null);

  const filtered = data.filter(doc =>
    (!filter.status || doc.status === filter.status) &&
    (!filter.search ||
      `${doc.user.first_name} ${doc.user.last_name}`.toLowerCase().includes(filter.search.toLowerCase()) ||
      doc.user.email.toLowerCase().includes(filter.search.toLowerCase()))
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
            onChange={e => {
              setFilter(f => ({ ...f, search: e.target.value }));
              setPage(1);
            }}
          />
          <select
            className="border border-green-200 rounded px-2 py-1 text-sm"
            value={filter.status}
            onChange={e => {
              setFilter(f => ({ ...f, status: e.target.value }));
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="submitted">Submitted</option>
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
              <th className="px-3 py-2 border-b text-left">Document Type</th>
              <th className="px-3 py-2 border-b text-left">Document File</th>
              <th className="px-3 py-2 border-b text-left">Status</th>
              <th className="px-3 py-2 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">No records found for this filter.</td>
              </tr>
            ) : paginated.map((doc) => (
              <tr key={doc.id} className="hover:bg-green-50">
                <td className="px-3 py-2 border-b">{`${doc.user.first_name} ${doc.user.last_name}`}</td>
                <td className="px-3 py-2 border-b">{doc.user.email}</td>
                <td className="px-3 py-2 border-b">{doc.user.mobile_number}</td>
                <td className="px-3 py-2 border-b capitalize">{doc.document_type.replace('_', ' ')}</td>
                <td className="px-3 py-2 border-b">
                  <button
                    className="text-xs text-blue-600 underline hover:text-blue-800"
                    onClick={() => setDocPopup({ fileUrl: doc.file, name: `${doc.user.first_name} ${doc.user.last_name}`, docType: doc.document_type })}
                    type="button"
                  >
                    View Document
                  </button>
                </td>
                <td className="px-3 py-2 border-b capitalize font-semibold text-green-700">{doc.status}</td>
                <td className="px-3 py-2 border-b">
                  <select
                    className="border border-green-200 rounded px-2 py-1 text-xs"
                    value={doc.status}
                    onChange={e => onStatusChange(doc.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                    <option value="submitted">Submitted</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-3 py-1 rounded bg-green-100 text-green-700 font-semibold border border-green-200 disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >Previous</button>
        <span className="text-green-700 font-bold">Page {page} of {totalPages || 1}</span>
        <button
          className="px-3 py-1 rounded bg-green-100 text-green-700 font-semibold border border-green-200 disabled:opacity-50"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
        >Next</button>
      </div>

      {docPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-[90vw] relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold" onClick={() => setDocPopup(null)} type="button">×</button>
            <h3 className="text-lg font-bold text-green-700 mb-2 capitalize">{docPopup.docType.replace('_', ' ')} Document</h3>
            <div className="mb-2 text-sm text-gray-700 font-semibold">{docPopup.name}</div>
            <div className="flex flex-col items-center justify-center">
              {(() => {
                const fileExt = getFileExtension(docPopup.fileUrl);
                const fullUrl = docPopup.fileUrl.startsWith('http')
                  ? docPopup.fileUrl
                  : `${apiClient.defaults.baseURL.replace('/api', '')}${docPopup.fileUrl}`;

                if (['pdf', 'doc', 'docx'].includes(fileExt || '')) {
                  return (
                    <iframe
                      src={fullUrl}
                      title="Document Preview"
                      className="w-[300px] h-[500px] border border-green-200 rounded"
                    />
                  );
                } else if (['jpg', 'jpeg', 'png'].includes(fileExt || '')) {
                  return (
                    <img
                      src={fullUrl}
                      alt={docPopup.docType}
                      className="max-w-xs max-h-96 rounded shadow border border-green-100"
                    />
                  );
                } else {
                  return <p className="text-sm text-gray-500">Preview not supported for this file type.</p>;
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ManageKYC: React.FC = () => {
  const [allDocuments, setAllDocuments] = useState<KYCDocument[]>([]);
  const [b2bFilter, setB2BFilter] = useState({ status: '', search: '' });
  const [b2bPage, setB2BPage] = useState(1);
  const [agentFilter, setAgentFilter] = useState({ status: '', search: '' });
  const [agentPage, setAgentPage] = useState(1);

  const fetchKycDocuments = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await apiClient.get(`/admin/kyc-documents/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAllDocuments(response.documents || []);
    } catch (error) {
      console.error("Failed to fetch KYC documents:", error);
      message.error("Could not load KYC data.");
    }
  }, []);

  useEffect(() => {
    fetchKycDocuments();
  }, [fetchKycDocuments]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      await apiClient.put('/user/kyc/update/', { id, status }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      message.success("KYC status updated successfully.");
      fetchKycDocuments();
    } catch (error) {
      console.error("Failed to update KYC status:", error);
      message.error("Failed to update status.");
    }
  };

  const b2bDocuments = allDocuments.filter(doc => doc.user.user_type === 'b2b_vendor');
  const agentDocuments = allDocuments.filter(doc => doc.user.user_type === 'real_estate_agent');

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-green-50 py-6 px-1 sm:px-4 md:px-8 lg:px-0">
      <div className="w-full max-w-6xl flex flex-col flex-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-green-700 mb-8 text-center md:text-left">Manage KYC</h1>
        <KYCSection
          title="B2B Vendor KYC"
          data={b2bDocuments}
          onStatusChange={handleStatusChange}
          filter={b2bFilter}
          setFilter={setB2BFilter}
          page={b2bPage}
          setPage={setB2BPage}
        />
        <KYCSection
          title="Real Estate Agent KYC"
          data={agentDocuments}
          onStatusChange={handleStatusChange}
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
