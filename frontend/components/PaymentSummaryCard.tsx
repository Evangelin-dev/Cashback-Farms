
import React from 'react';
import { PaymentSummary } from '../types';
import Card from './Card';

interface PaymentSummaryCardProps {
  summary: PaymentSummary;
}

const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({ summary }) => {
  return (
    <Card title="Payment Summary">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-neutral-600 mb-1">
            <span>Total Paid</span>
            <span className="font-semibold text-green-600">₹{summary.totalPaid.toLocaleString()}</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full" 
              style={{ width: `${(summary.totalPaid / (summary.totalPaid + summary.balance)) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Currently Due:</span>
                <span className="font-semibold text-yellow-600">₹{summary.totalDue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Remaining Balance:</span>
                <span className="font-semibold text-neutral-700">₹{summary.balance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2">
                <span className="text-neutral-800">Total Plot Value:</span>
                <span className="text-primary">₹{(summary.totalPaid + summary.balance).toLocaleString()}</span>
            </div>
        </div>
      </div>
    </Card>
  );
};

export default PaymentSummaryCard;
    