export type IVerifyAccountPayload = {
  bank_code: string;
  account_number: string;
};

export type IVerifyAccountResponse = {
  accountNumber: string;
  accountName: string;
};

export type ITransferPayload = {
  customer_id: string;
  bank_code: string;
  account_number: string;
  bank_name: string;
  amount: number;
  currency: string;
  narration: string;
  meta_data?: { sender_name: string; sender_address: string }[];
};
