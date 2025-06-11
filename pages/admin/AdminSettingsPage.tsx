import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';

const settings = [
	{
		title: 'General Settings',
		description: 'Manage application-wide preferences, branding, and notifications.',
		icon: (
			<svg
				className="w-8 h-8 text-primary"
				fill="none"
				stroke="currentColor"
				strokeWidth={2.2}
				viewBox="0 0 24 24"
			>
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
				<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
			</svg>
		),
		action: 'general',
	},
	{
		title: 'Admin Users',
		description: 'Add, remove, or update admin users and their roles.',
		icon: (
			<svg
				className="w-8 h-8 text-primary"
				fill="none"
				stroke="currentColor"
				strokeWidth={2.2}
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
		),
		action: 'users',
	},
	{
		title: 'API Keys',
		description: 'Generate and manage API keys for integrations.',
		icon: (
			<svg
				className="w-8 h-8 text-primary"
				fill="none"
				stroke="currentColor"
				strokeWidth={2.2}
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 15v2m0 4v-2m-7-7h2m4-4h2m7 7h-2m-4 4h-2"
				/>
				<circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
			</svg>
		),
		action: 'apikeys',
	},
	{
		title: 'Security',
		description: 'Update password policies, 2FA, and access logs.',
		icon: (
			<svg
				className="w-8 h-8 text-primary"
				fill="none"
				stroke="currentColor"
				strokeWidth={2.2}
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 11V7a4 4 0 10-8 0v4m16 0V7a4 4 0 10-8 0v4m-4 4h16v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6z"
				/>
			</svg>
		),
		action: 'security',
	},
];

const GeneralSettings = () => (
	<div>
		<h2 className="text-xl font-bold mb-2 text-primary">General Settings</h2>
		<div className="mb-4 text-neutral-700">
			Update branding, notifications, and preferences here.
		</div>
		<div className="flex flex-col gap-4">
			<div>
				<label className="block text-sm font-medium mb-1">Brand Name</label>
				<input
					className="border rounded px-3 py-2 w-full"
					placeholder="Cashback Farm"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium mb-1">Support Email</label>
				<input
					className="border rounded px-3 py-2 w-full"
					placeholder="support@cashbackfarm.com"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium mb-1">
					Notification Email
				</label>
				<input
					className="border rounded px-3 py-2 w-full"
					placeholder="notify@cashbackfarm.com"
				/>
			</div>
			<button className="mt-2 px-5 py-2 bg-primary text-white rounded hover:bg-primary-dark transition">
				Save Changes
			</button>
		</div>
	</div>
);

const AdminUsersSettings = () => (
	<div>
		<h2 className="text-xl font-bold mb-2 text-primary">Admin Users</h2>
		<div className="mb-4 text-neutral-700">Manage admin users and their roles.</div>
		<table className="w-full border rounded mb-4">
			<thead>
				<tr className="bg-neutral-100">
					<th className="p-2 text-left">Name</th>
					<th className="p-2 text-left">Email</th>
					<th className="p-2 text-left">Role</th>
					<th className="p-2 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td className="p-2">Admin User</td>
					<td className="p-2">admin@cashbackfarm.com</td>
					<td className="p-2">Super Admin</td>
					<td className="p-2">
						<button className="text-primary hover:underline">Edit</button>
						<button className="ml-2 text-red-500 hover:underline">Remove</button>
					</td>
				</tr>
				<tr>
					<td className="p-2">Support Staff</td>
					<td className="p-2">support@cashbackfarm.com</td>
					<td className="p-2">Support</td>
					<td className="p-2">
						<button className="text-primary hover:underline">Edit</button>
						<button className="ml-2 text-red-500 hover:underline">Remove</button>
					</td>
				</tr>
			</tbody>
		</table>
		<button className="px-5 py-2 bg-primary text-white rounded hover:bg-primary-dark transition">
			Add Admin User
		</button>
	</div>
);

