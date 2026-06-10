import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Wallet, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateWallet } from "@/hooks/mutations/useWalletMutations";
import { AppLayout } from "@/components/AppLayout";
import type { CreateWalletDto } from "@/types";

const walletSchema = z.object({
  name: z.string().min(3, "Wallet name must be at least 3 characters"),
  currency: z.string().min(1, "Please select a currency"),
  account_type: z.string().min(1, "Please select an account type"),
});

const CreateWallet = () => {
  const navigate = useNavigate();
  const { mutate: createWallet, isPending } = useCreateWallet();

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [accountType, setAccountType] = useState("SAVINGS");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      const values = walletSchema.parse({
        name,
        currency,
        account_type: accountType,
      });
      createWallet(values as CreateWalletDto, {
        onSuccess: () => {
          toast.success("Wallet created successfully!");
          navigate("/account/dashboard");
        },
        onError: (error: unknown) => {
          toast.error((error as Error).message || "Failed to create wallet");
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0])
            newErrors[error.path[0].toString()] = error.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-7">
        <p className="eyebrow mb-2">Wallets</p>
        <h1 className="display text-[clamp(26px,3.5vw,44px)] m-0 leading-none">
          Create a{" "}
          <span
            className="serif-italic"
            style={{ color: "rgb(var(--brand-primary))" }}
          >
            new wallet.
          </span>
        </h1>
        <p className="text-foreground-subtle text-sm mt-2">
          Separate your savings, business, or daily expenses
        </p>
      </div>

      <div className="max-w-lg">
        <div
          className="rounded-2xl p-7 shadow-card"
          style={{
            background: "rgb(var(--surface-highest))",
            border: "1px solid rgb(var(--surface-high))",
          }}
        >
          {/* Icon */}
          <div className="flex items-center gap-4 mb-7">
            <div
              className="w-14 h-14 rounded-pill flex items-center justify-center shrink-0"
              style={{ background: "rgb(var(--soft))" }}
            >
              <Wallet
                size={24}
                style={{ color: "rgb(var(--brand-primary))" }}
                strokeWidth={2}
              />
            </div>
            <div>
              <p className="font-bold text-lg">New Wallet</p>
              <p className="text-xs text-foreground-subtle">
                Fill in the details below
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="walletName"
                className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide"
              >
                Wallet Name
              </Label>
              <Input
                id="walletName"
                placeholder="e.g. My Savings, Business Wallet…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`rounded-xl h-12 ${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && (
                <p
                  className="text-xs"
                  style={{ color: "rgb(var(--brand-primary))" }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide">
                  Currency
                </Label>
                <Select onValueChange={setCurrency} defaultValue={currency}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="NGN">NGN – Nigerian Naira</SelectItem>
                    <SelectItem value="USD" disabled>
                      USD – Coming Soon
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p
                    className="text-xs"
                    style={{ color: "rgb(var(--brand-primary))" }}
                  >
                    {errors.currency}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide">
                  Account Type
                </Label>
                <Select
                  onValueChange={setAccountType}
                  defaultValue={accountType}
                >
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="SAVINGS">Savings Account</SelectItem>
                    <SelectItem value="CURRENT">Current Account</SelectItem>
                  </SelectContent>
                </Select>
                {errors.account_type && (
                  <p
                    className="text-xs"
                    style={{ color: "rgb(var(--brand-primary))" }}
                  >
                    {errors.account_type}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-pill text-sm font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating wallet…
                  </>
                ) : (
                  "Create My Wallet"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full flex items-center justify-center py-3 rounded-pill text-sm font-semibold transition-colors hover:bg-surface"
                style={{
                  background: "transparent",
                  color: "rgb(var(--foreground-subtle))",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateWallet;
