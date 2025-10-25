
export enum BillStatus {
  UNPAID = 'UNPAID',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
}

export interface Bill {
  id: string;
  provider: string;
  amount: number;
  dueDate: string;
  status: BillStatus;
  invoiceNumber: string;
  imageUrl: string;
}

export interface ExtractedBillData {
    provider: string;
    amount: number;
    dueDate: string;
    invoiceNumber: string;
}
