import React, { useState, useEffect } from 'react';
import { Bill } from '../types';
import Spinner from './Spinner';
import { CreditCardIcon } from './icons';

interface PaymentPageProps {
  bill: Bill;
  onPaymentSuccess: (billId: string) => void;
  onCancel: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ bill, onPaymentSuccess, onCancel }) => {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  const [errors, setErrors] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { number, name, expiry, cvc } = cardDetails;
    const noErrors = Object.values(errors).every(e => e === '');
    const allFieldsFilled = number && name && expiry && cvc;
    // Update form validity check to match formatted input
    if (noErrors && allFieldsFilled) {
        const isCardNumberValid = cardDetails.number.replace(/\s/g, '').length === 16;
        const isExpiryValid = cardDetails.expiry.length === 5;
        const isCvcValid = /^\d{3,4}$/.test(cardDetails.cvc);
        setIsFormValid(isCardNumberValid && isExpiryValid && isCvcValid && !!cardDetails.name.trim());
    } else {
        setIsFormValid(false);
    }
  }, [cardDetails, errors]);


  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'number':
        if (!/^\d{16}$/.test(value.replace(/\s/g, ''))) error = 'Card number must be 16 digits.';
        break;
      case 'name':
        if (value.trim().length < 2) error = 'Name is required.';
        break;
      case 'expiry':
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
            error = 'Format must be MM/YY.';
        } else {
            const [month, year] = value.split('/');
            // A card is valid through the last day of its expiration month.
            const lastDayOfExpiryMonth = new Date(2000 + parseInt(year, 10), parseInt(month, 10), 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Compare dates only, ignoring time
             if (lastDayOfExpiryMonth < today) {
                error = 'Card is expired.';
             }
        }
        break;
      case 'cvc':
        if (!/^\d{3,4}$/.test(value)) error = 'CVC must be 3 or 4 digits.';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === 'number') {
      const digitsOnly = value.replace(/\D/g, '');
      // Add spaces every 4 digits, max 19 chars (16 digits + 3 spaces)
      value = digitsOnly.match(/.{1,4}/g)?.join(' ').slice(0, 19) || '';
    }

    if (name === 'expiry') {
      let digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 2) {
        // Automatically add '/' after the month
        value = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
      } else {
        value = digitsOnly;
      }
    }
    
    setCardDetails(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      onPaymentSuccess(bill.id);
    }, 2500);
  };

  if (!bill) {
    return (
        <div className="container mx-auto p-8 text-center">
            <h2 className="text-2xl font-bold text-danger">Error</h2>
            <p className="text-secondary">No bill selected for payment.</p>
            <button onClick={onCancel} className="mt-4 bg-primary text-white font-bold py-2 px-4 rounded-lg">
                Back to Dashboard
            </button>
        </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-3xl font-bold text-dark text-center mb-2">Secure Payment</h2>
          <p className="text-secondary text-center mb-6">Complete the payment for your bill from <span className="font-semibold text-dark">{bill.provider}</span>.</p>

          <div className="bg-light rounded-lg p-4 mb-6 border">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Amount to Pay</span>
              <span className="text-3xl font-bold text-primary">€{bill.amount.toFixed(2)}</span>
            </div>
            <div className="text-sm text-secondary mt-1">Invoice #: {bill.invoiceNumber}</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-secondary mb-1">Card Number</label>
              <input type="text" id="number" name="number" value={cardDetails.number} onChange={handleInputChange} placeholder="0000 0000 0000 0000" maxLength={19} className={`w-full p-3 border rounded-lg ${errors.number ? 'border-red-500' : 'border-gray-300'}`} disabled={isProcessing} />
              {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary mb-1">Cardholder Name</label>
              <input type="text" id="name" name="name" value={cardDetails.name} onChange={handleInputChange} placeholder="e.g., Jane Doe" className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`} disabled={isProcessing} />
               {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-secondary mb-1">Expiry Date</label>
                <input type="text" id="expiry" name="expiry" value={cardDetails.expiry} onChange={handleInputChange} placeholder="MM/YY" maxLength={5} className={`w-full p-3 border rounded-lg ${errors.expiry ? 'border-red-500' : 'border-gray-300'}`} disabled={isProcessing}/>
                {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-secondary mb-1">CVC</label>
                <input type="text" id="cvc" name="cvc" value={cardDetails.cvc} onChange={handleInputChange} placeholder="123" maxLength={4} className={`w-full p-3 border rounded-lg ${errors.cvc ? 'border-red-500' : 'border-gray-300'}`} disabled={isProcessing}/>
                 {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
              </div>
            </div>

            {isProcessing && (
                 <div className="text-center p-4 border-2 border-dashed rounded-lg">
                    <Spinner text="Processing payment securely..." />
                 </div>
            )}

            {!isProcessing && (
                <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
                    <button type="submit" disabled={!isFormValid || isProcessing} className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        <CreditCardIcon className="w-5 h-5"/>
                        Confirm Payment
                    </button>
                    <button type="button" onClick={onCancel} className="w-full bg-gray-200 text-secondary font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                        Cancel
                    </button>
                </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
