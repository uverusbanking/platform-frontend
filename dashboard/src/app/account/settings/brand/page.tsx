"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Loader2,
  Palette,
  Globe,
  Shield,
  Link2,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  IConfiguredDomains,
  IDomainVerificationStatus,
  DomainVerificationStatus,
} from "@/types/organisation.types";

import { useUserStore } from "@/state/userStore";
import {
  useGetBrandSettings,
  useGetConfiguredDomains,
  useGetDomainVerificationStatuses,
} from "@/hooks/queries/useOrganisationQueries";
import {
  useUpdateBrandSettings,
  useUpdateConfiguredDomains,
  useInitiateDomainVerification,
  useCheckDomainVerification,
} from "@/hooks/mutations/useOrganisationMutations";
import { uploadFile } from "@/hooks/endpoints/useFile";
import { IUpdateBrandSettingsPayload } from "@/types/organisation.types";

const inputCls =
  "bg-muted/30 border-transparent focus:border-orange-500/20 focus:bg-background transition-all h-11";

const labelCls =
  "text-xs uppercase tracking-wider text-muted-foreground font-semibold";

// Icon: 1024×1024px, no transparency — scales to iOS/Android/PWA icons
// Logo: min 800×200px (4:1 ratio), transparency OK — used in nav bars / headers
const IMAGE_SPECS = {
  icon: {
    label: "Brand Icon",
    hint: "Square app icon — 1024×1024px min, PNG/JPG, ≤2 MB. Used as iOS, Android, and web app icon.",
    minW: 1024,
    minH: 1024,
    maxMB: 2,
    accept: "image/png,image/jpeg",
    types: "PNG/JPG",
    aspectHint: "1:1 (square)",
  },
  logo: {
    label: "Brand Logo",
    hint: "Horizontal logo — min 800×200px, PNG with transparency, ≤2 MB. Used in navigation bars and headers.",
    minW: 800,
    minH: 200,
    maxMB: 2,
    accept: "image/png",
    types: "PNG",
    aspectHint: "4:1 recommended",
  },
} as const;

type ImageField = keyof typeof IMAGE_SPECS;

function validateImageFile(
  file: File,
  spec: (typeof IMAGE_SPECS)[ImageField],
): Promise<string | null> {
  return new Promise((resolve) => {
    if (file.size > spec.maxMB * 1024 * 1024) {
      resolve(`File must be ≤${spec.maxMB} MB`);
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.naturalWidth < spec.minW || img.naturalHeight < spec.minH) {
        resolve(
          `Image must be at least ${spec.minW}×${spec.minH}px (got ${img.naturalWidth}×${img.naturalHeight}px)`,
        );
      } else {
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("Could not read image dimensions");
    };
    img.src = url;
  });
}

interface ImageUploadFieldProps {
  field: ImageField;
  value: string | undefined;
  onChange: (url: string) => void;
  disabled?: boolean;
}

