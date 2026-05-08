import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Wallet, Loader2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
        onError: (error: any) => {
          toast.error(error.message || "Failed to create wallet");
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <AppLayout showHeader={false}>
      <div className="min-h-screen bg-background pb-8">
        {/* Header */}
        <header className="bg-gradient-hero safe-top pb-20 pt-6 px-4">
          <div className="container mx-auto max-w-2xl flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-2xl"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={24} />
            </Button>
            <h1 className="text-xl font-bold text-white">New Wallet</h1>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 max-w-2xl -mt-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-foreground/5"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-4">
                <Wallet className="text-primary w-8 h-8" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Create Wallet
              </h2>
              <p className="text-muted-foreground mt-2">
                Set up a new wallet to separate your savings, business, or daily
                expenses.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Wallet Name
                </Label>
                <Input
                  placeholder="e.g. My Savings, Business Wallet..."
                  className={`rounded-2xl h-14 bg-muted/30 border-muted focus:ring-primary/20 text-base ${errors.name ? "border-destructive" : ""}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <p className="text-destructive text-xs ml-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Currency
                  </Label>
                  <Select onValueChange={setCurrency} defaultValue={currency}>
                    <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-muted text-base">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
                      <SelectItem value="USD" disabled>
                        USD (Coming Soon)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.currency && (
                    <p className="text-destructive text-xs ml-1">
                      {errors.currency}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Account Type
                  </Label>
                  <Select
                    onValueChange={setAccountType}
                    defaultValue={accountType}
                  >
                    <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-muted text-base">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="SAVINGS">Savings Account</SelectItem>
                      <SelectItem value="CURRENT">Current Account</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.account_type && (
                    <p className="text-destructive text-xs ml-1">
                      {errors.account_type}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold rounded-[1.5rem] transition-all duration-300 active:scale-[0.98] shadow-lg shadow-primary/25 hover:shadow-primary/40 bg-primary"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Wallet...
                    </>
                  ) : (
                    "Create My Wallet"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </main>
      </div>
    </AppLayout>
  );
};

export default CreateWallet;
