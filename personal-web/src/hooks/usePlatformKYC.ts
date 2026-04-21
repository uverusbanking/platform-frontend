import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
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

const PLATFORM_API_BASE_URL = import.meta.env.VITE_PLATFORM_API_BASE_URL || "";

export const usePlatformKYC = () => {
  const { user } = useAuth();
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [middleName, setMiddleName] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<TierStatus | null>(null);
  const [allTiers, setAllTiers] = useState<TierLimits[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync Customer ID from Auth Context
  useEffect(() => {
    if (user?.customerId) {
      setCustomerId(user.customerId);
      setLoading(false);
    } else if (user && !user.customerId) {
      // If user is loaded but no customerId, stop loading
      setLoading(false);
    }
  }, [user]);

  // Fetch Static Tier Limits - Mocked
  useEffect(() => {
    const fetchAllTiers = async () => {
      try {
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

    // Skip if PLATFORM_API_BASE_URL not configured — avoids hitting Vite dev
    // server and getting an HTML 404 response that breaks JSON.parse
    if (!PLATFORM_API_BASE_URL) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${PLATFORM_API_BASE_URL}/payment/${customerId}/tier`,
        {
          headers: {
            accept: "*/*",
          },
        },
      );
      if (response.ok) {
        const result = await response.json();
        if (result.status === "success") {
          setCurrentTier(result.data);
        }
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
      `${PLATFORM_API_BASE_URL}/customers/${customerId}/upgrade-tier-2`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
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
      `${PLATFORM_API_BASE_URL}/customers/${customerId}/upgrade-tier-3`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
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