function ImageUploadField({
  field,
  value,
  onChange,
  disabled,
}: ImageUploadFieldProps) {
  const spec = IMAGE_SPECS[field];
  const inputRef = useRef<HTMLInputElement>(null);
  const [staged, setStaged] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [validating, setValidating] = useState(false);

  const handleFileSelect = async (file: File) => {
    setValidating(true);
    const error = await validateImageFile(file, spec);
    setValidating(false);
    if (error) {
      toast.error(error);
      return;
    }
    setStaged(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!staged) return;
    setUploading(true);
    const loading = toast.loading("Uploading image…");
    try {
      const res = await uploadFile({
        file: staged,
        documentType: field === "icon" ? "BRAND_ICON" : "BRAND_LOGO",
        userType: "ORGANISATION",
      });
      onChange(res.data.file_url);
      toast.success("Image uploaded", { id: loading });
      setStaged(null);
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
    } catch {
      toast.error("Upload failed", { id: loading });
    } finally {
      setUploading(false);
    }
  };

  const handleClearStaged = () => {
    setStaged(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const isSquare = field === "icon";
  const previewSrc = preview ?? value;
  const busy = uploading || validating;

  return (
    <div className="space-y-1.5">
      <p className="text-[11px] text-muted-foreground">{spec.hint}</p>
      <div
        className={`relative border-2 border-dashed rounded-xl transition-colors ${
          disabled
            ? "opacity-60 pointer-events-none"
            : staged
              ? "border-amber-400/60 bg-amber-400/5"
              : value
                ? "border-success/40 bg-success/5"
                : "border-border/60 hover:border-primary/40 bg-muted/20"
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={spec.accept}
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />

        {previewSrc ? (
          <div className="flex items-center gap-4 p-4">
            <div
              className={`overflow-hidden rounded-lg border border-border/40 bg-checkered shrink-0 ${
                isSquare ? "w-14 h-14" : "w-28 h-10"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc}
                alt={spec.label}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              {staged ? (
                <p className="text-xs font-medium text-amber-600 truncate">
                  {staged.name}{" "}
                  <span className="text-muted-foreground">(pending)</span>
                </p>
              ) : (
                <p className="text-xs font-medium text-success">Uploaded</p>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {spec.aspectHint}
              </p>
            </div>
            {!disabled && (
              <div className="flex items-center gap-2 shrink-0">
                {staged ? (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      disabled={busy}
                      onClick={handleUpload}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {uploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "Confirm"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={handleClearStaged}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                  >
                    Replace
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="w-full flex flex-col items-center gap-2 py-6 px-4 text-center disabled:cursor-not-allowed"
            onClick={() => inputRef.current?.click()}
            disabled={busy || disabled}
          >
            {busy ? (
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">
              {validating ? "Validating…" : `Click or drag ${spec.types} here`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="h-px bg-border/40 flex-1" />
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2">
        {label}
      </span>
      <div className="h-px bg-border/40 flex-1" />
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
      title="Copy"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function VerificationBadge({ status }: { status: DomainVerificationStatus }) {
  if (status === "VERIFIED")
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
        <CheckCircle2 className="w-3 h-3" /> Verified
      </Badge>
    );
  if (status === "PENDING")
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 gap-1">
        <Clock className="w-3 h-3" /> Pending
      </Badge>
    );
  if (status === "FAILED")
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 gap-1">
        <AlertCircle className="w-3 h-3" /> Failed
      </Badge>
    );
  return (
    <Badge variant="secondary" className="text-muted-foreground gap-1">
      <AlertCircle className="w-3 h-3" /> Not verified
    </Badge>
  );
}

const EMAIL_SPF_HINT = `v=spf1 include:mail.zeptomail.com ~all`;
const EMAIL_DMARC_HINT = (domain: string) =>
  `v=DMARC1; p=none; rua=mailto:dmarc@${domain}`;

interface VerifyDomainSheetProps {
  domainKey: "PERSONAL_APP" | "CORPORATE_APP" | "EMAIL";
  domainLabel: string;
  domainUrl: string;
  verificationRecord: IDomainVerificationStatus | undefined;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

function VerifyDomainSheet({
  domainKey,
  domainLabel,
  domainUrl,
  verificationRecord,
  open,
  onOpenChange,
}: VerifyDomainSheetProps) {
  const {
    mutate: initiate,
    isPending: initiating,
    data: initiateData,
  } = useInitiateDomainVerification();
  const {
    mutate: check,
    isPending: checking,
    data: checkData,
  } = useCheckDomainVerification();

  const dnsInfo =
    initiateData?.data ??
    (verificationRecord?.txt_host
      ? {
          txt_host: verificationRecord.txt_host,
          txt_value: verificationRecord.txt_value ?? "",
          already_verified:
            verificationRecord.verification_status === "VERIFIED",
        }
      : null);

  const lastStatus =
    checkData?.data?.status ?? verificationRecord?.verification_status;

  useEffect(() => {
    if (open && !dnsInfo) {
      initiate(domainKey.toLowerCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            Verify {domainLabel}
          </SheetTitle>
          <SheetDescription>
            Add the DNS TXT record below to prove ownership of{" "}
            <strong>{domainUrl}</strong>.
          </SheetDescription>
        </SheetHeader>

        {initiating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating verification record…
          </div>
        )}

        {dnsInfo && (
          <div className="space-y-5">
            {dnsInfo.already_verified ? (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">
                  Domain is already verified.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-border/60 overflow-hidden text-sm">
                  <div className="bg-muted/30 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Add this TXT record to your DNS
                  </div>
                  <div className="divide-y divide-border/40">
                    {[
                      { label: "Type", value: "TXT" },
                      { label: "Host / Name", value: dnsInfo.txt_host ?? "" },
                      { label: "Value", value: dnsInfo.txt_value ?? "" },
                      { label: "TTL", value: "300" },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-start justify-between gap-3 px-4 py-3"
                      >
                        <span className="text-muted-foreground shrink-0 w-24">
                          {label}
                        </span>
                        <span className="font-mono text-xs break-all text-right flex items-center gap-1">
                          {value}
                          <CopyButton text={value} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  DNS changes can take up to 48 hours to propagate. After adding
                  the record, click <strong>Check Verification</strong> — you
                  can retry as many times as needed.
                </p>

                {lastStatus === "VERIFIED" && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Domain verified successfully!
                  </div>
                )}
                {lastStatus === "FAILED" && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Record not found yet. Check the values and try again.
                  </div>
                )}

                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-11 rounded-xl"
                  disabled={checking || lastStatus === "VERIFIED"}
                  onClick={() => check(domainKey.toLowerCase())}
                >
                  {checking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking…
                    </>
                  ) : (
                    "Check Verification"
                  )}
                </Button>
              </>
            )}

            {/* Email-specific delivery records */}
            {domainKey === "EMAIL" && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="h-px bg-border/40 flex-1" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2">
                    Email Delivery Records
                  </span>
                  <div className="h-px bg-border/40 flex-1" />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Add these records to improve deliverability. SPF and DMARC are
                  required; DKIM will be provided after ZeptoMail onboarding.
                </p>
                <div className="rounded-xl border border-border/60 overflow-hidden text-sm">
                  <div className="bg-muted/30 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    SPF Record
                  </div>
                  <div className="divide-y divide-border/40">
                    {[
                      { label: "Type", value: "TXT" },
                      { label: "Host / Name", value: domainUrl },
                      { label: "Value", value: EMAIL_SPF_HINT },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-start justify-between gap-3 px-4 py-3"
                      >
                        <span className="text-muted-foreground shrink-0 w-24">
                          {label}
                        </span>
                        <span className="font-mono text-xs break-all text-right flex items-center gap-1">
                          {value}
                          <CopyButton text={value} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 overflow-hidden text-sm">
                  <div className="bg-muted/30 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    DMARC Record
                  </div>
                  <div className="divide-y divide-border/40">
                    {[
                      { label: "Type", value: "TXT" },
                      { label: "Host / Name", value: `_dmarc.${domainUrl}` },
                      { label: "Value", value: EMAIL_DMARC_HINT(domainUrl) },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-start justify-between gap-3 px-4 py-3"
                      >
                        <span className="text-muted-foreground shrink-0 w-24">
                          {label}
                        </span>
                        <span className="font-mono text-xs break-all text-right flex items-center gap-1">
                          {value}
                          <CopyButton text={value} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function extractApiErrors(err: unknown): { message: string; errors: string[] } {
  const data = (
    err as { response?: { data?: { message?: string; errors?: unknown[] } } }
  )?.response?.data;
  return {
    message: data?.message ?? "Something went wrong",
    errors: Array.isArray(data?.errors) ? (data.errors as string[]) : [],
  };
}

interface BrandFormValues extends IUpdateBrandSettingsPayload {
  seo: { title: string; description: string; author: string };
}

type DomainsFormValues = IConfiguredDomains;

export default function BrandSettingsPage() {
  const { userData } = useUserStore();
  const isOwner = userData?.role?.toUpperCase() === "ORGANISATION_OWNER";

  const [verifyingDomain, setVerifyingDomain] = useState<
    "PERSONAL_APP" | "CORPORATE_APP" | "EMAIL" | null
  >(null);

  const {
    data: brandData,
    isLoading: brandLoading,
    isError: brandError,
  } = useGetBrandSettings();
  const {
    data: domainsData,
    isLoading: domainsLoading,
    isError: domainsError,
  } = useGetConfiguredDomains();
  const { data: verificationData } = useGetDomainVerificationStatuses();
  const { mutate: saveBrand, isPending: savingBrand } =
    useUpdateBrandSettings();
  const { mutate: saveDomains, isPending: savingDomains } =
    useUpdateConfiguredDomains();

  const verificationMap = Object.fromEntries(
    (verificationData?.data ?? []).map((v) => [v.type, v]),
  ) as Partial<Record<string, IDomainVerificationStatus>>;

  const brandForm = useForm<BrandFormValues>();
  const domainsForm = useForm<DomainsFormValues>({
    defaultValues: {
      personal_app: "",
      corporate_app: "",
      marketing: "",
      email: "",
    },
  });

  useEffect(() => {
    if (brandData?.data) {
      const b = brandData.data;
      brandForm.reset({
        brandName: b.brandName ?? "",
        shortBrandName: b.shortBrandName ?? "",
        brandLogoUrl: b.brandLogoUrl ?? "",
        brandIconUrl: b.brandIconUrl ?? "",
        primaryColor: b.primaryColor ?? "",
        secondaryColor: b.secondaryColor ?? "",
        supportEmail: b.supportEmail ?? "",
        supportPhone: b.supportPhone ?? "",
        websiteUrl: b.websiteUrl ?? "",
        privacyUrl: b.privacyUrl ?? "",
        termsUrl: b.termsUrl ?? "",
        emailSenderName: b.emailSenderName ?? "",
        seo: {
          title: b.seo?.title ?? "",
          description: b.seo?.description ?? "",
          author: b.seo?.author ?? "",
        },
      });
    }
  }, [brandData, brandForm]);

  useEffect(() => {
    const d = domainsData?.data?.configured_domains ?? {};
    domainsForm.reset({
      personal_app: d.personal_app ?? "",
      corporate_app: d.corporate_app ?? "",
      marketing: d.marketing ?? "",
      email: d.email ?? "",
    });
  }, [domainsData, domainsForm]);

  const onSaveBrand = (values: BrandFormValues) => {
    saveBrand(values, {
      onSuccess: () => toast.success("Brand settings saved"),
      onError: (err) => {
        const { message, errors } = extractApiErrors(err);
        const items = errors.length > 0 ? errors : [message];
        toast.error("Failed to save brand settings", {
          description: (
            <ul className="mt-1 space-y-0.5">
              {items.map((e, i) => (
                <li key={i} className="text-xs">
                  · {e}
                </li>
              ))}
            </ul>
          ),
          duration: 6000,
        });
      },
    });
  };

  const onSaveDomains = (values: DomainsFormValues) => {
    // Filter out empty strings before sending
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(
        ([_, v]) => v !== "" && v !== null && v !== undefined,
      ),
    ) as DomainsFormValues;

    saveDomains(filteredValues, {
      onSuccess: () => toast.success("Domain configurations saved"),
      onError: (err) => {
        const { message, errors } = extractApiErrors(err);
        const items = errors.length > 0 ? errors : [message];
        toast.error("Failed to save domain configurations", {
          description: (
            <ul className="mt-1 space-y-0.5">
              {items.map((e, i) => (
                <li key={i} className="text-xs">
                  · {e}
                </li>
              ))}
            </ul>
          ),
          duration: 6000,
        });
      },
    });
  };

  if (brandLoading || domainsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[500px] w-full rounded-xl" />
        <Skeleton className="h-[240px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Brand Identity & Contact */}
      <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-600">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">
                  Brand Settings
                </CardTitle>
                <CardDescription>
                  Identity, colours, contact info, and SEO metadata for your
                  app.
                </CardDescription>
              </div>
            </div>
            {!isOwner && (
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-700 border-orange-200"
              >
                <Shield className="w-3 h-3 mr-1" />
                View Only
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          {(brandError || !brandData?.data) && !brandLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-8 mb-6 text-center rounded-xl border border-dashed border-border/60 bg-muted/20">
              <Palette className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {brandError
                  ? "Could not load brand settings. Fill in the form below to configure."
                  : "No brand configuration set yet. Fill in the form below to get started."}
              </p>
            </div>
          )}
          <form
            onSubmit={brandForm.handleSubmit(onSaveBrand)}
            className="space-y-6"
          >
            <SectionDivider label="Brand Images" />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label className={labelCls}>Brand Icon</Label>
                <ImageUploadField
                  field="icon"
                  value={brandForm.watch("brandIconUrl") || undefined}
                  onChange={(url) => brandForm.setValue("brandIconUrl", url)}
                  disabled={!isOwner}
                />
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Brand Logo</Label>
                <ImageUploadField
                  field="logo"
                  value={brandForm.watch("brandLogoUrl") || undefined}
                  onChange={(url) => brandForm.setValue("brandLogoUrl", url)}
                  disabled={!isOwner}
                />
              </div>
            </div>

            <SectionDivider label="Identity" />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label className={labelCls}>Brand Name</Label>
                <Input
                  disabled={!isOwner}
                  placeholder="Acme Pay"
                  className={inputCls}
                  {...brandForm.register("brandName")}
                />
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Short Brand Name</Label>
                <Input
                  disabled={!isOwner}
                  placeholder="Acme"
                  className={inputCls}
                  {...brandForm.register("shortBrandName")}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label className={labelCls}>Primary Colour</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    disabled={!isOwner}
                    {...brandForm.register("primaryColor")}
                    className="w-11 h-11 rounded-lg border border-border/60 cursor-pointer p-1 bg-background disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Input
                    disabled={!isOwner}
                    placeholder="#0052FF"
                    className={inputCls}
                    {...brandForm.register("primaryColor")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Secondary Colour</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    disabled={!isOwner}
                    {...brandForm.register("secondaryColor")}
                    className="w-11 h-11 rounded-lg border border-border/60 cursor-pointer p-1 bg-background disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Input
                    disabled={!isOwner}
                    placeholder="#6B7280"
                    className={inputCls}
                    {...brandForm.register("secondaryColor")}
                  />
                </div>
              </div>
            </div>

            <SectionDivider label="Contact & Links" />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label className={labelCls}>Support Email</Label>
                <Input
                  type="email"
                  disabled={!isOwner}
                  placeholder="support@example.com"
                  className={inputCls}
                  {...brandForm.register("supportEmail")}
                />
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Support Phone</Label>
                <Input
                  disabled={!isOwner}
                  placeholder="+234..."
                  className={inputCls + " font-mono"}
                  {...brandForm.register("supportPhone")}
                />
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Website URL</Label>
                <Input
                  disabled={!isOwner}
                  placeholder="https://example.com"
                  className={inputCls}
                  {...brandForm.register("websiteUrl")}
                />
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Privacy Policy URL</Label>
                <Input
                  disabled={!isOwner}
                  placeholder="https://example.com/privacy"
                  className={inputCls}
                  {...brandForm.register("privacyUrl")}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className={labelCls}>Terms of Service URL</Label>
                <Input
                  disabled={!isOwner}
                  placeholder="https://example.com/terms"
                  className={inputCls}
                  {...brandForm.register("termsUrl")}
                />
              </div>
            </div>

            <SectionDivider label="Email" />

            <div className="space-y-2">
              <Label className={labelCls}>Email Sender Name</Label>
              <Input
                disabled={!isOwner}
                placeholder="Acme Pay"
                className={inputCls}
                {...brandForm.register("emailSenderName")}
              />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Display name shown in the &ldquo;From&rdquo; field on emails
                sent to your customers. Requires a verified Email Send-From
                Domain below.
              </p>
            </div>

            <SectionDivider label="SEO Metadata" />

            <div className="space-y-2">
              <Label className={labelCls}>Page Title</Label>
              <Input
                disabled={!isOwner}
                placeholder="Acme Pay — Digital Banking"
                className={inputCls}
                {...brandForm.register("seo.title")}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Author</Label>
              <Input
                disabled={!isOwner}
                placeholder="Acme Corp."
                className={inputCls}
                {...brandForm.register("seo.author")}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelCls}>Meta Description</Label>
              <Textarea
                disabled={!isOwner}
                placeholder="Secure digital banking and instant transfers."
                className="bg-muted/30 border-transparent focus:border-orange-500/20 focus:bg-background transition-all min-h-[80px] resize-none leading-relaxed"
                {...brandForm.register("seo.description")}
              />
            </div>

            {isOwner && (
              <div className="flex justify-end pt-4 border-t border-border/40">
                <Button
                  type="submit"
                  disabled={savingBrand}
                  className="min-w-[150px] shadow-sm bg-orange-600 hover:bg-orange-700 text-white font-bold h-11 rounded-xl"
                >
                  {savingBrand ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Brand Settings"
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Configured Domains */}
      <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                Configured Domains
              </CardTitle>
              <CardDescription>
                Register domains for your organisation. Personal App and
                Corporate App domains must be verified before customers can log
                in.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <form
            onSubmit={domainsForm.handleSubmit(onSaveDomains)}
            className="space-y-4"
          >
            {domainsError && (
              <div className="flex flex-col items-center justify-center gap-3 py-6 text-center rounded-xl border border-dashed border-border/60 bg-muted/20">
                <Link2 className="h-7 w-7 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  Could not load domains. You can still update them below.
                </p>
              </div>
            )}

            {[
              {
                key: "personal_app" as const,
                domainType: "PERSONAL_APP" as const,
                label: "Personal App Domain",
                placeholder: "app.example.com",
                verifiable: true,
              },
              {
                key: "corporate_app" as const,
                domainType: "CORPORATE_APP" as const,
                label: "Corporate App Domain",
                placeholder: "business.example.com",
                verifiable: true,
              },
              {
                key: "marketing" as const,
                domainType: null,
                label: "Marketing / Root Domain",
                placeholder: "example.com",
                verifiable: false,
              },
              {
                key: "email" as const,
                domainType: "EMAIL" as const,
                label: "Email Send-From Domain",
                placeholder: "mail.example.com",
                verifiable: true,
              },
            ].map(({ key, domainType, label, placeholder, verifiable }) => {
              const rec = domainType ? verificationMap[domainType] : undefined;
              const currentUrl = domainsForm.watch(key);
              const canVerify = verifiable && !!currentUrl;
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className={labelCls}>
                      <span className="inline-flex items-center gap-1.5">
                        <Globe className="w-3 h-3" />
                        {label}
                      </span>
                    </Label>
                    <div className="flex items-center gap-2">
                      {rec && (
                        <VerificationBadge status={rec.verification_status} />
                      )}
                      {canVerify &&
                        isOwner &&
                        domainType !== "MARKETING" &&
                        domainType && (
                          <button
                            type="button"
                            onClick={() =>
                              setVerifyingDomain(
                                domainType as
                                  | "PERSONAL_APP"
                                  | "CORPORATE_APP"
                                  | "EMAIL",
                              )
                            }
                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                          >
                            {rec?.verification_status === "VERIFIED"
                              ? "View record"
                              : rec?.verification_status === "PENDING" ||
                                  rec?.verification_status === "FAILED"
                                ? "Retry"
                                : "Verify"}
                          </button>
                        )}
                    </div>
                  </div>
                  <Input
                    disabled={!isOwner}
                    placeholder={placeholder}
                    className={inputCls}
                    {...domainsForm.register(key)}
                  />
                </div>
              );
            })}

            {isOwner && (
              <div className="flex justify-end pt-4 border-t border-border/40">
                <Button
                  type="submit"
                  disabled={savingDomains}
                  className="min-w-[150px] shadow-sm bg-orange-600 hover:bg-orange-700 text-white font-bold h-11 rounded-xl"
                >
                  {savingDomains ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Domains"
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Verification sheet */}
      {verifyingDomain && (
        <VerifyDomainSheet
          domainKey={verifyingDomain}
          domainLabel={
            verifyingDomain === "PERSONAL_APP"
              ? "Personal App Domain"
              : verifyingDomain === "CORPORATE_APP"
                ? "Corporate App Domain"
                : "Email Send-From Domain"
          }
          domainUrl={
            (verifyingDomain === "PERSONAL_APP"
              ? domainsForm.getValues("personal_app")
              : verifyingDomain === "CORPORATE_APP"
                ? domainsForm.getValues("corporate_app")
                : domainsForm.getValues("email")) ?? ""
          }
          verificationRecord={verificationMap[verifyingDomain]}
          open={!!verifyingDomain}
          onOpenChange={(v) => !v && setVerifyingDomain(null)}
        />
      )}
    </div>
  );
}
