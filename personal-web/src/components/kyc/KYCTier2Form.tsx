import { useState, useRef } from "react";
import { useKYC } from "@/hooks/useKYC";
import { usePlatformKYC } from "@/hooks/usePlatformKYC";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Upload,
  Loader2,
  Briefcase,
  CreditCard,
  Banknote,
  Image as ImageIcon,
  X,
} from "lucide-react";

interface KYCTier2FormProps {
  onSuccess: () => void;
}

export const KYCTier2Form = ({ onSuccess }: KYCTier2FormProps) => {
  const { uploadDocument } = useKYC();
  const { upgradeToTier2, middleName, loading: kycLoading } = usePlatformKYC();

  const [formData, setFormData] = useState({
    employer_name: "",
    monthly_income: "",
    occupation: "",
    employment_status: "",
    nin: "",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setPhotoFile(file);
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    // Basic validation
    if (
      !formData.employer_name ||
      !formData.occupation ||
      !formData.employment_status ||
      !formData.nin
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!photoFile) {
      toast.error("Please upload a passport photograph");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Upload Photo
      setUploadMessage("Uploading passport photo...");
      const uploadResult = await uploadDocument(
        photoFile,
        "passport_photograph",
      );

      if (!uploadResult.success || !uploadResult.document?.document_url) {
        throw new Error(uploadResult.error || "Failed to upload photo");
      }

      // 2. Submit Upgrade Request
      setUploadMessage("Submitting verification...");
      const response = await upgradeToTier2({
        ...formData,
        middle_name: middleName || "",
        passport_photograph_url: uploadResult.document.document_url,
      });

      if (
        response &&
        (response.data || response.message?.toLowerCase().includes("success"))
      ) {
        toast.success("Tier 2 upgrade submitted successfully");
        onSuccess();
      } else {
        throw new Error(response.message || "Failed to submit upgrade request");
      }
    } catch (error: any) {
      console.error("Tier 2 upgrade error:", error);
      toast.error(error.message || "An error occurred during verification");
    } finally {
      setSubmitting(false);
      setUploadMessage(null);
    }
  };

  if (kycLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Briefcase className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Tier 2 Verification</p>
              <p className="text-xs text-muted-foreground mt-1">
                Provide your employment and identification details to upgrade to
                Tier 2.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Personal & Employment Details
          </CardTitle>
          <CardDescription>All fields are required</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nin">NIN</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nin"
                  placeholder="National Identity Number"
                  className="pl-9"
                  value={formData.nin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      nin: e.target.value.replace(/\D/g, "").slice(0, 11),
                    }))
                  }
                  maxLength={11}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employment_status">Employment Status</Label>
              <Select
                value={formData.employment_status}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, employment_status: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employed">Employed</SelectItem>
                  <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                  <SelectItem value="Unemployed">Unemployed</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="occupation"
                  placeholder="Your Occupation"
                  className="pl-9"
                  value={formData.occupation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      occupation: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employer_name">Employer Name</Label>
              <Input
                id="employer_name"
                placeholder="Company / Employer Name"
                value={formData.employer_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employer_name: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_income">
                Monthly Income{" "}
                <small className="text-muted-foreground">Optional</small>{" "}
              </Label>
              <div className="relative">
                <Banknote className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="monthly_income"
                  type="number"
                  placeholder="0.00"
                  className="pl-9"
                  value={formData.monthly_income}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      monthly_income: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Passport Photograph</CardTitle>
          <CardDescription>Upload a clear photo of your face</CardDescription>
        </CardHeader>
        <CardContent>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          {photoPreview ? (
            <div className="relative mt-2 w-32 h-32 mx-auto sm:mx-0">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={clearPhoto}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-white shadow-sm"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-colors"
            >
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload photo
              </span>
            </button>
          )}
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
