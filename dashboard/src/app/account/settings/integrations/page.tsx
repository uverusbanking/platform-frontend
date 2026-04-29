"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, ShieldCheck, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useGetPaymentConfigs,
  useUpsertPaymentConfig,
  useRemovePaymentConfig,
} from "@/hooks/queries/useOrganisationQueries";
import type {
  IPaymentConfig,
  IUpsertPaymentConfigPayload,
  PaymentProviderType,
} from "@/hooks/endpoints/useOrganisation";

const PROVIDERS: {
  value: PaymentProviderType;
  label: string;
  color: string;
}[] = [
  {
    value: "BUDPAY",
    label: "BudPay",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    value: "FLUTTERWAVE",
    label: "Flutterwave",
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
  {
    value: "PROVIDUS",
    label: "Providus",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    value: "MONNIFY",
    label: "Monnify",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  {
    value: "STRIPE",
    label: "Stripe",
    color: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  },
];

function providerMeta(type: PaymentProviderType) {
  return PROVIDERS.find((p) => p.value === type) ?? PROVIDERS[0];
}

interface ConfigDialogProps {
  existing?: IPaymentConfig;
  open: boolean;
  onClose: () => void;
}

function ConfigDialog({ existing, open, onClose }: ConfigDialogProps) {
  const isEdit = !!existing;
  const { mutate, isPending } = useUpsertPaymentConfig();

  const [providerType, setProviderType] = useState<PaymentProviderType>(
    existing?.provider_type ?? "BUDPAY",
  );
  const [secretKey, setSecretKey] = useState("");
  const [publicKey, setPublicKey] = useState(existing?.public_key ?? "");
  const [merchantId, setMerchantId] = useState(existing?.merchant_id ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey) {
      toast.error("Secret key is required");
      return;
    }
    const payload: IUpsertPaymentConfigPayload = {
      providerType,
      secretKey,
      ...(publicKey ? { publicKey } : {}),
      ...(merchantId ? { merchantId } : {}),
    };
    mutate(payload, {
      onSuccess: () => {
        toast.success(
          `${providerMeta(providerType).label} configuration saved`,
        );
        onClose();
      },
      onError: () => toast.error("Failed to save configuration"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogTitle>{isEdit ? "Update" : "Add"} Payment Provider</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Provider</Label>
            {isEdit ? (
              <div className="flex items-center gap-2 h-10 px-3 rounded-xl border bg-muted/50">
                <Badge
                  variant="outline"
                  className={`text-xs ${providerMeta(existing!.provider_type).color}`}
                >
                  {providerMeta(existing!.provider_type).label}
                </Badge>
              </div>
            ) : (
              <Select
                value={providerType}
                onValueChange={(v) => setProviderType(v as PaymentProviderType)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDERS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>
              Secret Key
              {isEdit && (
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  (re-enter to update)
                </span>
              )}
            </Label>
            <Input
              type="password"
              placeholder={
                isEdit ? "Enter new secret key to update" : "sk_live_…"
              }
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="rounded-xl font-mono text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>
              Public Key
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              placeholder="pk_live_…"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              className="rounded-xl font-mono text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label>
              Merchant ID
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              placeholder="merchant_…"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              className="rounded-xl font-mono text-sm"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl"
              disabled={isPending}
            >
              {isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProviderRow({ config }: { config: IPaymentConfig }) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: remove, isPending: removing } = useRemovePaymentConfig();
  const meta = providerMeta(config.provider_type);

  const handleRemove = () => {
    remove(config.provider_type, {
      onSuccess: () => toast.success(`${meta.label} configuration removed`),
      onError: () => toast.error("Failed to remove configuration"),
    });
  };

  return (
    <>
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/50">
        <Badge
          variant="outline"
          className={`text-xs font-semibold shrink-0 ${meta.color}`}
        >
          {meta.label}
        </Badge>

        <div className="flex-1 min-w-0 space-y-0.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3 h-3 shrink-0" />
            <span>
              {config.has_secret_key
                ? "Secret key configured"
                : "No secret key"}
            </span>
          </div>
          {config.public_key && (
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span className="font-mono truncate">
                {config.public_key.slice(0, 24)}…
              </span>
            </div>
          )}
          {config.merchant_id && (
            <div className="font-mono">Merchant: {config.merchant_id}</div>
          )}
        </div>

        <Badge
          variant="outline"
          className={`text-xs shrink-0 ${
            config.is_active
              ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
              : "text-muted-foreground"
          }`}
        >
          {config.is_active ? "Active" : "Inactive"}
        </Badge>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg"
            onClick={() => setEditOpen(true)}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleRemove}
            disabled={removing}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <ConfigDialog
        existing={config}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}

export default function IntegrationsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const { data, isLoading } = useGetPaymentConfigs();
  const configs = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Configure payment providers to process transactions for your
          customers.
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <KeyRound className="w-4.5 h-4.5 text-primary" />
              Payment Providers
            </CardTitle>
            <Button
              size="sm"
              className="rounded-xl gap-1.5"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Provider
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : configs.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                No payment providers configured
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Add a payment provider to enable transactions.
              </p>
              <Button
                size="sm"
                className="rounded-xl gap-1.5"
                onClick={() => setAddOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Provider
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {configs.map((c) => (
                <ProviderRow key={c.id} config={c} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfigDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
