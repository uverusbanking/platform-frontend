export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "returned_for_correction";

export type RegistrationPath = "self_registration" | "rm_initiated";

export type Industry =
  | "banking"
  | "oil_and_gas"
  | "telecom"
  | "manufacturing"
  | "agriculture"
  | "retail"
  | "technology"
  | "real_estate"
  | "healthcare"
  | "education"
  | "other";

export type BusinessType =
  | "limited_liability"
  | "public_limited"
  | "partnership"
  | "sole_proprietorship"
  | "ngo_non_profit"
  | "government_agency";

export type DocumentType =
  | "cac_certificate"
  | "memart"
  | "board_resolution"
  | "tax_clearance"
  | "scuml_certificate"
  | "proof_of_address"
  | "form_cac2_cac7";

export type DocumentStatus = "not_uploaded" | "uploaded" | "verified" | "rejected";

export type DirectorRole = "director" | "signatory" | "director_and_signatory";

export type IDType =
  | "international_passport"
  | "national_id_nin"
  | "drivers_license"
  | "voters_card";

export type VerificationStatus =
  | "not_sent"
  | "email_sent"
  | "link_opened"
  | "verified"
  | "failed"
  | "expired";

export type AccountType = "current" | "domiciliary" | "collection" | "escrow";
export type Currency = "NGN" | "USD" | "GBP" | "EUR";
export type SigningRule = "any_one" | "any_two" | "all" | "custom";
export type RiskClassification = "low" | "medium" | "high";
export type FeedbackTargetType = "field" | "document" | "director" | "section";
export type FeedbackSeverity = "required_fix" | "advisory";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  force_password_change: boolean;
  onboarding_completed: boolean;
  registration_path: RegistrationPath;
  created_at: string;
  role: import("@/types/roles").CorporateRole;
}

export interface CompanyInfo {
  company_name: string;
  rc_number: string;
  tin: string;
  date_of_incorporation: string;
  industry: Industry;
  business_type: BusinessType;
  registered_address: string;
  city: string;
  state: string;
  country: string;
  postal_code?: string;
  phone_number: string;
  email: string;
  website?: string;
}

export interface KYCDocument {
  id: string;
  document_type: DocumentType;
  file_name: string;
  file_size: number;
  mime_type: string;
  status: DocumentStatus;
  required: boolean;
  max_size_mb: number;
  allowed_types: string[];
  uploaded_at: string | null;
  rejection_comment: string | null;
}

export interface DirectorInput {
  full_name: string;
  role: DirectorRole;
  date_of_birth: string;
  nationality: string;
  bvn: string;
  phone_number: string;
  email: string;
  residential_address: string;
  id_type: IDType;
  id_number: string;
  id_expiry_date: string;
}

export interface Director extends DirectorInput {
  id: string;
  verification_status: VerificationStatus;
  verification_sent_at: string | null;
  verification_completed_at: string | null;
  id_document_uploaded: boolean;
  passport_photo_uploaded: boolean;
  signature_uploaded: boolean;
  created_at: string;
}

export interface AccountConfig {
  account_type: AccountType;
  primary_currency: Currency;
  additional_currencies: Currency[];
  daily_transaction_limit: number;
  per_transaction_limit: number;
  required_signatories: number;
  signing_rule: SigningRule;
  custom_signing_rule_description?: string;
  approval_threshold?: number;
  sms_alert_phone?: string;
  email_alert_address?: string;
}

export interface RiskScore {
  total_score: number;
  classification: RiskClassification;
  breakdown: { criteria: string; score: number; triggered: boolean }[];
}

export interface FeedbackItem {
  id: string;
  target_type: FeedbackTargetType;
  target_id: string;
  target_label: string;
  comment: string;
  severity: FeedbackSeverity;
  resolved: boolean;
  created_at: string;
  created_by: string;
}

export interface TimelineEvent {
  id: string;
  event_type: string;
  description: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface StepsCompleted {
  company_info: boolean;
  documents: boolean;
  directors: boolean;
  account_config: boolean;
  review: boolean;
}

export interface ApplicationSummary {
  id: string;
  company_name: string;
  status: ApplicationStatus;
  risk_classification: RiskClassification | null;
  current_step: number;
  steps_completed: StepsCompleted;
  director_verification_summary: {
    total: number;
    verified: number;
    pending: number;
    failed: number;
  };
  feedback_count: number;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
}

export interface Application {
  id: string;
  status: ApplicationStatus;
  registration_path: RegistrationPath;
  current_step: number;
  steps_completed: StepsCompleted;
  company_info: CompanyInfo | null;
  documents: KYCDocument[];
  directors: Director[];
  account_config: AccountConfig | null;
  risk_score: RiskScore | null;
  feedback: FeedbackItem[];
  timeline: TimelineEvent[];
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
}

export interface DashboardSummary {
  total_applications: number;
  by_status: Record<ApplicationStatus, number>;
  recent_activity: TimelineEvent[];
}

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;

export const INDUSTRY_LABELS: Record<Industry, string> = {
  banking: "Banking",
  oil_and_gas: "Oil & Gas",
  telecom: "Telecom",
  manufacturing: "Manufacturing",
  agriculture: "Agriculture",
  retail: "Retail",
  technology: "Technology",
  real_estate: "Real Estate",
  healthcare: "Healthcare",
  education: "Education",
  other: "Other",
};

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  limited_liability: "Limited Liability",
  public_limited: "Public Limited",
  partnership: "Partnership",
  sole_proprietorship: "Sole Proprietorship",
  ngo_non_profit: "NGO / Non-Profit",
  government_agency: "Government Agency",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  cac_certificate: "CAC Certificate",
  memart: "MEMART",
  board_resolution: "Board Resolution",
  tax_clearance: "Tax Clearance Certificate",
  scuml_certificate: "SCUML Certificate",
  proof_of_address: "Proof of Business Address",
  form_cac2_cac7: "Form CAC 2 / CAC 7",
};

export const DIRECTOR_ROLE_LABELS: Record<DirectorRole, string> = {
  director: "Director",
  signatory: "Signatory",
  director_and_signatory: "Director & Signatory",
};

export const ID_TYPE_LABELS: Record<IDType, string> = {
  international_passport: "International Passport",
  national_id_nin: "National ID (NIN)",
  drivers_license: "Driver's License",
  voters_card: "Voter's Card",
};

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  current: "Current Account",
  domiciliary: "Domiciliary Account",
  collection: "Collection Account",
  escrow: "Escrow Account",
};

export const SIGNING_RULE_LABELS: Record<SigningRule, string> = {
  any_one: "Any One",
  any_two: "Any Two",
  all: "All",
  custom: "Custom Combination",
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  returned_for_correction: "Returned for Correction",
};
