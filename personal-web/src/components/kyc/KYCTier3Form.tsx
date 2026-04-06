import { useState, useRef } from "react";
import { useKYC } from "@/hooks/useKYC";
import { useUverusKYC } from "@/hooks/useUverusKYC";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Upload, Loader2, Shield, FileText, X, Home } from "lucide-react";

// Define types locally since we removed database import
type KYCDocumentType =
  | "passport"
  | "drivers_license"
  | "national_id"
  | "utility_bill"
  | "bank_statement";

interface KYCTier3FormProps {
  onSuccess: () => void;
}

export const KYCTier3Form = ({ onSuccess }: KYCTier3FormProps) => {
  const { uploadDocument } = useKYC();
  const { upgradeToTier3 } = useUverusKYC();

  const [idType, setIdType] = useState<
    "passport" | "drivers_license" | "national_id"
  >("passport");
  const [addressType, setAddressType] = useState<
    "utility_bill" | "bank_statement"
  >("utility_bill");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [addressFile, setAddressFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [addressPreview, setAddressPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const idInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "id" | "address",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === "id") {
        setIdFile(file);
        setIdPreview(event.target?.result as string);
      } else {
        setAddressFile(file);
        setAddressPreview(event.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearFile = (type: "id" | "address") => {
    if (type === "id") {
      setIdFile(null);
      setIdPreview(null);
      if (idInputRef.current) idInputRef.current.value = "";
    } else {
      setAddressFile(null);
      setAddressPreview(null);
      if (addressInputRef.current) addressInputRef.current.value = "";
    }
  };

  const getApiIdType = (type: string) => {
    switch (type) {
      case "national_id":
        return "NATIONAL_ID";
      case "passport":
        return "PASSPORT";
      case "drivers_license":
        return "DRIVERS_LICENSE";
      default:
        return "NATIONAL_ID";
    }
  };

  const handleSubmit = async () => {
    if (!idFile) {
      toast.error("Please upload a government-issued ID");
      return;
    }

    if (!addressFile) {
      toast.error("Please upload a proof of address document");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Upload ID
      setUploadMessage("Uploading ID document...");
      const idResult = await uploadDocument(idFile, idType as any);
      if (!idResult.success || !idResult.document?.document_url) {
        throw new Error(idResult.error || "Failed to upload ID document");
      }

      // 2. Upload Proof of Address
      setUploadMessage("Uploading proof of address...");
      const addressResult = await uploadDocument(
        addressFile,
        addressType as any,
      );
      if (!addressResult.success || !addressResult.document?.document_url) {
        throw new Error(
          addressResult.error || "Failed to upload proof of address",
        );
      }

      // 3. Submit Upgrade
      setUploadMessage("Submitting verification...");
      const response = await upgradeToTier3({
        id_type: getApiIdType(idType),
        id_file_url: idResult.document.document_url,
        proof_of_address_url: addressResult.document.document_url,
      });

      if (
        response &&
        (response.data || response.message?.toLowerCase().includes("success"))
      ) {
        toast.success("Tier 3 verification submitted successfully");
        onSuccess();
      } else {
        throw new Error(response.message || "Verification submission failed");
      }
    } catch (error: any) {
      console.error("Tier 3 upgrade error:", error);
      toast.error(error.message || "An error occurred during verification");
    } finally {
      setSubmitting(false);
      setUploadMessage(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-success/20 bg-success/5">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Full KYC Verification</p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload your ID and Proof of Address to unlock Tier 3 limits.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ID Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Government-Issued ID</CardTitle>
          <CardDescription>Select type and upload image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={idType}
            onValueChange={(v) => setIdType(v as typeof idType)}
            className="grid grid-cols-1 gap-2"
          >
            {[
              { value: "passport", label: "International Passport" },
              { value: "drivers_license", label: "Driver's License" },
              { value: "national_id", label: "National ID Card" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  idType === option.value
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value={option.value} />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </RadioGroup>

          <div>
            <input
              ref={idInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, "id")}
            />
            {idPreview ? (
              <div className="relative mt-2 h-40">
                <img
                  src={idPreview}
                  alt="ID Preview"
                  className="w-full h-full object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => clearFile("id")}
                  className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-white shadow-sm"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => idInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-colors"
              >
                <FileText className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload ID
                </span>
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Address Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Proof of Address</CardTitle>
          <CardDescription>
            Utility bill or Bank statement (recent)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={addressType}
            onValueChange={(v) => setAddressType(v as typeof addressType)}
            className="grid grid-cols-1 gap-2"
          >
            {[
              { value: "utility_bill", label: "Utility Bill" },
              { value: "bank_statement", label: "Bank Statement" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  addressType === option.value
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value={option.value} />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </RadioGroup>

          <div>
            <input
              ref={addressInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, "address")}
            />
            {addressPreview ? (
              <div className="relative mt-2 h-40">
                <img
                  src={addressPreview}
                  alt="Address Preview"
                  className="w-full h-full object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => clearFile("address")}
                  className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-white shadow-sm"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => addressInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-colors"
              >
                <Home className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload proof of address
                </span>
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full h-12"
        size="lg"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 animate-spin" size={18} />
            {uploadMessage || "Submitting..."}
          </>
        ) : (
          <>
            <Upload className="mr-2" size={18} />
            Submit Verification
          </>
        )}
      </Button>
    </div>
  );
};
