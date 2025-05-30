import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROFESSIONALS } from '../../constants';
import ProfessionalCard from '../service/ProfessionalCard';

const buyServicesList = [
	'Builder Projects',
	'Construction materials',
	'Property Legal Services',
	'Home Interiors',
	'Plot Maintenance',
];

const BuyServices: React.FC = () => {
	const navigate = useNavigate();
	const professionals = MOCK_PROFESSIONALS.filter(
		prof =>
			buyServicesList.includes(prof.service) ||
			buyServicesList.some(s => prof.specialization?.includes(s))
	);
	return (
		<div className="max-w-6xl mx-auto py-10 px-4">
			<h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
				All Buyer Services
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
				{professionals.map(prof => (
					<div
						key={prof.id}
						className="cursor-pointer"
						onClick={() => navigate('/buy-services')}
					>
						<ProfessionalCard professional={prof} />
					</div>
				))}
			</div>
		</div>
	);
};

export default BuyServices;
