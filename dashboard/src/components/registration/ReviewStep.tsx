// import { CompanyData } from "@/pages/CompanyRegistration";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Users,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { CompanyData } from "@/app/(auth)/register/page";
import { Button } from "../ui/button";
import Image from "next/image";
import DisplayRespondsMessage from "../DisplayResponse";
import { responseInterface } from "@/utils/resources";

interface ReviewStepProps {
  data: CompanyData;

  handlePrevious: () => void;
  handleNext: () => void;
  handleSubmitBtn: () => void;
  currentStep: number;
  steps: unknown[];
  isSubmitting: boolean;
  apiResponse: responseInterface;
}

export function ReviewStep({
  data,
  handlePrevious,
  handleNext,
  handleSubmitBtn,
  currentStep,
  steps,
  isSubmitting,
  apiResponse,
}: ReviewStepProps) {
  return (
    <div>
      <div className="space-y-6">
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Please review all information before submitting. Your application
            will be reviewed by our compliance team within 2-5 business days.
          </p>
        </div>

        {/* Company Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <CardTitle>Company Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="font-medium">
                  {data.companyName || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CAC Number</p>
                <p className="font-medium">
                  {data.cacNumber || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">TIN</p>
                <p className="font-medium">{data.tin || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Business Email</p>
                <p className="font-medium">
                  {data.businessEmail || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Business Phone</p>
                <p className="font-medium">
                  {data.businessPhone || "Not provided"}
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">
                Registered Address
              </p>
              <p className="font-medium">
                {data.streetAddress || "Not provided"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Directors & Beneficial Owners */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Directors & Beneficial Owners</CardTitle>
            </div>
            <CardDescription>
              {data.directors.length} person(s) added
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.directors.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No directors added
              </p>
            ) : (
              data.directors.map((director, index) => (
                <div
                  key={director.bvn}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {director.firstName + " " + director.lastName ||
                        `Director ${index + 1}`}
                    </p>
                    {director.isBeneficialOwner && (
                      <Badge variant="secondary">Beneficial Owner</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">BVN</p>
                      <p>{director.bvn || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">NIN</p>
                      <p>{director.nin || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ID Type</p>
                      <p className="capitalize">
                        {director.idType.replace("_", " ")}
                      </p>
                    </div>
                    {director.ownershipPercentage !== undefined &&
                      director.ownershipPercentage > 0 && (
                        <div>
                          <p className="text-muted-foreground">Ownership</p>
                          <p>{director.ownershipPercentage}%</p>
                        </div>
                      )}
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Residential Address
                    </p>
                    <p className="text-sm">
                      {director.streetAddress || "Not provided"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Uploaded Documents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { key: "CAC_CERTIFICATE", label: "CAC Certificate" },
                { key: "MEMORANDUM", label: "Memorandum & Articles" },
                { key: "BOARD_RESOLUTION", label: "Board Resolution" },
                { key: "PROOF_OF_ADDRESS", label: "Proof of Address" },
                { key: "UBO_DECLARATION", label: "UBO Declaration" },
              ].map((doc) => (
                <div
                  key={doc.key}
                  className="flex items-center justify-between p-2 rounded border"
                >
                  <span className="text-sm">{doc.label}</span>
                  {data.documents[doc.key as keyof typeof data.documents] ? (
                    <div className="flex items-center gap-2 text-primary">
                      <CheckCircle2 className="h-4 w-4" />

                      <div
                        style={{ position: "relative", width: 50, height: 50 }}
                      >
                        <Image
                          src={
                            data.documents[
                              doc.key as keyof typeof data.documents
                            ]!.fileUrl
                          }
                          alt="Image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <Badge variant="outline">Not uploaded</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <DisplayRespondsMessage response={apiResponse} />

      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button type="button" disabled={true} onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmitBtn}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Submit Application"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
