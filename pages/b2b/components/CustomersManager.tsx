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
		{ title: "Name", dataIndex: "name" },
		{ title: "Email", dataIndex: "email" },
		{ title: "Phone", dataIndex: "phone" },
		{ title: "City", dataIndex: "city" },
		{ title: "Plots Bought", dataIndex: "plotsBought" },
		{
			title: "Status",
			dataIndex: "status",
			render: (_: any, record: any) => (
				<span
					className={`px-2 py-1 rounded text-xs font-semibold ${
						record.status === "Active"
							? "bg-green-100 text-green-700"
							: "bg-red-100 text-red-700"
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
					variant="outline"
					size="sm"
					onClick={() => handleToggleStatus(record.key)}
				>
					Set {record.status === "Inactive" ? "Active" : "Inactive"}
				</Button>
			),
		},
	];

	return (
		<Card
			title="Customers"
			style={{ marginBottom: 24, borderRadius: 8, boxShadow: "0 1px 4px #e5e7eb" }}
			bodyStyle={{ background: "#fff" }}
		>
			<Table dataSource={customers} columns={columns} pagination={false} />
		</Card>
	);
};

export default CustomersManager;
