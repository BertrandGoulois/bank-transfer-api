export interface HistoryMetrics {
  averageAmount: number;
  byType: Record<string, number>;
  byDay: Record<string, number>;
}

export interface HistoryResult {
  message: string;
  metrics: HistoryMetrics;
  transactions: any[];
}

export interface TransferResult {
  message: string;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
}

export interface WithdrawResult {
  message: string;
  accountId: number;
  amount: number;
}

export interface AccountRow {
  id: number;
  userId: number;
  balance: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionRow {
  id: number;
  accountId: number;
  type: string;
  amount: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}