export type AdjustmentType =
  | "EXTERNAL_DEBIT"
  | "EXTERNAL_CREDIT"
  | "FEE"
  | "CORRECTION"
  | "REVERSAL";

export type CorrectionDirection = "DEBIT" | "CREDIT";

export type FeeType =
  | "PLATFORM_FEE"
  | "SERVICE_CHARGE"
  | "PENALTY"
  | "MAINTENANCE_FEE";

export type ProviderChannel =
  | "BUDPAY"
  | "FLUTTERWAVE"
  | "MONNIFY"
  | "PROVIDUS"
  | "INTERNAL";

export interface IAdjustment {
  id: string;
  reference: string;
  adjustment_type: AdjustmentType;
  direction: "CREDIT" | "DEBIT" | null;
  amount: string | null;
  balance_before: string | null;
  balance_after: string | null;
  narration: string | null;
  effective_at: string | null;
  provider_reference: string | null;
  fee_type: FeeType | null;
  correction_reason: string | null;
  original_reference: string | null;
  initiated_by: string | null;
  created_at: string;
}

export interface IListAdjustmentsResponse {
  data: IAdjustment[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface IAdjustmentResult {
  transaction_id: string;
  reference: string;
  amount?: number;
  direction?: CorrectionDirection;
  reversed_amount?: string;
  reversal_direction?: CorrectionDirection;
  original_reference?: string;
  balance_before: string;
  balance_after: string;
}

export interface IExternalDebitPayload {
  amount: number;
  provider_reference: string;
  effective_at: string;
  narration: string;
  channel: ProviderChannel;
  allow_negative?: boolean;
}

export interface IExternalCreditPayload {
  amount: number;
  provider_reference: string;
  effective_at: string;
  narration: string;
  channel: ProviderChannel;
}

export interface IFeeAdjustmentPayload {
  amount: number;
  fee_type: FeeType;
  narration: string;
  allow_negative?: boolean;
}

export interface IManualCorrectionPayload {
  direction: CorrectionDirection;
  amount: number;
  reason: string;
  narration: string;
  allow_negative?: boolean;
}

export interface IReversalPayload {
  original_reference: string;
  narration: string;
}
