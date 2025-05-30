import React from 'react';
import { MOCK_PROFESSIONALS } from '../../constants';
import ProfessionalCard from '../service/ProfessionalCard';

const commercialServicesList = [
	'Commercial Construction',
	'Office Interiors',
	'Retail Fitouts',
	'Warehouse Solutions',
	'Industrial Projects',
];

const CommercialServices: React.FC = () => {
	const professionals = MOCK_PROFESSIONALS.filter(
		prof =>
			commercialServicesList.includes(prof.service) ||
			commercialServicesList.some(s => prof.specialization?.includes(s))
	);
	return (
		<div className="max-w-6xl mx-auto py-10 px-4">
			<h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
				All Commercial Services
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
				{professionals.map(prof => (
					<ProfessionalCard key={prof.id} professional={prof} />
				))}
			</div>
		</div>
	);
};

export default CommercialServices;
