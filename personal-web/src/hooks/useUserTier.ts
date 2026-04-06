import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

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

export interface UserTierAssignment {
  user_id: string;
  current_tier: UserTier;
  tier_updated_at: string;
}

export const useUserTier = () => {
  const { user } = useAuth();
  const [userTier, setUserTier] = useState<UserTierAssignment | null>(null);
  const [tierLimits, setTierLimits] = useState<TierLimits | null>(null);
  const [allTiers, setAllTiers] = useState<TierLimits[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserTier();
      fetchAllTiers();
    }
  }, [user]);

  const fetchUserTier = async () => {
    if (!user) return;

    try {
      // Mock data since we removed DB access
      const mockTier: UserTierAssignment = {
        user_id: user.id,
        current_tier: "tier_1", // Default to tier 1
        tier_updated_at: new Date().toISOString(),
      };
      setUserTier(mockTier);

      // Mock limits
      const mockLimits: TierLimits = {
        tier: "tier_1",
        tier_name: "Tier 1",
        tier_description: "Starter Tier",
        max_send_per_tx: 50000,
        max_receive_per_tx: 50000,
        daily_send_limit: 50000,
        daily_receive_limit: 50000,
        monthly_limit: 200000,
        features: ["Basic Transfers"],
        required_documents: [],
      };
      setTierLimits(mockLimits);
    } catch (err) {
      console.error("Error in fetchUserTier:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTiers = async () => {
    try {
      // Mock all tiers
      setAllTiers([
        {
          tier: "tier_1",
          tier_name: "Tier 1",
          tier_description: "Starter Tier",
          max_send_per_tx: 50000,
          max_receive_per_tx: 50000,
          daily_send_limit: 50000,
          daily_receive_limit: 50000,
          monthly_limit: 200000,
          features: ["Basic Transfers"],
          required_documents: [],
        },
        {
          tier: "tier_2",
          tier_name: "Tier 2",
          tier_description: "Standard Tier",
          max_send_per_tx: 200000,
          max_receive_per_tx: 200000,
          daily_send_limit: 200000,
          daily_receive_limit: 200000,
          monthly_limit: 1000000,
          features: ["Higher Limits"],
          required_documents: ["BVN"],
        },
        {
          tier: "tier_3",
          tier_name: "Tier 3",
          tier_description: "Premium Tier",
          max_send_per_tx: 1000000,
          max_receive_per_tx: 1000000,
          daily_send_limit: 1000000,
          daily_receive_limit: 1000000,
          monthly_limit: 10000000,
          features: ["Unlimited Transfers"],
          required_documents: ["Utility Bill", "ID"],
        },
      ]);
    } catch (err) {
      console.error("Error in fetchAllTiers:", err);
    }
  };

  const getTierNumber = (tier: UserTier): number => {
    return parseInt(tier.replace("tier_", ""));
  };

  const getNextTier = (): TierLimits | null => {
    if (!userTier) return null;
    const currentTierNum = getTierNumber(userTier.current_tier);
    if (currentTierNum >= 3) return null;
    return (
      allTiers.find((t) => getTierNumber(t.tier) === currentTierNum + 1) || null
    );
  };

  const getTierProgress = (): number => {
    if (!userTier) return 0;
    return (getTierNumber(userTier.current_tier) / 3) * 100;
  };

  return {
    userTier,
    tierLimits,
    allTiers,
    loading,
    getTierNumber,
    getNextTier,
    getTierProgress,
    refetch: fetchUserTier,
  };
};
