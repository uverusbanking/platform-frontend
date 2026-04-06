import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationById } from "@/services/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Building2, Users, Settings, ClipboardCheck, FileUp, Check, ArrowRight, Save, HelpCircle, Info, Shield, Wand2 } from "lucide-react";
import type { CompanyInfo, Director, AccountConfig, KYCDocument } from "@/types/onboarding";

const MOCK_COMPANY_INFO: CompanyInfo = {
  company_name: "Zenith Agro Industries Ltd",
  rc_number: "RC284751",
  tin: "1098765432",
  date_of_incorporation: "2018-03-15",
  industry: "agriculture",
  business_type: "limited_liability",
  registered_address: "42 Marina Road, Victoria Island",
  city: "Lagos",
  state: "Lagos",
  country: "Nigeria",
  phone_number: "+2348012345678",
  email: "info@zenithagro.com.ng",
};

const MOCK_DIRECTORS: Director[] = [
  {
    id: `dir-${Date.now()}-1`,
    full_name: "Adebayo Okonkwo",
    role: "director_and_signatory",
    date_of_birth: "1978-06-12",
    nationality: "Nigerian",
    bvn: "22345678901",
    phone_number: "+2348023456789",
    email: "adebayo@zenithagro.com.ng",
    residential_address: "15 Admiralty Way, Lekki Phase 1, Lagos",
    id_type: "international_passport",
    id_number: "A09876543",
    id_expiry_date: "2028-11-30",
    verification_status: "not_sent",
    verification_sent_at: null,
    verification_completed_at: null,
    id_document_uploaded: false,
    passport_photo_uploaded: false,
    signature_uploaded: false,
    created_at: new Date().toISOString(),
  },
  {
    id: `dir-${Date.now()}-2`,
    full_name: "Ngozi Eze",
    role: "signatory",
    date_of_birth: "1985-01-22",
    nationality: "Nigerian",
    bvn: "33456789012",
    phone_number: "+2348034567890",
    email: "ngozi@zenithagro.com.ng",
    residential_address: "8 Ozumba Mbadiwe Ave, Victoria Island, Lagos",
    id_type: "national_id_nin",
    id_number: "78901234567",
    id_expiry_date: "2029-05-15",
    verification_status: "not_sent",
    verification_sent_at: null,
    verification_completed_at: null,
    id_document_uploaded: false,
    passport_photo_uploaded: false,
    signature_uploaded: false,
    created_at: new Date().toISOString(),
  },
];

const MOCK_ACCOUNT_CONFIG: AccountConfig = {
  account_type: "current",
  primary_currency: "NGN",
  additional_currencies: ["USD"],
  daily_transaction_limit: 50000000,
  per_transaction_limit: 10000000,
  required_signatories: 2,
  signing_rule: "any_two",
  sms_alert_phone: "+2348012345678",
  email_alert_address: "alerts@zenithagro.com.ng",
};
import StepCompanyInfo from "@/components/onboarding/StepCompanyInfo";
import StepDocuments from "@/components/onboarding/StepDocuments";
import StepDirectors from "@/components/onboarding/StepDirectors";
import StepAccountConfig from "@/components/onboarding/StepAccountConfig";
import StepReview from "@/components/onboarding/StepReview";
import type { Application } from "@/types/onboarding";

const STEPS = [
  { label: "Company Info", icon: Building2 },
  { label: "Directors & Signatories", icon: Users },
  { label: "Account Configuration", icon: Settings },
  { label: "Documents", icon: FileUp },
  { label: "Review & Submit", icon: ClipboardCheck },
];

