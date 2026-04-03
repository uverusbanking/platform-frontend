import { CompanyData } from "@/app/(auth)/register/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultApiResponse } from "@/utils/resources";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DisplayRespondsMessage from "../DisplayResponse";
import { Button } from "../ui/button";
import { apiErrorResponse } from "@/utils/apiClient";
import { Loader2 } from "lucide-react";
import { checkIfCompanyExists } from "@/services/companyService";
import { companyDetailsSchema } from "@/lib/schemas/registration/companyDetails.schema";

const FormSchema = companyDetailsSchema;

interface CompanyDetailsStepProps {
  data: CompanyData;
  onChange: (data: CompanyData) => void;

  handlePrevious: () => void;
  handleNext: () => void;
  handleSubmitBtn: () => void;
  currentStep: number;
  steps: unknown[];
}

export function CompanyDetailsStep({
  data,
  onChange,
  handlePrevious,
  handleNext,
  handleSubmitBtn,
  currentStep,
  steps,
}: CompanyDetailsStepProps) {
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      companyName: data.companyName,
      cacNumber: data.cacNumber,
      tin: data.tin,
      businessEmail: data.businessEmail,
      businessPhone: data.businessPhone,
      streetAddress: data.streetAddress,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
    },
  });

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    try {
      setIsLoading(true);
      setApiResponse(defaultApiResponse);

      const payload = {
        cacRegistrationNumber: formData.cacNumber,
        tin: formData.tin,
        businessEmail: formData.businessEmail,
      };
      const response = await checkIfCompanyExists(payload);

      onChange({
        ...data,
        companyName: formData.companyName,
        cacNumber: formData.cacNumber,
        tin: formData.tin,
        businessEmail: formData.businessEmail,
        businessPhone: formData.businessPhone,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      });

      handleNext();
    } catch (error: unknown) {
      const err = apiErrorResponse(error, "Something went wrong");

      setApiResponse({
        display: true,
        status: false,
        message: err.error,
        errorMsg: err.errorMsgs,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            type="text"
            placeholder="ABC Limited"
            aria-invalid={!!errors.companyName}
            aria-describedby="companyName-error"
            {...register("companyName")}
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm mt-1" id="companyName-error">
              {errors.companyName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cacNumber">CAC Registration Number *</Label>
          <Input
            id="cacNumber"
            type="text"
            placeholder="RC123456"
            aria-invalid={!!errors.cacNumber}
            aria-describedby="cacNumber-error"
            {...register("cacNumber")}
          />
          {errors.cacNumber && (
            <p className="text-red-500 text-sm mt-1" id="cacNumber-error">
              {errors.cacNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tin">Tax Identification Number (TIN) *</Label>
          <Input
            id="tin"
            type="text"
            placeholder="12345678-0001"
            aria-invalid={!!errors.tin}
            aria-describedby="tin-error"
            {...register("tin")}
          />
          {errors.tin && (
            <p className="text-red-500 text-sm mt-1" id="tin-error">
              {errors.tin.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessEmail">Business Email *</Label>
          <Input
            id="businessEmail"
            type="email"
            inputMode="email"
            placeholder="info@company.com"
            aria-invalid={!!errors.businessEmail}
            aria-describedby="businessEmail-error"
            {...register("businessEmail")}
          />
          {errors.businessEmail && (
            <p className="text-red-500 text-sm mt-1" id="businessEmail-error">
              {errors.businessEmail.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessPhone">Business Phone *</Label>
          <Input
            id="businessPhone"
            type="tel"
            inputMode="tel"
            placeholder="+234 XXX XXX XXXX"
            aria-invalid={!!errors.businessPhone}
            aria-describedby="businessPhone-error"
            {...register("businessPhone")}
          />
          {errors.businessPhone && (
            <p className="text-red-500 text-sm mt-1" id="businessPhone-error">
              {errors.businessPhone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="streetAddress">Street Address *</Label>
          <Input
            id="streetAddress"
            type="text"
            placeholder="Full registered company address"
            aria-invalid={!!errors.streetAddress}
            aria-describedby="streetAddress-error"
            {...register("streetAddress")}
          />
          {errors.streetAddress && (
            <p className="text-red-500 text-sm mt-1" id="streetAddress-error">
              {errors.streetAddress.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            type="text"
            placeholder="Zip Code"
            aria-invalid={!!errors.zipCode}
            aria-describedby="zipCode-error"
            {...register("zipCode")}
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm mt-1" id="zipCode-error">
              {errors.zipCode.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            type="text"
            placeholder="City"
            aria-invalid={!!errors.city}
            aria-describedby="city-error"
            {...register("city")}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1" id="city-error">
              {errors.city.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            type="text"
            placeholder="State"
            aria-invalid={!!errors.state}
            aria-describedby="state-error"
            {...register("state")}
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1" id="state-error">
              {errors.state.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            type="text"
            placeholder="Country"
            aria-invalid={!!errors.country}
            aria-describedby="country-error"
            {...register("country")}
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1" id="country-error">
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-4">* Required fields</p>

      <DisplayRespondsMessage response={apiResponse} />

      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        {currentStep < steps.length ? (
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Next"
            )}
          </Button>
        ) : (
          <Button onClick={handleSubmitBtn}>Submit Application</Button>
        )}
      </div>
    </form>
  );
}
