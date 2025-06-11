import React from 'react';
import { MOCK_PROFESSIONALS } from '../../../../constants';
import ProfessionalCard from '../service/ProfessionalCard';

const sellServicesList = [
	'Property Listing',
	'Brokerage Services',
	'Resale Assistance',
	'Land Sale',
	'Commercial Property Sale',
];

const SellServices: React.FC = () => {
	const professionals = MOCK_PROFESSIONALS.filter(
		prof =>
			sellServicesList.includes(prof.service) ||
			sellServicesList.some(s => prof.specialization?.includes(s))
	);
	return (
		<div className="max-w-6xl mx-auto py-10 px-4">
			<h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
				All Sell Services
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
				{professionals.map(prof => (
					<ProfessionalCard key={prof.id} professional={prof} />
				))}
			</div>
		</div>
	);
};

export default SellServices;