function createBlankApplication(): Application {
  return {
    id: `app-new-${Date.now()}`,
    status: "draft",
    registration_path: "self_registration",
    current_step: 1,
    steps_completed: { company_info: false, documents: false, directors: false, account_config: false, review: false },
    company_info: null,
    documents: [
      { id: "doc-cac_certificate", document_type: "cac_certificate", file_name: "", file_size: 0, mime_type: "", status: "not_uploaded", required: true, max_size_mb: 5, allowed_types: ["pdf", "jpg", "png"], uploaded_at: null, rejection_comment: null },
      { id: "doc-memart", document_type: "memart", file_name: "", file_size: 0, mime_type: "", status: "not_uploaded", required: true, max_size_mb: 10, allowed_types: ["pdf"], uploaded_at: null, rejection_comment: null },
      { id: "doc-board_resolution", document_type: "board_resolution", file_name: "", file_size: 0, mime_type: "", status: "not_uploaded", required: true, max_size_mb: 5, allowed_types: ["pdf"], uploaded_at: null, rejection_comment: null },
      { id: "doc-tax_clearance", document_type: "tax_clearance", file_name: "", file_size: 0, mime_type: "", status: "not_uploaded", required: true, max_size_mb: 5, allowed_types: ["pdf", "jpg", "png"], uploaded_at: null, rejection_comment: null },
      { id: "doc-scuml_certificate", document_type: "scuml_certificate", file_name: "", file_size: 0, mime_type: "", status: "not_uploaded", required: false, max_size_mb: 5, allowed_types: ["pdf", "jpg", "png"], uploaded_at: null, rejection_comment: null },
      { id: "doc-proof_of_address", document_type: "proof_of_address", file_name: "", file_size: 0, mime_type: "", status: "not_uploaded", required: true, max_size_mb: 5, allowed_types: ["pdf", "jpg", "png"], uploaded_at: null, rejection_comment: null },
      { id: "doc-form_cac2_cac7", document_type: "form_cac2_cac7", file_name: "", file_size: 0, mime_type: "", status: "not_uploaded", required: true, max_size_mb: 5, allowed_types: ["pdf"], uploaded_at: null, rejection_comment: null },
    ],
    directors: [],
    account_config: null,
    risk_score: null,
    feedback: [],
    timeline: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    submitted_at: null,
  };
}

