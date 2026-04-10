// ============================================================================
// Auth Module Types
// ============================================================================

export interface RegisterDto {
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
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
}

export interface AuthResponseDto {
  accessToken: string;
  user: UserDto;
  session_id?: string;
  twoFactorRequired?: boolean;
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
  firstName: string;
  lastName: string;
  bvn?: string;
  isKycVerified: boolean;
  bankCode?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  balance?: string;
  holdBalance?: string;
  customerId?: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
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
  status?: boolean;
  message: string;
}

export interface VerifyPinDto {
  pin: string;
}

export interface SetPinDto {
  pin: string;
}

export interface ChangePinDto {
  oldPin: string;
  newPin: string;
}

export interface ResetPinDto {
  otp: string;
  newPin: string;
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
  bankCode: string;
  accountNumber: string;
}

export interface ResolveAccountResponseDto {
  accountNumber: string;
  accountName: string;
}

export interface InitiateTransferDto {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  narrative?: string;
  pin: string;
  bankName: string;
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
