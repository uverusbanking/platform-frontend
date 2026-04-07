"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OrganisationDetailsStep } from "@/components/features/registration/OrganisationDetailsStep";
import { DirectorsStep } from "@/components/features/registration/DirectorsStep";
import { DocumentsStep } from "@/components/features/registration/DocumentsStep";
import { ReviewStep } from "@/components/features/registration/ReviewStep";
import { CheckCircle2 } from "lucide-react";
import {
  directorInterface,
  documentInterface,
} from "@/types/organisationRegistration";
import apiClient from "@/lib/axios";
import { defaultApiResponse } from "@/lib/resources";

const steps = [
  {
    id: 1,
    title: "Organisation Details",
    description: "Basic organisation information",
  },
  {
    id: 2,
    title: "Directors & Beneficial Owners",
    description: "Key personnel information",
  },
  { id: 3, title: "Documents", description: "Upload required documents" },
  {
    id: 4,
    title: "Review & Submit",
    description: "Review and submit application",
  },
];

export interface OrganisationData {
  organisationName: string;

  streetAddress: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;

  tin: string;
  cacNumber: string;
  businessEmail: string;
  businessPhone: string;
  directors: directorInterface[];
  documents: {
    cacCertificate?: documentInterface;
    memorandum?: documentInterface;
    boardResolution?: documentInterface;
    proofOfAddress?: documentInterface;
    uboDeclaration?: documentInterface;
  };
}

const defaultOrganisationData: OrganisationData = {
  organisationName: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  tin: "",
  cacNumber: "",
  businessEmail: "",
  businessPhone: "",
  directors: [],
  documents: {},
};

export default function OrganisationRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organisationData, setOrganisationData] = useState<OrganisationData>(
    defaultOrganisationData,
  );
  const [applicationReference, setApplicationReference] = useState("");
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setApiResponse(defaultApiResponse);
    try {
      setIsSubmitting(true);
      // console.log("Submitting KYB application:", organisationData);
      const response = (
        await apiClient.post("/organisation/register", organisationData)
      ).data;
      // console.log(response);

      setApplicationReference(response.data.id);

      setIsSubmitted(true);
      setOrganisationData(defaultOrganisationData);
      setCurrentStep(1);
    } catch (error: unknown) {
      console.log(error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "An error occurred";
      setApiResponse({
        display: true,
        status: false,
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
            <CardTitle>Application Submitted!</CardTitle>
            <CardDescription>
              Your organisation registration application has been submitted
              successfully and is now pending approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Application Reference
              </p>
              <p className="font-mono font-semibold">{applicationReference}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              You will receive an email notification once your application has
              been reviewed. This typically takes 2-5 business days.
            </p>
            <Button
              className="w-full"
              onClick={() => (window.location.href = "/")}
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Organisation Registration (KYB)
          </h1>
          <p className="text-muted-foreground">
            Complete the Know Your Business process to register your
            organisation
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.id}
                  </div>
                  <p
                    className={`text-xs text-center ${currentStep >= step.id ? "font-semibold" : "text-muted-foreground"}`}
                  >
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <OrganisationDetailsStep
                data={organisationData}
                onChange={setOrganisationData}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                handleSubmitBtn={handleSubmit}
                currentStep={currentStep}
                steps={steps}
              />
            )}
            {currentStep === 2 && (
              <DirectorsStep
                data={organisationData}
                onChange={setOrganisationData}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                handleSubmitBtn={handleSubmit}
                currentStep={currentStep}
                steps={steps}
              />
            )}
            {currentStep === 3 && (
              <DocumentsStep
                data={organisationData}
                onChange={setOrganisationData}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                handleSubmitBtn={handleSubmit}
                currentStep={currentStep}
                steps={steps}
              />
            )}
            {currentStep === 4 && (
              <ReviewStep
                data={organisationData}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                handleSubmitBtn={handleSubmit}
                currentStep={currentStep}
                steps={steps}
                isSubmitting={isSubmitting}
                apiResponse={apiResponse}
              />
            )}

            {/* Navigation Buttons */}
            {/* <div className="flex justify-between mt-8 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                            >
                                Previous
                            </Button>
                            {currentStep < steps.length ? (
                                <Button onClick={handleNext}>Next</Button>
                            ) : (
                                <Button onClick={handleSubmit}>Submit Application</Button>
                            )}
                        </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
