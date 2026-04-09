export interface IWallet {
  id: string;
  name: string;
  customer_id: string;
  environment: "LIVE" | "TEST";
  account_type: "CHECKING" | "SAVINGS";
  currency: "NGN" | string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  account_name: string;
  bank_logo: string | null;
  metadata: WalletMetadata;
  balance: string;
  hold_balance: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  created_at: string; // ISO Date
  updated_at: string; // ISO Date
  closed_at: string | null;
}

export interface WalletMetadata {
  __v: number;
  _id: string;
  bvn: string;
  client: string;
  status: "Active" | "Inactive";
  canDebit: boolean;
  canCredit: boolean;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  isDefault: boolean;
  isDeleted: boolean;
  account_name: string;
  account_number: string;
  accountType: "Savings" | "Checking";
  bookBalance: number;
  currencyCode: string;
  isSubAccount: boolean;
  balance: number;
  bank_name: string;
  accountProduct: string;
  allowOverdraft: boolean;
  overdraftLimit: number;
  chargeStampDuty: boolean;
  chargeValueAddedTax: boolean;
  chargeWithHoldingTax: boolean;
  interestBalance: number;
  interestPostingPeriod: "Monthly" | "Daily";
  interestCalculationType: "DailyBalance";
  interestCompoundingPeriod: "Daily" | "Monthly";
  lockinPeriodFrequency: number;
  lockinPeriodFrequencyType: "Days" | "Months";
  minRequiredOpeningBalance: number;
  nominalAnnualInterestRate: number;
  interestCalculationDaysInYearType: "365" | "360";
  withHoldingTaxBalance: number;
  notificationSettings: NotificationSettings;
  metadata: ProviderMetadata;
}

export interface NotificationSettings {
  smsNotification: boolean;
  emailNotification: boolean;
  smsMonthlyStatement: boolean;
  emailMonthlyStatement: boolean;
}

export interface ProviderMetadata {
  bvn: string;
  BusinessName: string;
  accountNumber: string;
  enable_business_name: string;
  SettlementAccountNumber: string;
}

export interface IGetWalletsParams {
  customer_id?: string;
  environment?: "LIVE" | "SANDBOX";
}
