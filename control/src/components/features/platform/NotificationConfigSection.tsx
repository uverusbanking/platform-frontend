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
  useGetOrgNotificationConfigs,
  useUpsertOrgNotificationConfig,
  useRemoveOrgNotificationConfig,
} from "@/hooks/queries/useOrganisationQueries";
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
  SMS: ["BULK_SMS_NIGERIA", "AFRICAS_TALKING", "MSA", "TERMII", "TWILIO"],
  EMAIL: ["SENDGRID", "MAILGUN", "SMTP"],
  WHATSAPP: ["MSA", "META_CLOUD"],
  PUSH: ["FIREBASE"],
};

const PROVIDER_LABELS: Record<NotificationProviderType, string> = {
  BULK_SMS_NIGERIA: "BulkSMS Nigeria",
  AFRICAS_TALKING: "Africa's Talking",
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
  orgId: string;
  existing?: INotificationConfig;
  open: boolean;
  onClose: () => void;
}

function ConfigDialog({ orgId, existing, open, onClose }: ConfigDialogProps) {
  const isEdit = !!existing;
  const { mutate, isPending } = useUpsertOrgNotificationConfig(orgId);

  const [channel, setChannel] = useState<NotificationChannel>(
    existing?.channel ?? "SMS",
  );
  const [providerType, setProviderType] = useState<NotificationProviderType>(
    existing?.provider_type ?? "BULK_SMS_NIGERIA",
  );
  const [apiKey, setApiKey] = useState("");
  const [senderId, setSenderId] = useState(existing?.metadata?.sender_id ?? "");
  const [atUsername, setAtUsername] = useState(
    existing?.metadata?.username ?? "",
  );

  const availableProviders = PROVIDERS_BY_CHANNEL[channel];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const meta: Record<string, string> = {};
    if (senderId) meta.sender_id = senderId;
    if (providerType === "AFRICAS_TALKING" && atUsername)
      meta.username = atUsername;
    const payload: IUpsertNotificationConfigPayload = {
      provider_type: providerType,
      ...(apiKey ? { api_key: apiKey } : {}),
      ...(Object.keys(meta).length ? { metadata: meta } : {}),
    };
    mutate(
      { channel, payload },
      {
        onSuccess: () => {
          toast.success(`${channelMeta(channel).label} config saved`);
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
          {isEdit ? "Update" : "Add"} Notification Override
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

          {providerType === "AFRICAS_TALKING" && (
            <div className="space-y-1.5">
              <Label>
                Username
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  (Africa&apos;s Talking account username)
                </span>
              </Label>
              <Input
                placeholder='e.g. myapp (or "sandbox" for testing)'
                value={atUsername}
                onChange={(e) => setAtUsername(e.target.value)}
                className="rounded-xl"
                required={providerType === "AFRICAS_TALKING" && !isEdit}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label>
              Sender ID
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (optional — org-specific)
              </span>
            </Label>
            <Input
              placeholder="e.g. OrgName"
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

interface ConfigRowProps {
  config: INotificationConfig;
  orgId: string;
}

function ConfigRow({ config, orgId }: ConfigRowProps) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: remove, isPending: removing } =
    useRemoveOrgNotificationConfig(orgId);
  const meta = channelMeta(config.channel);

  return (
    <>
      <div className="flex items-center gap-4 py-3 border-b border-border/40 last:border-0">
        <Badge
          variant="outline"
          className={`text-xs font-semibold shrink-0 ${meta.color}`}
        >
          {meta.label}
        </Badge>

        <div className="flex-1 min-w-0 text-xs text-muted-foreground space-y-0.5">
          <div className="font-medium text-foreground">
            {PROVIDER_LABELS[config.provider_type]}
          </div>
          <div className="flex items-center gap-3">
            <span>{config.has_api_key ? "API key set" : "No API key"}</span>
            {config.metadata?.sender_id && (
              <span className="font-mono">
                Sender: {config.metadata.sender_id}
              </span>
            )}
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
                  toast.success(`${meta.label} override removed`),
                onError: () => toast.error("Failed to remove override"),
              })
            }
            disabled={removing}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <ConfigDialog
        orgId={orgId}
        existing={config}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}

interface NotificationConfigSectionProps {
  organisationId: string;
}

export function NotificationConfigSection({
  organisationId,
}: NotificationConfigSectionProps) {
  const [addOpen, setAddOpen] = useState(false);
  const { data, isLoading } = useGetOrgNotificationConfigs(organisationId);
  const configs = data?.data ?? [];

  return (
    <>
      <Card className="border-none shadow-lg bg-card/80">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notification Overrides
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg h-8 text-xs gap-1.5"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Override
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : configs.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
              No channel overrides. Uses platform defaults.
              <br />
              <button
                onClick={() => setAddOpen(true)}
                className="text-primary hover:underline mt-1 inline-block"
              >
                Add an override
              </button>
            </div>
          ) : (
            <div>
              {configs.map((c) => (
                <ConfigRow key={c.id} config={c} orgId={organisationId} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfigDialog
        orgId={organisationId}
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
    </>
  );
}
