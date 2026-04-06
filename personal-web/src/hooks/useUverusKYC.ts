import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UVERUS_API_KEY } from "@/lib/constants";
import { UserService } from "@/services/user.service";

export type UserTier = "tier_1" | "tier_2" | "tier_3";

export interface TierLimits {
  tier: UserTier;
  tier_name: string;
  tier_description: string;
  max_send_per_tx: number;
  max_receive_per_tx: number;
  daily_send_limit: number;
  daily_receive_limit: number;
  monthly_limit: number;
  features: string[];
  required_documents: string[];
}

export interface TierStatus {
  kyc_level: number;
  limits: {
    name: string;
    maxBalance: number;
    dailyLimit: number;
  };
}

export interface Tier2Payload {
  employer_name: string;
  idempotency_key: string;
  monthly_income: string;
  middle_name: string;
  occupation: string;
  employment_status: string;
  nin: string;
  passport_photograph_url: string;
}

export interface Tier3Payload {
  id_type: string;
  id_file_url: string;
  proof_of_address_url: string;
  idempotency_key: string;
}

const UVERUS_API_BASE_URL = import.meta.env.VITE_UVERUS_API_BASE_URL || "";

export const useUverusKYC = () => {
  const { user } = useAuth();
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [middleName, setMiddleName] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<TierStatus | null>(null);
  const [allTiers, setAllTiers] = useState<TierLimits[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Customer Profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await UserService.getProfile();
        if (data.customerId) {
          setCustomerId(data.customerId);
        }
        // Middle name not available in standard profile? Ignore or mock.
        setMiddleName("");
      } catch (e) {
        console.error(e);
      } finally {
        // Keep loading true until tier is fetched if customerId exists
      }
    };
    fetchProfile();
  }, [user]);

  // Fetch Static Tier Limits - Mocked since DB removal
  useEffect(() => {
    const fetchAllTiers = async () => {
      try {
        // Mock data or empty
        setAllTiers([]);
      } catch (e) {
        console.error("Error fetching tier limits:", e);
      }
    };
    fetchAllTiers();
  }, []);

  // Fetch Tier Level from API
  const fetchTierLevel = async () => {
    if (!customerId) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${UVERUS_API_BASE_URL}/payment/${customerId}/tier`,
        {
          headers: {
            accept: "*/*",
            "x-api-key": UVERUS_API_KEY,
          },
        },
      );
      const result = await response.json();
      if (result.status === "success") {
        setCurrentTier(result.data);
      }
    } catch (e) {
      console.error("Error fetching tier level:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) fetchTierLevel();
  }, [customerId]);

  const upgradeToTier2 = async (
    data: Omit<Tier2Payload, "idempotency_key">,
  ) => {
    if (!customerId)
      throw new Error("No Customer ID found. Please contact support.");

    const payload = {
      ...data,
      idempotency_key: crypto.randomUUID(),
    };

    const response = await fetch(
      `${UVERUS_API_BASE_URL}/customers/${customerId}/upgrade-tier-2`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          "x-api-key": UVERUS_API_KEY,
        },
        body: JSON.stringify(payload),
      },
    );

    return response.json();
  };

  const upgradeToTier3 = async (
    data: Omit<Tier3Payload, "idempotency_key">,
  ) => {
    if (!customerId)
      throw new Error("No Customer ID found. Please contact support.");

    const payload = {
      ...data,
      idempotency_key: crypto.randomUUID(),
    };

    const response = await fetch(
      `${UVERUS_API_BASE_URL}/customers/${customerId}/upgrade-tier-3`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          "x-api-key": UVERUS_API_KEY,
        },
        body: JSON.stringify(payload),
      },
    );

    return response.json();
  };

  return {
    currentTier,
    allTiers,
    middleName,
    upgradeToTier2,
    upgradeToTier3,
    loading,
    fetchTierLevel,
    customerId,
  };
};