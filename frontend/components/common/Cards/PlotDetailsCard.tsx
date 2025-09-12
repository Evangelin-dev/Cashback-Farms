
import React from 'react';
import { PlotInfo } from '../../../types';

interface PlotDetailsCardProps {
  plotInfo: PlotInfo;
}

const DetailItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-neutral-100 last:border-b-0">
    <span className="text-sm text-neutral-500">{label}</span>
    <span className="text-sm font-semibold text-neutral-700">{value}</span>
  </div>
);

const PlotDetailsCard: React.FC<PlotDetailsCardProps> = ({ plotInfo }) => {
  return (
    <div className="space-y-1">
      <DetailItem label="Plot Number" value={plotInfo.plotNo} />
      <DetailItem label="Area (Sq. Ft.)" value={`${plotInfo.sqFt.toLocaleString()} sq. ft.`} />
      <DetailItem label="Rate per Sq. Ft." value={`₹${plotInfo.ratePerSqFt.toLocaleString()}`} />
      <DetailItem label="Total Plot Value" value={`₹${plotInfo.plotValue.toLocaleString()}`} />
    </div>
  );
};

export default PlotDetailsCard;
    