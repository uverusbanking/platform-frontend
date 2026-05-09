"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Bell, Wallet } from "lucide-react";
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
  useGetPlatformNotificationConfigs,
  useUpsertPlatformNotificationConfig,
  useRemovePlatformNotificationConfig,
  useGetPlatformNotificationBalance,
} from "@/hooks/queries/usePlatformQueries";
import type {
  NotificationChannel,
  NotificationProviderType,
  INotificationConfig,
  IUpsertNotificationConfigPayload,
} from "@/hooks/endpoints/usePlatform";

const CHANNELS: { value: NotificationChannel; label: string; color: string }[] =
  [
    {
      value: "SMS",
      label: "SMS",
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      value: "EMAIL",
      label: "Email",
      color: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    },
    {
      value: "WHATSAPP",
      label: "WhatsApp",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    {
      value: "PUSH",
      label: "Push",
      color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    },
  ];

const PROVIDERS_BY_CHANNEL: Record<
  NotificationChannel,
  NotificationProviderType[]
> = {
  SMS: ["BULK_SMS_NIGERIA", "MSA", "TERMII", "TWILIO"],
  EMAIL: ["SENDGRID", "MAILGUN", "SMTP"],
  WHATSAPP: ["MSA", "META_CLOUD"],
  PUSH: ["FIREBASE"],
};

const PROVIDER_LABELS: Record<NotificationProviderType, string> = {
  BULK_SMS_NIGERIA: "BulkSMS Nigeria",
  MSA: "MyServiceAgent",
  TERMII: "Termii",
  TWILIO: "Twilio",
  SENDGRID: "SendGrid",
  MAILGUN: "Mailgun",
  SMTP: "SMTP",
  META_CLOUD: "Meta Cloud API",
  FIREBASE: "Firebase",
};

function channelMeta(channel: NotificationChannel) {
  return CHANNELS.find((c) => c.value === channel) ?? CHANNELS[0];
}

interface ConfigDialogProps {
  existing?: INotificationConfig;
  open: boolean;
  onClose: () => void;
}

function ConfigDialog({ existing, open, onClose }: ConfigDialogProps) {
  const isEdit = !!existing;
  const { mutate, isPending } = useUpsertPlatformNotificationConfig();

  const [channel, setChannel] = useState<NotificationChannel>(
    existing?.channel ?? "SMS",
  );
  const [providerType, setProviderType] = useState<NotificationProviderType>(
    existing?.provider_type ?? "BULK_SMS_NIGERIA",
  );
  const [apiKey, setApiKey] = useState("");
  const [senderId, setSenderId] = useState(existing?.metadata?.sender_id ?? "");

  const availableProviders = PROVIDERS_BY_CHANNEL[channel];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: IUpsertNotificationConfigPayload = {
      provider_type: providerType,
      ...(apiKey ? { api_key: apiKey } : {}),
      ...(senderId ? { metadata: { sender_id: senderId } } : {}),
    };
    mutate(
      { channel, payload },
      {
        onSuccess: () => {
          toast.success(`${channelMeta(channel).label} configuration saved`);
          onClose();
        },
        onError: () => toast.error("Failed to save configuration"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogTitle>
          {isEdit ? "Update" : "Add"} Notification Channel
        </DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Channel</Label>
            {isEdit ? (
              <div className="flex items-center gap-2 h-10 px-3 rounded-xl border bg-muted/50">
                <Badge
                  variant="outline"
                  className={`text-xs ${channelMeta(existing!.channel).color}`}
                >
                  {channelMeta(existing!.channel).label}
                </Badge>
              </div>
            ) : (
              <Select
                value={channel}
                onValueChange={(v) => {
                  const ch = v as NotificationChannel;
                  setChannel(ch);
                  setProviderType(PROVIDERS_BY_CHANNEL[ch][0]);
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANNELS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Provider</Label>
            <Select
              value={providerType}
              onValueChange={(v) =>
                setProviderType(v as NotificationProviderType)
              }
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableProviders.map((p) => (
                  <SelectItem key={p} value={p}>
                    {PROVIDER_LABELS[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>
              API Key
              {isEdit && (
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  (re-enter to update)
                </span>
              )}
            </Label>
            <Input
              type="password"
              placeholder={isEdit ? "Enter new key to update" : "API key…"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="rounded-xl font-mono text-sm"
              required={!isEdit}
            />
          </div>

          <div className="space-y-1.5">
            <Label>
              Default Sender ID
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              placeholder="e.g. PlatformName"
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              className="rounded-xl"
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

function BalanceBadge({ channel }: { channel: NotificationChannel }) {
  const [fetch, setFetch] = useState(false);
  const { data, isFetching } = useGetPlatformNotificationBalance(
    channel,
    fetch,
  );

  if (!fetch) {
    return (
      <button
        onClick={() => setFetch(true)}
        className="text-xs text-primary hover:underline"
      >
        Check balance
      </button>
    );
  }

  if (isFetching) {
    return <span className="text-xs text-muted-foreground">Loading…</span>;
  }

  const bal = data?.data;
  return bal ? (
    <span className="text-xs font-mono text-muted-foreground">
      <Wallet className="w-3 h-3 inline mr-1" />
      {bal.currency} {bal.value.toLocaleString()}
    </span>
  ) : (
    <span className="text-xs text-muted-foreground">N/A</span>
  );
}

interface ConfigRowProps {
  config: INotificationConfig;
}

function ConfigRow({ config }: ConfigRowProps) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: remove, isPending: removing } =
    useRemovePlatformNotificationConfig();
  const meta = channelMeta(config.channel);

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
          <div className="font-medium text-foreground text-sm">
            {PROVIDER_LABELS[config.provider_type]}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span>{config.has_api_key ? "API key set" : "No API key"}</span>
            {config.metadata?.sender_id && (
              <span className="font-mono">
                Sender: {config.metadata.sender_id}
              </span>
            )}
            {config.has_api_key && <BalanceBadge channel={config.channel} />}
          </div>
        </div>

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
            onClick={() =>
              remove(config.channel, {
                onSuccess: () =>
                  toast.success(`${meta.label} configuration removed`),
                onError: () => toast.error("Failed to remove configuration"),
              })
            }
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

export default function NotificationSettingsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const { data, isLoading } = useGetPlatformNotificationConfigs();
  const configs = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Configure the default notification channels and providers for this
          platform. Organisations can override individual channels.
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Notification Channels
            </CardTitle>
            <Button
              size="sm"
              className="rounded-xl gap-1.5"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Channel
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
                <Bell className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                No notification channels configured
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Add a channel to enable SMS, email, or other notifications.
              </p>
              <Button
                size="sm"
                className="rounded-xl gap-1.5"
                onClick={() => setAddOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Channel
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {configs.map((c) => (
                <ConfigRow key={c.id} config={c} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfigDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
