import { Button, Card, message, Modal, Table, Tooltip } from "antd";
import React, { useState, useEffect } from "react";
import apiClient from "../../../src/utils/api/apiClient";

// Define the interface for the customer data
interface Customer {
	id: number;
	key: number;
	name: string;
	email: string;
	phone: string;
	status: "Active" | "Inactive" | "Pending";
	city: string;
	message: string;
}

const CustomersManager: React.FC = () => {
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [loading, setLoading] = useState(true);
	const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
	const [selectedMessage, setSelectedMessage] = useState("");

	const fetchCustomers = async () => {
		setLoading(true);
		try {
			const response = await apiClient.get('/b2b/customers/');
			const transformedData = response.map((c: any) => ({
				id: c.id,
				key: c.id,
				name: c.name,
				email: c.email,
				phone: c.phone,
				city: c.city,
				message: c.message,
				status: c.status.charAt(0).toUpperCase() + c.status.slice(1), 
			})).sort((a: Customer, b: Customer) => b.id - a.id);
			setCustomers(transformedData);
		} catch (error) {
			message.error("Failed to load customers.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	const handleToggleStatus = async (customerToToggle: Customer) => {
		const originalStatus = customerToToggle.status;
		let newStatus: "Active" | "Inactive";
		
		if (originalStatus === "Active") {
			newStatus = "Inactive";
		} else {
			// This covers both "Pending" and "Inactive" cases
			newStatus = "Active";
		}

		// Optimistic UI update
		setCustomers(prev =>
			prev.map(customer =>
				customer.key === customerToToggle.key ? { ...customer, status: newStatus } : customer
			)
		);

		try {
			// FIX: Removed the redundant /api/ prefix from the endpoint
			await apiClient.patch(`/b2b/customer/${customerToToggle.id}/toggle-status/`);
			message.success("Customer status updated successfully!");
		} catch (error) {
			message.error("Failed to update status. Reverting change.");
			// Revert UI on failure
			setCustomers(prev =>
				prev.map(customer =>
					customer.key === customerToToggle.key ? { ...customer, status: originalStatus } : customer
				)
			);
		}
	};
	
	const showMessageModal = (text: string) => {
		setSelectedMessage(text);
		setIsMessageModalVisible(true);
	};
	
	const handleCloseMessageModal = () => {
		setIsMessageModalVisible(false);
		setSelectedMessage("");
	};

	const columns = [
		{ title: "Name", dataIndex: "name", render: (name: string) => <span className="font-semibold text-primary text-xs">{name}</span> },
		{ title: "Email", dataIndex: "email", responsive: ['md'], render: (email: string) => <span className="text-blue-700 font-medium text-xs">{email}</span> },
		{ title: "Phone", dataIndex: "phone", render: (phone: string) => <span className="text-green-700 font-semibold text-xs">{phone}</span> },
		{ title: "City", dataIndex: "city", responsive: ['lg'], render: (city: string) => <span className="text-gray-700 text-xs">{city}</span> },
		{ 
			title: "Message", 
			dataIndex: "message",
			render: (text: string) => (
				<div className="flex items-center justify-between">
					<span className="truncate max-w-[120px] text-xs text-gray-600">{text || "No message"}</span>
					{text && (
						<Tooltip title="View Full Message">
							<Button size="sm" variant="ghost" className="!p-1" onClick={() => showMessageModal(text)}>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
							</Button>
						</Tooltip>
					)}
				</div>
			) 
		},
		{
			title: "Status", dataIndex: "status",
			render: (status: Customer['status']) => {
				const statusStyles = {
					Active: "bg-green-100 text-green-700 border-green-300",
					Inactive: "bg-red-100 text-red-700 border-red-300",
					Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
				};
				return (
					<span className={`px-2 py-0.5 rounded text-xs font-semibold shadow-sm ${statusStyles[status]}`}>
						{status}
					</span>
				);
			},
		},
		{
			title: "Action",
			render: (_: any, record: Customer) => {
				const isCurrentlyActive = record.status === "Active";
				return (
					<Button
						variant={isCurrentlyActive ? "outline" : "primary"}
						size="sm"
						className={`transition-colors duration-150 rounded-full px-2 py-0.5 text-xs ${
							isCurrentlyActive
								? "border-primary text-primary hover:bg-primary hover:text-white"
								: "bg-primary text-white border-primary hover:bg-primary-dark"
						}`}
						onClick={() => handleToggleStatus(record)}
					>
						{isCurrentlyActive ? "Set Inactive" : "Set Active"}
					</Button>
				)
			},
		},
	];

	return (
		<>
			<Card
				title={
					<div className="flex items-center gap-2">
						<span className="rounded-full bg-gradient-to-br from-blue-400 to-green-400 p-1">
							<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 12a4 4 0 110-8 4 4 0 010 8z" /></svg>
						</span>
						<span className="text-base font-bold text-primary-light">Customers</span>
					</div>
				}
				style={{ marginBottom: 16, borderRadius: 14, boxShadow: "0 2px 8px #60a5fa22", background: "linear-gradient(135deg, #f0f9ff 0%, #f9fafb 100%)", border: "none" }}
				styles={{ body: { background: "transparent", padding: "16px" } }}
			>
				<Table
					dataSource={customers}
					columns={columns}
					loading={loading}
					pagination={false}
					rowClassName="hover:bg-blue-50 transition"
					bordered={false}
					size="small"
					className="rounded-lg shadow"
					rowKey="key"
				/>
				<style>{`
					.ant-card-head { background: linear-gradient(90deg,#f0f9ff 60%,#bae6fd 100%); border-radius: 14px 14px 0 0; }
					.ant-table-thead > tr > th { background: #f0f9ff; font-weight: 700; font-size: 13px; }
					.ant-table-tbody > tr > td { font-size: 13px; }
				`}</style>
			</Card>

			<Modal
				title="Full Message"
				open={isMessageModalVisible}
				onCancel={handleCloseMessageModal}
				footer={[<Button key="close" variant="primary" onClick={handleCloseMessageModal}>Close</Button>]}
			>
				<p className="py-4 text-gray-700">{selectedMessage || "No message content."}</p>
			</Modal>
		</>
	);
};

export default CustomersManager;