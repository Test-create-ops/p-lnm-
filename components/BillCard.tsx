
import React from 'react';
import { Bill, BillStatus } from '../types';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from './icons';

interface BillCardProps {
  bill: Bill;
  onPay: (billId: string) => void;
}

const BillCard: React.FC<BillCardProps> = ({ bill, onPay }) => {
  const statusInfo = {
    [BillStatus.UNPAID]: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-500',
      icon: <ExclamationCircleIcon className="w-5 h-5" />,
      text: 'Unpaid',
    },
    [BillStatus.PROCESSING]: {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-500',
      icon: <ClockIcon className="w-5 h-5" />,
      text: 'Processing',
    },
    [BillStatus.PAID]: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-500',
      icon: <CheckCircleIcon className="w-5 h-5" />,
      text: 'Paid',
    },
  };

  const currentStatus = statusInfo[bill.status];

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 border-l-4 ${currentStatus.borderColor}`}>
      <div className="p-5 flex flex-col md:flex-row gap-4 items-start">
        <img src={bill.imageUrl} alt={`${bill.provider} bill`} className="w-24 h-24 object-cover rounded-md border" />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-dark">{bill.provider}</h3>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${currentStatus.bgColor} ${currentStatus.textColor}`}>
              {currentStatus.icon}
              {currentStatus.text}
            </span>
          </div>
          <p className="text-secondary text-sm">Invoice #: {bill.invoiceNumber}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-secondary">Amount Due</p>
              <p className="text-2xl font-semibold text-primary">€{bill.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-secondary">Due Date</p>
              <p className="text-lg font-medium text-dark">{bill.dueDate}</p>
            </div>
          </div>
        </div>
      </div>
      {bill.status === BillStatus.UNPAID && (
         <div className="bg-gray-50 px-5 py-3">
             <button
                onClick={() => onPay(bill.id)}
                className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Pay with Invoicer PayService
              </button>
         </div>
      )}
    </div>
  );
};

export default BillCard;
