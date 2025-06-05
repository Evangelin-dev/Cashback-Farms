
import React from 'react';
import { Link } from 'react-router-dom';
import { Material } from '../../../../types';
import CardShell from '../../../common/CardShell';
import Button from '../../../common/Button';

interface MaterialCardProps {
  material: Material;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  return (
    <CardShell>
      <img src={material.imageUrl} alt={material.name} className="w-full h-40 object-cover"/>
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-800 mb-1 truncate">{material.name}</h3>
        <p className="text-xs text-gray-500 mb-1">Category: {material.category}</p>
        <p className="text-sm text-green-600 font-bold mb-1">₹{material.price.toLocaleString('en-IN')}</p>
        <p className="text-xs text-gray-500 mb-1">MOQ: {material.moq}</p>
        <p className="text-xs text-gray-500 mb-2">Vendor: {material.vendor}</p>
        <Link to={`/materials/${material.id}`}>
          <Button variant="outline" size="sm" className="w-full">View Details</Button>
        </Link>
      </div>
    </CardShell>
  );
};

export default MaterialCard;
    