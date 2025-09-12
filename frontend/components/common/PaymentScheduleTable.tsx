
import React from 'react';
import { PaymentInstallment, PaymentStatus } from '../../types';
import Card from './Cards/Card';

interface PaymentScheduleTableProps {
  installments: PaymentInstallment[];
}

const getStatusClass = (status: PaymentStatus): string => {
  switch (status) {
    case PaymentStatus.PAID:
      return 'bg-green-100 text-green-700';
    case PaymentStatus.DUE:
      return 'bg-yellow-100 text-yellow-700';
    case PaymentStatus.OVERDUE:
      return 'bg-red-100 text-red-700';
    case PaymentStatus.UPCOMING:
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-neutral-100 text-neutral-700';
  }
};

const PaymentScheduleTable: React.FC<PaymentScheduleTableProps> = ({ installments }) => {
  return (
    <Card title="Payment Schedule">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Payment Schedule</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Due Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount (₹)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {installments.map((installment) => (
              <tr key={installment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{installment.scheduleName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{new Date(installment.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{installment.amount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(installment.status)}`}>
                    {installment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PaymentScheduleTable;
    