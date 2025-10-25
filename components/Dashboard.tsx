
import React, { useState, useRef } from 'react';
import { Bill, ExtractedBillData } from '../types';
import { analyzeBillImage } from '../services/geminiService';
import BillCard from './BillCard';
import Spinner from './Spinner';
import ThinkingMode from './ThinkingMode';
import { UploadIcon, SparklesIcon, ExclamationCircleIcon, DocumentTextIcon } from './icons';

interface DashboardProps {
    bills: Bill[];
    onAddBill: (billData: ExtractedBillData, imageUrl: string) => void;
    onInitiatePayment: (billId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ bills, onAddBill, onInitiatePayment }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [inputMode, setInputMode] = useState<'image' | 'manual'>('image');
    const [manualData, setManualData] = useState({ provider: '', amount: '', dueDate: '', invoiceNumber: '' });
    const [manualError, setManualError] = useState('');


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

    const handleAnalyzeClick = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        setError(null);
        try {
            const extractedData: ExtractedBillData = await analyzeBillImage(selectedFile);
            onAddBill(extractedData, previewUrl!);

            setSelectedFile(null);
            setPreviewUrl(null);
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleManualDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setManualData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { provider, amount, dueDate, invoiceNumber } = manualData;
        if (!provider || !amount || !dueDate || !invoiceNumber) {
            setManualError("All fields are required.");
            return;
        }
        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            setManualError("Please enter a valid positive amount.");
            return;
        }
        
        setManualError('');
        
        const placeholderImageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%236c757d'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z' /%3E%3C/svg%3E%0A";
        
        onAddBill({
            provider,
            amount: amountNumber,
            dueDate,
            invoiceNumber
        }, placeholderImageUrl);
        
        setManualData({ provider: '', amount: '', dueDate: '', invoiceNumber: '' });
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-primary">
                <h2 className="text-2xl font-bold text-dark mb-4">Add a New Bill</h2>
                <div className="flex border-b mb-4">
                    <button
                        onClick={() => setInputMode('image')}
                        className={`flex items-center gap-2 py-2 px-4 text-sm font-medium transition-colors duration-300 ${inputMode === 'image' ? 'border-b-2 border-primary text-primary' : 'text-secondary hover:text-dark'}`}
                    >
                        <UploadIcon className="w-5 h-5" />
                        Upload Image
                    </button>
                    <button
                        onClick={() => setInputMode('manual')}
                        className={`flex items-center gap-2 py-2 px-4 text-sm font-medium transition-colors duration-300 ${inputMode === 'manual' ? 'border-b-2 border-primary text-primary' : 'text-secondary hover:text-dark'}`}
                    >
                        <DocumentTextIcon className="w-5 h-5" />
                        Enter Manually
                    </button>
                </div>

                {inputMode === 'image' ? (
                    <div>
                        <div className="grid md:grid-cols-2 gap-6 items-center">
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    ref={fileInputRef}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-secondary hover:border-primary hover:text-primary transition-colors duration-300"
                                >
                                    <UploadIcon className="w-8 h-8"/>
                                    <span>{selectedFile ? selectedFile.name : 'Click to select an image'}</span>
                                </button>
                            </div>
                            
                            {previewUrl && (
                                <div className="flex flex-col items-center gap-4">
                                    <img src={previewUrl} alt="Bill preview" className="max-h-40 rounded-lg border shadow-sm" />
                                    <button
                                        onClick={handleAnalyzeClick}
                                        disabled={isLoading}
                                        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:bg-gray-400 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <Spinner size="sm" /> : <SparklesIcon className="w-5 h-5" />}
                                        <span>{isLoading ? 'Analyzing...' : 'Analyze with AI'}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        {error && (
                            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2" role="alert">
                            <ExclamationCircleIcon className="w-5 h-5"/>
                            <span className="font-medium">{error}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="provider" className="block text-sm font-medium text-secondary mb-1">Provider</label>
                                <input type="text" name="provider" value={manualData.provider} onChange={handleManualDataChange} placeholder="e.g., Energy Corp" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"/>
                            </div>
                             <div>
                                <label htmlFor="invoiceNumber" className="block text-sm font-medium text-secondary mb-1">Invoice Number</label>
                                <input type="text" name="invoiceNumber" value={manualData.invoiceNumber} onChange={handleManualDataChange} placeholder="e.g., INV-12345" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"/>
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-secondary mb-1">Amount (€)</label>
                                <input type="number" name="amount" value={manualData.amount} onChange={handleManualDataChange} placeholder="e.g., 75.50" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"/>
                            </div>
                            <div>
                                <label htmlFor="dueDate" className="block text-sm font-medium text-secondary mb-1">Due Date</label>
                                <input type="date" name="dueDate" value={manualData.dueDate} onChange={handleManualDataChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"/>
                            </div>
                        </div>
                        {manualError && (
                            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                                <ExclamationCircleIcon className="w-5 h-5"/>
                                {manualError}
                            </div>
                        )}
                        <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                            Add Bill
                        </button>
                    </form>
                )}
            </div>

            <div>
                <h2 className="text-3xl font-bold text-dark mb-6">My Bills</h2>
                {bills.length > 0 ? (
                    <div className="space-y-6">
                        {bills.map(bill => (
                            <BillCard key={bill.id} bill={bill} onPay={onInitiatePayment} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <p className="text-xl text-secondary">You have no bills yet.</p>
                        <p className="text-gray-500 mt-2">Add a bill to get started!</p>
                    </div>
                )}
            </div>
            
            <ThinkingMode />

        </div>
    );
};

export default Dashboard;
