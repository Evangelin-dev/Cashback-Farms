
import React from 'react';
import { MaterialDetail } from '../types';
import Card from './Card';

interface MaterialsInfoCardProps {
  materials: MaterialDetail[];
}

const MaterialsInfoCard: React.FC<MaterialsInfoCardProps> = ({ materials }) => {
  return (
    <Card title="Construction Materials Overview" className="h-full flex flex-col">
      <div className="flex-grow space-y-4">
        {materials.map((material) => (
          <div key={material.id} className="p-3 bg-neutral-50 rounded-lg shadow-sm border border-neutral-200 flex items-start space-x-3">
            {material.imageUrl && (
              <img 
                src={material.imageUrl} 
                alt={material.name} 
                className="w-20 h-20 object-cover rounded-md flex-shrink-0" 
              />
            )}
            <div className="flex-grow">
              <h5 className="font-semibold text-neutral-800">{material.name}</h5>
              <p className="text-xs text-neutral-500 leading-snug mt-0.5 mb-1">{material.description}</p>
              <p className="text-xs text-neutral-500">
                <span className="font-medium text-neutral-600">Standard:</span> {material.qualityStandard}
                {material.supplier && (<span className="ml-2"><span className="font-medium text-neutral-600">Supplier:</span> {material.supplier}</span>)}
              </p>
            </div>
          </div>
        ))}
        {materials.length === 0 && <p className="text-neutral-500">No material information available.</p>}
      </div>
    </Card>
  );
};

export default MaterialsInfoCard;
    