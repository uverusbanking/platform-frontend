import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AxiosError } from "axios";
import { PersonalSteps } from "./newCustomerSteps/PersonalSteps";
import { PreviewSteps } from "./newCustomerSteps/PreviewSteps";
import { AddressSteps } from "./newCustomerSteps/AddressSteps";
import { EmploymentSteps } from "./newCustomerSteps/EmploymentSteps";
import { AccountIdentitySteps } from "./newCustomerSteps/AccountIdentitySteps";
import { toast } from "sonner";
import { useUserStore } from "@/state/userStore";
import { Gender } from "@/types/enums";
import { useCreateCustomer } from "@/hooks/mutations/useCustomerMutations";

interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const defaultFormData = {
  // Personal Information
  firstName: "",
  lastName: "",
  middleName: "",
  email: "",
  phoneNumber: "",
  dob: "",
  gender: Gender.MALE,
  bvn: "",

  // Address Information
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Nigeria",

  // Account Information
  // accountType: "",
  // branch: "",
  // officer: "",
  // initialDeposit: "",

  // Identity Information
  idType: "",
  idNumber: "",
  // bvn: "",
  nin: "",
  idDocument: "",
  proofOfAddress: "",
  passportPhotograph: "",

  // Employment Information
  occupation: "",
  employer: "",
  monthlyIncome: "",
  employmentStatus: "",

  // Next of Kin
  nextOfKinFirstName: "",
  nextOfKinMiddleName: "",
  nextOfKinLastName: "",
  nextOfKinPhone: "",
  nextOfKinRelationship: "",
  nextOfKinAddress: "",
};

export type ICustomerData = typeof defaultFormData;

const steps = ["personal", "preview", "address", "identity", "employment"];

export function AddCustomerDialog({
  open,
  onOpenChange,
}: AddCustomerDialogProps) {
  const [currentStep, setCurrentStep] = useState("personal");
  const [formData, setFormData] = useState(defaultFormData);
  const { mutateAsync: createCustomer, isPending: isCreatingCustomer } =
    useCreateCustomer();
  const { userData } = useUserStore();

  const handleSubmit = async (data: ICustomerData) => {
    // Merge final step data
    const finalData = { ...formData, ...data };
    setFormData(finalData);

    // Map to payload
    const payload = {
      kyc_level: 1,
      company_id: userData.organisation_id,
      environment: userData.view_mode || "LIVE",
      first_name: finalData.firstName,
      last_name: finalData.lastName,
      email: finalData.email,
      phone_number: finalData.phoneNumber,
      date_of_birth: finalData.dob,
      gender: finalData.gender,
      address_street: finalData.address,
      address_city: finalData.city,
      address_state: finalData.state,
      address_country: finalData.country,
      bvn: finalData.bvn,
      id_type: finalData.idType,
      id_number: finalData.idNumber,
      occupation: finalData.occupation,
      employment_status: finalData.employmentStatus,
      passport_photograph_id: finalData.passportPhotograph,
      middle_name: finalData.middleName,
      nin: finalData.nin,
      id_file_id: finalData.idDocument,
      proof_of_address_id: finalData.proofOfAddress,
      employer_name: finalData.employer,
      employer_address: "Not provided", // Add field if needed or default
      monthly_income: Number(finalData.monthlyIncome) || 0,
      next_of_kin: {
        full_name: `${finalData.nextOfKinFirstName} ${finalData.nextOfKinLastName}`,
        relationship: finalData.nextOfKinRelationship,
        phone_number: finalData.nextOfKinPhone,
        address: finalData.nextOfKinAddress,
      },
    };

    try {
      await createCustomer(payload);
      toast.success("Customer created successfully");
      onOpenChange(false);
      setFormData(defaultFormData);
      setCurrentStep("personal");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err?.response?.data?.message || "Failed to create customer");
    }
  };

  const handlePreviousStep = () => {
    const steps = ["personal", "preview", "address", "identity", "employment"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleNextStep = (data: ICustomerData) => {
    const steps = ["personal", "preview", "address", "identity", "employment"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      setFormData((prev) => ({ ...prev, ...data }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Complete customer registration form with all required information
          </DialogDescription>
        </DialogHeader>

        <div className="mb-8">
          <div className="relative flex justify-between items-center w-full max-w-2xl mx-auto">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2" />

            {["personal", "preview", "address", "identity", "employment"].map(
              (step, index) => {
                const steps = [
                  "personal",
                  "preview",
                  "address",
                  "identity",
                  "employment",
                ];
                const currentIndex = steps.indexOf(currentStep);
                const stepIndex = steps.indexOf(step);
                const isActive = step === currentStep;
                const isCompleted = stepIndex < currentIndex;

                return (
                  <div
                    key={step}
                    className="flex flex-col items-center gap-2 bg-background px-2"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground scale-110"
                          : isCompleted
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-gray-200 text-gray-400 bg-background"
                      }`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    <span
                      className={`text-[10px] font-medium uppercase tracking-wider ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              },
            )}
          </div>
        </div>

        <Tabs
          value={currentStep}
          onValueChange={setCurrentStep}
          className="space-y-4"
        >
          {/* TabsList removed as it's replaced by the stepper above */}

          <TabsContent value="personal" className="space-y-4">
            <PersonalSteps
              closeDialog={() => onOpenChange(false)}
              nextStep={(data) => {
                const newData = { ...formData, ...data };
                setFormData(newData);
                handleNextStep(newData);
              }}
              data={formData.bvn ? formData : undefined}
            />
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <PreviewSteps
              data={formData}
              nextStep={handleNextStep}
              prevStep={handlePreviousStep}
            />
          </TabsContent>

          <TabsContent value="address" className="space-y-4">
            <AddressSteps
              data={formData}
              nextStep={handleNextStep}
              prevStep={handlePreviousStep}
            />
          </TabsContent>

          <TabsContent value="identity" className="space-y-4">
            <AccountIdentitySteps
              data={formData}
              nextStep={handleNextStep}
              prevStep={handlePreviousStep}
            />
          </TabsContent>

          <TabsContent value="employment" className="space-y-4">
            <EmploymentSteps
              data={formData}
              nextStep={handleSubmit}
              prevStep={handlePreviousStep}
              isCreatingCustomer={isCreatingCustomer}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
