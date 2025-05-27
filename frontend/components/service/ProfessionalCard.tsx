
import React from 'react';
import { Link } from 'react-router-dom';
import { Professional } from '../../types';
import CardShell from '../common/CardShell';
import Button from '../common/Button';

interface ProfessionalCardProps {
  professional: Professional;
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.959a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.959c.3.921-.755 1.688-1.54 1.118l-3.368-2.446a1 1 0 00-1.175 0l-3.368 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.959a1 1 0 00-.364-1.118L2.07 9.386c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
  </svg>
);


const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  return (
    <CardShell>
      <img src={professional.imageUrl} alt={professional.name} className="w-full h-48 object-cover"/>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{professional.name}</h3>
        <p className="text-sm text-green-600 font-medium mb-1">{professional.service}</p>
        <p className="text-xs text-gray-500 mb-2">{professional.specialization}</p>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.round(professional.rating)} />)}
          <span className="ml-1 text-xs text-gray-600">({professional.rating.toFixed(1)})</span>
        </div>
        <p className="text-sm text-gray-700 font-semibold mb-3">{professional.rate}</p>
        <Link to={`/services/${professional.id}`}>
          <Button variant="outline" className="w-full">View Profile</Button>
        </Link>
      </div>
    </CardShell>
  );
};

export default ProfessionalCard;
    