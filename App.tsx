
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PaymentPage from './components/PaymentPage';
import { LogoutIcon } from './components/icons';
import { Bill, BillStatus, ExtractedBillData } from './types';

type Page = 'dashboard' | 'payment';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState<Page>('dashboard');
  const [bills, setBills] = useState<Bill[]>([]);
  const [activeBill, setActiveBill] = useState<Bill | null>(null);


  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setBills([]);
    setPage('dashboard');
    setActiveBill(null);
  };

  const addBill = (billData: ExtractedBillData, imageUrl: string) => {
    const newBill: Bill = {
        ...billData,
        id: `bill_${Date.now()}`,
        status: BillStatus.UNPAID,
        imageUrl: imageUrl,
    };
    setBills(prevBills => [newBill, ...prevBills]);
  };

  const handleInitiatePayment = (billId: string) => {
    const billToPay = bills.find(b => b.id === billId);
    if (billToPay) {
      setActiveBill(billToPay);
      setPage('payment');
    }
  };

  const handlePaymentSuccess = (billId: string) => {
    setBills(currentBills => currentBills.map(b => 
        b.id === billId ? { ...b, status: BillStatus.PAID } : b
    ));
    setPage('dashboard');
    setActiveBill(null);
  };
  
  const handleCancelPayment = () => {
    setPage('dashboard');
    setActiveBill(null);
  }

  const renderContent = () => {
    if (!isLoggedIn) {
      return <LoginPage onLogin={handleLogin} />;
    }
    
    switch (page) {
      case 'payment':
        return <PaymentPage 
                    bill={activeBill!} 
                    onPaymentSuccess={handlePaymentSuccess}
                    onCancel={handleCancelPayment}
                />;
      case 'dashboard':
      default:
        return <Dashboard 
                    bills={bills} 
                    onAddBill={addBill} 
                    onInitiatePayment={handleInitiatePayment} 
                />;
    }
  };

  return (
    <div className="min-h-screen bg-light">
      {isLoggedIn && (
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Invoicer</h1>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
              title="Logout"
            >
              <span className="hidden sm:inline">Logout</span>
              <LogoutIcon className="w-6 h-6" />
            </button>
          </div>
        </header>
      )}
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
