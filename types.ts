
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  NOTE = 'NOTE'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  note: string;
  tags: string[];
  date: string;
  time: string;
  location?: string;
  paymentMethod?: string;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}

export type Screen = 'HOME' | 'EDIT' | 'TAGS' | 'ANALYTICS' | 'SETTINGS' | 'HISTORY';
