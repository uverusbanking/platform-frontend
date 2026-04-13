// ============================================================================
// Global API Types
// ============================================================================

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  errors: any[];
}

// ============================================================================
// Auth Module Types
// ============================================================================

export interface RegisterDto {
  email: string;
  password: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  first_name: string;
  last_name: string;
  bvn: string;
}

export interface LoginDto {
  email: string;
  password?: string;
  encrypted_password?: string;
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  pin_set?: boolean;
  customerId?: string;
}

export interface AuthResponseDto {
  access_token: string;
  refresh_token: string;
  session_id: string;
  two_factor_required?: boolean;
  user: {
    id: string;
    email: string;
    organisation_id: string;
  };
}

export interface Verify2FACodeDto {
  session_id: string;
  code: string;
}

export interface SendOtpDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface CompleteRegistrationDto {
  email: string;
  code: string;
}

export interface ResendOtpDto {
  email: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
}

export interface MessageResponseDto {
  message: string;
}

// ============================================================================
// User Module Types
// ============================================================================

export interface UserResponseDto {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  bvn?: string;
  is_kyc_verified?: boolean;
  kyc_level: number;
  bank_code?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  balance?: string;
  status?: string;
  pin_set?: boolean;
  customer_id?: string;
  customerId?: string;
  // Support for legacy camelCase mappings
  firstName?: string;
  lastName?: string;
  accountNumber?: string;
  bankName?: string;
}

export interface UpdateProfileDto {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
  gender?: string;
  date_of_birth?: string;
}

export interface KycStatusResponseDto {
  isVerified: boolean;
  bvn: boolean;
  tier?: string;
}

// ============================================================================
// KYC Module Types
// ============================================================================

export interface ValidateBvnDto {
  bvn: string;
  phone_number: string;
  date_of_birth: string;
}

export interface ValidateBvnResponseDto {
  message: string;
  valid: boolean;
  details?: any;
}

export interface SubmitKycDto {
  address: string;
  dateOfBirth: string;
  gender: string;
}

export interface SubmitKycResponseDto {
  message: string;
}

export interface DocumentUploadResponseDto {
  message: string;
  url: string;
}

// ============================================================================
// Wallet Module Types
// ============================================================================

export interface WalletBalanceResponseDto {
  ledger: number;
  available: number;
  currency: string;
}

export interface VirtualAccountResponseDto {
  account_number: string;
  account_name: string;
  bank_name: string;
}

// ============================================================================
// Security Module Types
// ============================================================================

export interface PinResponseDto {
  status: string;
  message?: string;
  data?: {
    pin_set: boolean;
  };
}

export interface VerifyPinDto {
  pin: string;
}

export interface SetPinDto {
  pin: string;
}

export interface ChangePinDto {
  old_pin: string;
  new_pin: string;
}

export interface ResetPinDto {
  otp: string;
  new_pin: string;
}

// ============================================================================
// Transfer Module Types
// ============================================================================

export interface BankListResponseDto {
  bank_code: string;
  bank_name: string;
  logo?: string;
}

export interface BankListInterface {
  status: string;
  message: string;
  data: BankListResponseDto[];
  errors: any[];
  meta: any;
  timestamp: string;
}

export interface ResolveAccountDto {
  bank_code: string;
  account_number: string;
}

export interface ResolveAccountResponseDto {
  account_number: string;
  account_name: string;
}

export interface InitiateTransferDto {
  bank_code: string;
  account_number: string;
  account_name: string;
  amount: number;
  narrative?: string;
  pin: string;
  bank_name: string;
}

export interface TransferResponseDto {
  status: string;
  message: string;
  reference: string;
}

export interface TransactionResponseDto {
  id: string;
  amount: number;
  type: string;
  status: string;
  reference: string;
  date: string;
  description?: string;
}

export interface TransactionRecipientDto {
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
}

export interface TransactionDetailsResponseDto {
  id: string;
  reference: string;
  type: string;
  amount: string;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
  recipient?: TransactionRecipientDto;
}

export interface TransactionsResponseDto {
  status: string;
  message: string;
  data: TransactionDetailsResponseDto[];
  errors: any;
  meta: {
    pagination: {
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
    };
  };
  timestamp: string;
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface SingleTransactionResponseDto {
  status: string;
  message: string;
  data: TransactionDetailsResponseDto;
  errors: any[];
  meta: any;
  timestamp: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
