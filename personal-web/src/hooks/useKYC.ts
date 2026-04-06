import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

type KYCDocumentType =
  | "bvn"
  | "nin"
  | "passport"
  | "drivers_license"
  | "national_id"
  | "selfie"
  | "utility_bill"
  | "bank_statement";
type KYCStatus = "pending" | "approved" | "rejected";

export interface KYCDocument {
  id: string;
  user_id: string;
  document_type: KYCDocumentType;
  document_url: string | null;
  document_number: string | null;
  status: KYCStatus;
  rejection_reason: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpgradeRequest {
  id: string;
  user_id: string;
  current_tier: string;
  requested_tier: string;
  status: string;
  reason: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export const useKYC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [upgradeRequests, setUpgradeRequests] = useState<UpgradeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchKYCData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Mock data
      setDocuments([]);
      setUpgradeRequests([]);
    } catch (error) {
      console.error("Error fetching KYC data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchKYCData();
  }, [fetchKYCData]);

  const uploadDocument = async (
    file: File,
    documentType: KYCDocumentType,
    documentNumber?: string,
  ): Promise<{ success: boolean; error?: string; document?: KYCDocument }> => {
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    setUploading(true);

    try {
      // Mock upload
      const mockDoc: KYCDocument = {
        id: "mock-doc-id",
        user_id: user.id,
        document_type: documentType,
        document_url: "mock-url",
        document_number: documentNumber || null,
        status: "pending",
        rejection_reason: null,
        verified_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setDocuments((prev) => [...prev, mockDoc]);
      return { success: true, document: mockDoc };
    } catch (error) {
      console.error("Error uploading document:", error);
      return { success: false, error: "Failed to upload document" };
    } finally {
      setUploading(false);
    }
  };

  const submitVerification = async (
    requestedTier: "tier_2" | "tier_3",
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      // Mock submission
      const mockRequest: UpgradeRequest = {
        id: "mock-req-id",
        user_id: user.id,
        current_tier: "tier_1",
        requested_tier: requestedTier,
        status: "pending",
        reason: null,
        reviewed_at: null,
        created_at: new Date().toISOString(),
      };
      setUpgradeRequests((prev) => [...prev, mockRequest]);
      return { success: true };
    } catch (error) {
      console.error("Error submitting verification:", error);
      return { success: false, error: "Failed to submit verification" };
    }
  };

  const getDocumentByType = (
    type: KYCDocumentType,
  ): KYCDocument | undefined => {
    return documents.find((doc) => doc.document_type === type);
  };

  const hasPendingRequest = (): boolean => {
    return upgradeRequests.some((req) => req.status === "pending");
  };

  const getPendingRequest = (): UpgradeRequest | undefined => {
    return upgradeRequests.find((req) => req.status === "pending");
  };

  const isKYCComplete = (tier: "tier_2" | "tier_3"): boolean => {
    if (tier === "tier_2") {
      const bvn = getDocumentByType("bvn");
      const nin = getDocumentByType("nin");
      return !!(bvn?.status === "approved" || nin?.status === "approved");
    }

    if (tier === "tier_3") {
      const governmentId = documents.find(
        (doc) =>
          ["passport", "drivers_license", "national_id"].includes(
            doc.document_type,
          ) && doc.status === "approved",
      );
      const selfie = getDocumentByType("selfie");
      const proofOfAddress = documents.find(
        (doc) =>
          ["utility_bill", "bank_statement"].includes(doc.document_type) &&
          doc.status === "approved",
      );
      return !!(
        governmentId &&
        selfie?.status === "approved" &&
        proofOfAddress
      );
    }

    return false;
  };

  const hasUploadedDocuments = (tier: "tier_2" | "tier_3"): boolean => {
    if (tier === "tier_2") {
      const bvn = getDocumentByType("bvn");
      const nin = getDocumentByType("nin");
      return !!(bvn || nin);
    }

    if (tier === "tier_3") {
      const governmentId = documents.find((doc) =>
        ["passport", "drivers_license", "national_id"].includes(
          doc.document_type,
        ),
      );
      const selfie = getDocumentByType("selfie");
      const proofOfAddress = documents.find((doc) =>
        ["utility_bill", "bank_statement"].includes(doc.document_type),
      );
      return !!(governmentId && selfie && proofOfAddress);
    }

    return false;
  };

  return {
    documents,
    upgradeRequests,
    loading,
    uploading,
    uploadDocument,
    submitVerification,
    getDocumentByType,
    hasPendingRequest,
    getPendingRequest,
    isKYCComplete,
    hasUploadedDocuments,
    refetch: fetchKYCData,
  };
};
