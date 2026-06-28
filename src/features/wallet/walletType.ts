export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';

export interface WalletTransactionDTO {
  id: number;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  customOrderId: number | null;
}

export interface WithdrawalRequestDTO {
  id: number;
  userId: number;
  username: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: WithdrawalStatus;
  note: string | null;
  reviewedBy: number | null;
  reviewerName: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WalletState {
  balance: number;
  currency: string;
  transactions: WalletTransactionDTO[];
  withdrawals: WithdrawalRequestDTO[];
  adminWithdrawals: WithdrawalRequestDTO[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;
  totalPages: number;
  totalElements: number;
  currentPage: number;
}
