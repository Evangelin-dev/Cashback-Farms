import { Card, Table } from "antd";
import React, { useState } from "react";
import Button from "../../../components/common/Button";

const initialCustomers = [
	{
		key: 1,
		name: "Amit Sharma",
		email: "amit.sharma@example.com",
		phone: "+91-9876543210",
		status: "Active",
		city: "Delhi",
		plotsBought: 2,
	},
	{
		key: 2,
		name: "Priya Verma",
		email: "priya.verma@example.com",
		phone: "+91-9123456789",
		status: "Inactive",
		city: "Bangalore",
		plotsBought: 1,
	},
	{
		key: 3,
		name: "Rahul Singh",
		email: "rahul.singh@example.com",
		phone: "+91-9988776655",
		status: "Active",
		city: "Hyderabad",
		plotsBought: 3,
	},
];

const CustomersManager: React.FC = () => {
	const [customers, setCustomers] = useState(initialCustomers);

	const handleToggleStatus = (key: number) => {
		setCustomers((prev) =>
			prev.map((customer) =>
				customer.key === key
					? { ...customer, status: customer.status === "Active" ? "Inactive" : "Active" }
					: customer
			)
		);
	};

	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			render: (name: string) => (
				<span className="font-semibold text-primary text-xs">{name}</span>
			),
		},
		{
			title: "Email",
			dataIndex: "email",
			render: (email: string) => (
				<span className="text-blue-700 font-medium text-xs">{email}</span>
			),
		},
		{
			title: "Phone",
			dataIndex: "phone",
			render: (phone: string) => (
				<span className="text-green-700 font-semibold text-xs">{phone}</span>
			),
		},
		{
			title: "City",
			dataIndex: "city",
			render: (city: string) => (
				<span className="text-gray-700 text-xs">{city}</span>
			),
		},
		{
			title: "Plots",
			dataIndex: "plotsBought",
			render: (plots: number) => (
				<span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-xs">{plots}</span>
			),
		},
		{
			title: "Status",
			dataIndex: "status",
			render: (_: any, record: any) => (
				<span
					className={`px-2 py-0.5 rounded text-xs font-semibold shadow-sm ${
						record.status === "Active"
							? "bg-green-100 text-green-700 border border-green-300"
							: "bg-red-100 text-red-700 border border-red-300"
					}`}
				>
					{record.status}
				</span>
			),
		},
		{
			title: "Action",
			render: (_: any, record: any) => (
				<Button
					variant={record.status === "Inactive" ? "primary" : "outline"}
					size="sm"
					className={`transition-colors duration-150 rounded-full px-2 py-0.5 text-xs ${
						record.status === "Inactive"
							? "bg-primary text-white border-primary hover:bg-primary-dark"
							: "border-primary text-primary hover:bg-primary hover:text-white"
					}`}
					onClick={() => handleToggleStatus(record.key)}
				>
					{record.status === "Inactive" ? "Set Active" : "Set Inactive"}
				</Button>
			),
		},
	];

	return (
		<Card
			title={
				<div className="flex items-center gap-2">
					<span className="rounded-full bg-gradient-to-br from-blue-400 to-green-400 p-1">
						<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
							<circle cx="12" cy="12" r="10" />
							<path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" />
						</svg>
					</span>
					<span className="text-base font-bold text-primary-light">Customers</span>
				</div>
			}
			style={{
				marginBottom: 16,
				borderRadius: 14,
				boxShadow: "0 2px 8px #60a5fa22",
				background: "linear-gradient(135deg, #f0f9ff 0%, #f9fafb 100%)",
				border: "none",
			}}
			bodyStyle={{ background: "transparent", padding: 16 }}
		>
			<Table
				dataSource={customers}
				columns={columns}
				pagination={false}
				rowClassName="hover:bg-blue-50 transition"
				bordered={false}
				size="small"
				className="rounded-lg shadow"
			/>
			<style>{`
				.ant-card-head {
					background: linear-gradient(90deg,#f0f9ff 60%,#bae6fd 100%);
					border-radius: 14px 14px 0 0;
				}
				.ant-table-thead > tr > th {
					background: #f0f9ff;
					font-weight: 700;
					font-size: 13px;
				}
				.ant-table-tbody > tr > td {
					font-size: 13px;
				}
			`}</style>
		</Card>
	);
};

export default CustomersManager;
