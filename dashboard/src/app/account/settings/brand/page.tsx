"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import {
  Loader2,
  Palette,
  Globe,
  Plus,
  Trash2,
  Shield,
  Link2,
  Search,
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

import { useUserStore } from "@/state/userStore";
import {
  useGetBrandSettings,
  useGetConfiguredDomains,
} from "@/hooks/queries/useOrganisationQueries";
import {
  useUpdateBrandSettings,
  useUpdateConfiguredDomains,
} from "@/hooks/mutations/useOrganisationMutations";
import { IUpdateBrandSettingsPayload } from "@/types/organisation.types";

const inputCls =
  "bg-muted/30 border-transparent focus:border-orange-500/20 focus:bg-background transition-all h-11";

const labelCls =
  "text-xs uppercase tracking-wider text-muted-foreground font-semibold";

interface BrandFormValues extends IUpdateBrandSettingsPayload {
  seo: { title: string; description: string; author: string };
}

interface DomainsFormValues {
  domains: { name: string; url: string }[];
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

export default function BrandSettingsPage() {
  const { userData } = useUserStore();
  const isOwner = userData?.role?.toUpperCase() === "BRAND_OWNER";

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
  const { mutate: saveBrand, isPending: savingBrand } =
    useUpdateBrandSettings();
  const { mutate: saveDomains, isPending: savingDomains } =
    useUpdateConfiguredDomains();

  const brandForm = useForm<BrandFormValues>();
  const domainsForm = useForm<DomainsFormValues>({
    defaultValues: { domains: [] },
  });
  const { fields, append, remove } = useFieldArray({
    control: domainsForm.control,
    name: "domains",
  });

  useEffect(() => {
    if (brandData?.data) {
      const b = brandData.data;
      brandForm.reset({
        brandName: b.brandName ?? "",
        shortBrandName: b.shortBrandName ?? "",
        brandLogoUrl: b.brandLogoUrl ?? "",
        primaryColor: b.primaryColor ?? "",
        secondaryColor: b.secondaryColor ?? "",
        supportEmail: b.supportEmail ?? "",
        supportPhone: b.supportPhone ?? "",
        websiteUrl: b.websiteUrl ?? "",
        privacyUrl: b.privacyUrl ?? "",
        termsUrl: b.termsUrl ?? "",
        seo: {
          title: b.seo?.title ?? "",
          description: b.seo?.description ?? "",
          author: b.seo?.author ?? "",
        },
      });
    }
  }, [brandData, brandForm]);

  useEffect(() => {
    const domains = domainsData?.data?.configured_domains ?? [];
    domainsForm.reset({
      domains: domains.map((d) => ({ name: d.name, url: d.url })),
    });
  }, [domainsData, domainsForm]);

  const onSaveBrand = (values: BrandFormValues) => {
    saveBrand(values, {
      onSuccess: () => toast.success("Brand settings saved"),
      onError: () => toast.error("Failed to save brand settings"),
    });
  };

  const onSaveDomains = (values: DomainsFormValues) => {
    saveDomains(
      { configured_domains: values.domains },
      {
        onSuccess: () => toast.success("Domains saved"),
        onError: () => toast.error("Failed to save domains"),
      },
    );
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

            <div className="space-y-2">
              <Label className={labelCls}>Logo URL</Label>
              <Input
                disabled={!isOwner}
                placeholder="https://cdn.example.com/logo.png"
                className={inputCls}
                {...brandForm.register("brandLogoUrl")}
              />
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
                Register the domains your application is deployed on.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <form
            onSubmit={domainsForm.handleSubmit(onSaveDomains)}
            className="space-y-4"
          >
            {fields.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center rounded-xl border border-dashed border-border/60 bg-muted/20">
                <Link2 className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  {domainsError
                    ? "Could not load domains. Add one below."
                    : "No domains configured yet."}
                </p>
                {isOwner && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", url: "" })}
                  >
                    <Plus className="w-3 h-3 mr-1.5" />
                    Add Domain
                  </Button>
                )}
              </div>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <div className="space-y-1.5">
                    {index === 0 && (
                      <Label className={labelCls}>Environment</Label>
                    )}
                    <Input
                      disabled={!isOwner}
                      placeholder="production"
                      className={inputCls}
                      {...domainsForm.register(`domains.${index}.name`)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    {index === 0 && <Label className={labelCls}>URL</Label>}
                    <Input
                      disabled={!isOwner}
                      placeholder="https://app.example.com"
                      className={inputCls}
                      {...domainsForm.register(`domains.${index}.url`)}
                    />
                  </div>
                </div>
                {isOwner && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`text-destructive hover:bg-destructive/10 shrink-0 ${index === 0 ? "mt-6" : ""}`}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            {isOwner && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed"
                  onClick={() => append({ name: "", url: "" })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Domain
                </Button>

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
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
