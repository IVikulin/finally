export type Transaction = {
  id: string;
  date: string;
  amount: number;
  masked_account_number: string;
  transaction_type: 'CREDIT' | 'DEBIT';
  note: string;
};


export type Account = {
  id: string;
  name: string;
  balance: number;
};
