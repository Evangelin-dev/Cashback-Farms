
import React from 'react';
import { InvestmentDetails } from '../../../types';
import Card from './Card';

interface InvestmentSummaryCardProps {
  investmentDetails: InvestmentDetails;
}

const InvestmentSummaryCard: React.FC<InvestmentSummaryCardProps> = ({ investmentDetails }) => {
  return (
    <Card title="Investment Details">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-neutral-600">Your Investment:</p>
          <p className="text-lg font-semibold text-neutral-800">₹{investmentDetails.yourInvestment.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-neutral-600">Cashback ({investmentDetails.cashbackPercentage}%):</p>
          <p className="text-lg font-semibold text-green-600">- ₹{investmentDetails.cashbackAmount.toLocaleString()}</p>
        </div>
        <hr className="my-2 border-neutral-200" />
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-neutral-800">Net Investment:</p>
          <p className="text-xl font-bold text-primary">₹{investmentDetails.netInvestment.toLocaleString()}</p>
        </div>
      </div>
    </Card>
  );
};

export default InvestmentSummaryCard;
    