export default function OnboardingWizard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const existing = id && id !== "new" ? getApplicationById(id) : null;

  const [application, setApplication] = useState<Application>(existing ?? createBlankApplication());
  const [currentStep, setCurrentStep] = useState(application.current_step);

  const updateApp = (partial: Partial<Application>) => {
    setApplication((prev) => ({ ...prev, ...partial, updated_at: new Date().toISOString() }));
  };

  const fillMockData = () => {
    if (currentStep === 1) {
      handleCompanySave(MOCK_COMPANY_INFO);
    } else if (currentStep === 2) {
      handleDirectorsSave(MOCK_DIRECTORS);
    } else if (currentStep === 3) {
      handleAccountSave(MOCK_ACCOUNT_CONFIG);
    } else if (currentStep === 4) {
      const mockDocs = application.documents.map((doc) => ({
        ...doc,
        file_name: `${doc.document_type}_scan.pdf`,
        file_size: 1024000,
        mime_type: "application/pdf",
        status: "uploaded" as const,
        uploaded_at: new Date().toISOString(),
      }));
      handleDocsSave(mockDocs);
    }
  };

  const handleCompanySave = (data: CompanyInfo) => {
    updateApp({
      company_info: data,
      steps_completed: { ...application.steps_completed, company_info: true },
    });
    setCurrentStep(2);
  };

  const handleDirectorsSave = (directors: Director[]) => {
    updateApp({
      directors,
      steps_completed: { ...application.steps_completed, directors: true },
    });
    setCurrentStep(3);
  };

  const handleAccountSave = (config: AccountConfig) => {
    updateApp({
      account_config: config,
      steps_completed: { ...application.steps_completed, account_config: true },
    });
    setCurrentStep(4);
  };

  const handleDocsSave = (docs: KYCDocument[]) => {
    updateApp({
      documents: docs,
      steps_completed: { ...application.steps_completed, documents: true },
    });
    setCurrentStep(5);
  };

  const handleSubmit = () => {
    updateApp({
      status: "submitted",
      submitted_at: new Date().toISOString(),
      steps_completed: { ...application.steps_completed, review: true },
    });
    navigate("/dashboard");
  };

  const stepCompletionOrder = ["company_info", "directors", "account_config", "documents", "review"] as const;

  const progressPercent = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top header */}
      <header className="h-14 flex items-center justify-between border-b border-surface-high bg-surface-container px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-primary" />
          <span
            className="font-bold text-base text-foreground"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            Uverus Banking
          </span>
        </div>
        <div className="flex items-center gap-3">
          {currentStep < 5 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-dashed border-primary/40 text-primary hover:bg-primary/5"
              onClick={fillMockData}
            >
              <Wand2 className="h-3.5 w-3.5" /> Fill Mock Data
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border text-foreground hover:bg-surface-low"
            onClick={() => navigate("/dashboard")}
          >
            <Save className="h-3.5 w-3.5" /> Save & Exit
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground border-0"
          >
            Continue Application
          </Button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Left sidebar — step navigation */}
        <aside className="w-56 shrink-0 border-r border-surface-high bg-surface-container p-6 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <p
                className="text-xs font-bold tracking-[0.08em] text-primary uppercase"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Onboarding
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Institutional Setup</p>
            </div>

            <nav className="space-y-1">
              {STEPS.map((step, i) => {
                const stepNum = i + 1;
                const completed = application.steps_completed[stepCompletionOrder[i]];
                const active = stepNum === currentStep;
                const Icon = step.icon;
                return (
                  <button
                    key={step.label}
                    onClick={() => {
                      if (completed || active) setCurrentStep(stepNum);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 text-left",
                      active && "bg-primary/10 text-primary font-semibold border-l-2 border-primary",
                      completed && !active && "text-foreground hover:bg-surface-low cursor-pointer",
                      !active && !completed && "text-muted-foreground cursor-default"
                    )}
                  >
                    {completed ? (
                      <Check className="h-4 w-4 text-success shrink-0" />
                    ) : (
                      <Icon className="h-4 w-4 shrink-0" />
                    )}
                    <span className="truncate">{step.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Help button */}
          <button className="flex items-center gap-2 text-sm text-primary font-medium px-3 py-2 hover:bg-surface-low rounded-sm transition-colors">
            <HelpCircle className="h-4 w-4" />
            Need Help?
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto px-8 py-8">
            {/* Step header with counter */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1
                  className="text-[1.75rem] font-extrabold text-foreground leading-tight"
                  style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
                >
                  {STEPS[currentStep - 1].label === "Company Info" ? "Company Information" : STEPS[currentStep - 1].label}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentStep === 1 && "Please provide the legal registration details for your institution."}
                  {currentStep === 2 && "Add all directors and signatories for this account."}
                  {currentStep === 3 && "Configure your account preferences and limits."}
                  {currentStep === 4 && "Upload the required KYC and compliance documents."}
                  {currentStep === 5 && "Review all information before submitting your application."}
                </p>
              </div>
              <div className="text-right shrink-0 ml-8">
                <p className="text-sm text-foreground">
                  <span className="text-primary font-bold text-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {String(currentStep).padStart(2, "0")}
                  </span>
                  <span className="text-muted-foreground"> / {String(STEPS.length).padStart(2, "0")}</span>
                </p>
                {/* Progress bar */}
                <div className="w-24 h-1 bg-surface-high rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Step content */}
            <div>
              {currentStep === 1 && (
                <StepCompanyInfo
                  data={application.company_info}
                  feedback={application.feedback.filter((f) => f.target_type === "field")}
                  onSave={handleCompanySave}
                />
              )}
              {currentStep === 2 && (
                <StepDirectors
                  directors={application.directors}
                  feedback={application.feedback.filter((f) => f.target_type === "director")}
                  onSave={handleDirectorsSave}
                  onBack={() => setCurrentStep(1)}
                />
              )}
              {currentStep === 3 && (
                <StepAccountConfig
                  data={application.account_config}
                  signatoryCount={application.directors.filter((d) => d.role !== "director").length}
                  feedback={application.feedback.filter((f) => f.target_type === "field")}
                  onSave={handleAccountSave}
                  onBack={() => setCurrentStep(2)}
                />
              )}
              {currentStep === 4 && (
                <StepDocuments
                  documents={application.documents}
                  feedback={application.feedback.filter((f) => f.target_type === "document")}
                  onSave={handleDocsSave}
                  onBack={() => setCurrentStep(3)}
                />
              )}
              {currentStep === 5 && (
                <StepReview
                  application={application}
                  onSubmit={handleSubmit}
                  onBack={() => setCurrentStep(4)}
                  onEditStep={setCurrentStep}
                />
              )}
            </div>

            {/* Bottom info cards */}
            {currentStep < 5 && (
              <div className="grid grid-cols-2 gap-4 mt-12">
                <div className="border border-surface-high rounded-sm p-5">
                  <Info className="h-5 w-5 text-primary mb-3" />
                  <h4 className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Required Documents
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    In the next step, you will be required to upload your Certificate of Incorporation, Form CAC 1.1, and Memart. Ensure you have high-resolution PDF scans ready.
                  </p>
                </div>
                <div className="border border-surface-high rounded-sm p-5">
                  <Shield className="h-5 w-5 text-success mb-3" />
                  <h4 className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Secure Vaulting
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Uverus Banking utilizes hardware security modules (HSM) to protect your institutional identity. Your registration data is stored in air-gapped environments.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