const ApiKeysSettings = () => (
	<div>
		<h2 className="text-xl font-bold mb-2 text-primary">API Keys</h2>
		<div className="mb-4 text-neutral-700">Manage API keys for integrations.</div>
		<div className="flex gap-2 items-center mb-2">
			<input
				className="border rounded px-3 py-2 w-full"
				value="sk_live_1234567890abcdef"
				readOnly
			/>
			<button className="px-3 py-2 bg-primary text-white rounded hover:bg-primary-dark transition">
				Copy
			</button>
			<button className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
				Revoke
			</button>
		</div>
		<button className="mt-2 px-5 py-2 bg-primary text-white rounded hover:bg-primary-dark transition">
			Generate New Key
		</button>
	</div>
);

const SecuritySettings = () => (
	<div>
		<h2 className="text-xl font-bold mb-2 text-primary">Security</h2>
		<div className="mb-4 text-neutral-700">
			Update password policies, enable 2FA, and view access logs.
		</div>
		<div className="mb-4">
			<label className="block text-sm font-medium mb-1">Password Policy</label>
			<select className="border rounded px-3 py-2 w-full">
				<option>Strong (min 8 chars, symbols, numbers)</option>
				<option>Medium (min 6 chars, numbers)</option>
				<option>Weak (min 4 chars)</option>
			</select>
		</div>
		<div className="mb-4">
			<label className="block text-sm font-medium mb-1">
				Two-Factor Authentication (2FA)
			</label>
			<button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition">
				Enable 2FA
			</button>
		</div>
		<div>
			<label className="block text-sm font-medium mb-1">Access Logs</label>
			<div className="bg-neutral-100 rounded p-3 text-xs text-neutral-700 max-h-32 overflow-y-auto">
				<div>2024-06-01 10:00:00 - Admin User logged in</div>
				<div>2024-06-01 09:45:00 - Support Staff changed password</div>
				<div>2024-05-31 18:30:00 - API Key generated</div>
			</div>
		</div>
	</div>
);

const AdminSettingsPage: React.FC = () => {
	const [activeTab, setActiveTab] = React.useState<string | null>(null);
	const navigate = useNavigate();

	const renderSettingsContent = () => {
		switch (activeTab) {
			case 'general':
				return <GeneralSettings />;
			case 'users':
				return <AdminUsersSettings />;
			case 'apikeys':
				return <ApiKeysSettings />;
			case 'security':
				return <SecuritySettings />;
			default:
				return (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{settings.map((setting) => (
							<Card
								key={setting.title}
								className="flex flex-col gap-3 p-6 shadow-lg hover:shadow-xl transition group"
							>
								<div className="flex items-center gap-4">
									<div className="bg-primary/10 rounded-full p-3 group-hover:bg-primary/20 transition">
										{setting.icon}
									</div>
									<div>
										<div className="text-lg font-semibold text-neutral-800">
											{setting.title}
										</div>
										<div className="text-sm text-neutral-500">
											{setting.description}
										</div>
									</div>
								</div>
								<div className="mt-4 flex justify-end">
									<button
										className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
										onClick={() => setActiveTab(setting.action)}
									>
										{setting.title === 'General Settings' && 'Edit'}
										{setting.title === 'Admin Users' && 'Manage'}
										{setting.title === 'API Keys' && 'Configure'}
										{setting.title === 'Security' && 'Security'}
									</button>
								</div>
							</Card>
						))}
					</div>
				);
		}
	};

	return (
		<div className="max-w-4xl mx-auto mt-8">
			<h1 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
				<svg
					className="w-8 h-8 text-primary-light"
					fill="none"
					stroke="currentColor"
					strokeWidth={2.2}
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
					<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
				</svg>
				Admin Settings
				{activeTab && (
					<button
						className="ml-auto px-4 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition"
						onClick={() => setActiveTab(null)}
					>
						Back
					</button>
				)}
			</h1>
			{renderSettingsContent()}
			<div className="mt-10">
				<Card className="p-6 bg-yellow-50 border-l-4 border-yellow-400">
					<div className="flex items-center gap-3">
						<svg
							className="w-6 h-6 text-yellow-500"
							fill="none"
							stroke="currentColor"
							strokeWidth={2.2}
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
							/>
						</svg>
						<span className="text-yellow-700 font-semibold">Note:</span>
						<span className="text-yellow-700">
							Settings changes may affect all users. Please proceed with caution.
						</span>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default AdminSettingsPage;