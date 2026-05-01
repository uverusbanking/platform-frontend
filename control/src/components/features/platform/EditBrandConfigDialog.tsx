"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Palette, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  useUpdateBrandSettings,
  useUpdateConfiguredDomains,
  useUpdateOrganisation,
} from "@/hooks/mutations/usePlatformMutations";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import {
  IOrganisation,
  IBrandConfig,
  IConfiguredDomains,
} from "@/types/organisation.types";
import { ImageUploadField } from "./shared/ImageUploadField";

const labelCls =
  "text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const inputCls =
  "h-11 bg-muted/30 border-border/60 hover:border-primary/40 focus:border-primary transition-all";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="h-px bg-border flex-1" />
      <span className="text-[11px] font-bold uppercase tracking-widest text-primary/70 bg-primary/5 px-3 py-1 rounded-full">
        {label}
      </span>
      <div className="h-px bg-border flex-1" />
    </div>
  );
}

interface FormValues {
  brand: IBrandConfig & {
    seo: { title: string; description: string; author: string };
  };
  domains: IConfiguredDomains;
  identifiers: {
    slug: string;
    prefix: string;
    short_name: string;
    short_code: string;
  };
}

interface Props {
  organisation: IOrganisation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBrandConfigDialog({
  organisation,
  open,
  onOpenChange,
}: Props) {
  const queryClient = useQueryClient();
  const { mutateAsync: updateBrand, isPending: brandPending } =
    useUpdateBrandSettings();
  const { mutateAsync: updateDomains, isPending: domainsPending } =
    useUpdateConfiguredDomains();
  const { mutateAsync: updateOrg, isPending: orgPending } =
    useUpdateOrganisation();
  const isPending = brandPending || domainsPending || orgPending;

  const form = useForm<FormValues>({
    defaultValues: buildDefaults(organisation),
  });

  useEffect(() => {
    if (open) form.reset(buildDefaults(organisation));
  }, [open, organisation, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const mutations: Promise<unknown>[] = [
        updateBrand({ id: organisation.id, brand: values.brand }),
        updateDomains({ id: organisation.id, ...values.domains }),
      ];

      const { slug, prefix, short_name, short_code } = values.identifiers;
      if (slug || prefix || short_name || short_code) {
        mutations.push(
          updateOrg({
            id: organisation.id,
            slug: slug || undefined,
            prefix: prefix || undefined,
            short_name: short_name || undefined,
            short_code: short_code || undefined,
          }),
        );
      }

      await Promise.all(mutations);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORGANISATION.GET_BY_ID, organisation.id],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORGANISATION.BRAND_SETTINGS, organisation.id],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            QUERY_KEYS.ORGANISATION.CONFIGURED_DOMAINS,
            organisation.id,
          ],
        }),
      ]);
      toast.success("Brand configuration saved");
      onOpenChange(false);
    } catch (err) {
      const data = axios.isAxiosError(err)
        ? (err.response?.data as
            | { message?: string; errors?: string[] }
            | undefined)
        : undefined;
      const errors = data?.errors ?? [];
      const items =
        errors.length > 0
          ? errors
          : [data?.message ?? "Failed to save brand configuration"];
      toast.error("Failed to save brand configuration", {
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
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Edit Brand Configuration
          </DialogTitle>
          <DialogDescription>
            Update brand identity, contact links, SEO metadata, and configured
            domains for <strong>{organisation.organisation_name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mt-2"
          >
            <SectionHeading label="Brand Images" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className={labelCls}>Brand Icon</p>
                <FormField
                  name="brand.brandIconUrl"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUploadField
                          field="icon"
                          value={field.value ?? undefined}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-1">
                <p className={labelCls}>Brand Logo</p>
                <FormField
                  name="brand.brandLogoUrl"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUploadField
                          field="logo"
                          value={field.value ?? undefined}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <SectionHeading label="Brand Identity" />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="brand.brandName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Brand Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Acme Pay"
                        className={inputCls}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="brand.shortBrandName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Short Brand Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Acme"
                        className={inputCls}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="brand.primaryColor"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Primary Colour</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={field.value || "#000000"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-11 h-11 rounded-lg border border-border/60 cursor-pointer p-1 bg-background"
                        />
                        <Input
                          placeholder="#0052FF"
                          className={inputCls}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="brand.secondaryColor"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Secondary Colour</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={field.value || "#000000"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-11 h-11 rounded-lg border border-border/60 cursor-pointer p-1 bg-background"
                        />
                        <Input
                          placeholder="#6B7280"
                          className={inputCls}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SectionHeading label="Organisation Identifiers" />

            <p className="text-[11px] text-muted-foreground -mt-2">
              Identifiers used for routing, branding, and reference generation.
              The slug is semi-permanent; prefix changes freely.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="identifiers.slug"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className={labelCls}>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="acme-pay"
                        className={inputCls}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, ""),
                          )
                        }
                      />
                    </FormControl>
                    <p className="text-[11px] text-muted-foreground">
                      Used as subdomain, API routing key, and brand config
                      identifier. 3–32 chars, lowercase letters, numbers, and
                      hyphens only.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="identifiers.prefix"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Prefix</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ACME"
                        className={inputCls}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              .toUpperCase()
                              .replace(/[^A-Z0-9]/g, ""),
                          )
                        }
                      />
                    </FormControl>
                    <p className="text-[11px] text-muted-foreground">
                      Prefixed to account numbers. Max 10 chars, uppercase.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="identifiers.short_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Trading Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Acme Bank"
                        className={inputCls}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <p className="text-[11px] text-muted-foreground">
                      Short trading name, max 30 chars.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="identifiers.short_code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Short Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ACM"
                        maxLength={3}
                        className={inputCls}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.toUpperCase().slice(0, 3),
                          )
                        }
                      />
                    </FormControl>
                    <p className="text-[11px] text-muted-foreground">
                      Exactly 3 chars. Prefixed to reference IDs.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SectionHeading label="Contact & Links" />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="brand.supportEmail"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Support Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="support@example.com"
                        className={inputCls}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="brand.supportPhone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Support Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+234..."
                        className={inputCls}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="brand.websiteUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Website URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      className={inputCls}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="brand.privacyUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Privacy Policy URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/privacy"
                      className={inputCls}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="brand.termsUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>
                    Terms of Service URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/terms"
                      className={inputCls}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SectionHeading label="SEO Metadata" />

            <FormField
              name="brand.seo.title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Page Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Pay — Digital Banking"
                      className={inputCls}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="brand.seo.author"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Author</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Acme Corp."
                        className={inputCls}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="brand.seo.description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Secure digital banking and instant transfers."
                      rows={2}
                      className="bg-muted/30 border-border/60 resize-none"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SectionHeading label="Configured Domains" />

            <p className="text-[11px] text-muted-foreground -mt-2">
              Configure the domains for each role. Only Personal App and
              Corporate App domains are used for origin verification.
            </p>

            <div className="space-y-3">
              {(
                [
                  {
                    key: "personal_app",
                    label: "Personal App Domain",
                    placeholder: "app.example.com",
                    icon: <Globe className="w-3.5 h-3.5" />,
                  },
                  {
                    key: "corporate_app",
                    label: "Corporate App Domain",
                    placeholder: "business.example.com",
                    icon: <Globe className="w-3.5 h-3.5" />,
                  },
                  {
                    key: "marketing",
                    label: "Marketing / Root Domain",
                    placeholder: "example.com",
                    icon: <Globe className="w-3.5 h-3.5" />,
                  },
                  {
                    key: "email",
                    label: "Email Send-From Domain",
                    placeholder: "mail.example.com",
                    icon: <Globe className="w-3.5 h-3.5" />,
                  },
                ] as const
              ).map(({ key, label, placeholder, icon }) => (
                <FormField
                  key={key}
                  name={`domains.${key}`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelCls}>
                        <span className="inline-flex items-center gap-1.5">
                          {icon}
                          {label}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={placeholder}
                          className={inputCls}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function buildDefaults(org: IOrganisation): FormValues {
  const b = org.brand_settings ?? {};
  const d = org.configured_domains ?? {};
  return {
    brand: {
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
      seo: {
        title: b.seo?.title ?? "",
        description: b.seo?.description ?? "",
        author: b.seo?.author ?? "",
      },
    },
    domains: {
      personal_app: d.personal_app ?? "",
      corporate_app: d.corporate_app ?? "",
      marketing: d.marketing ?? "",
      email: d.email ?? "",
    },
    identifiers: {
      slug: org.slug ?? "",
      prefix: org.prefix ?? "",
      short_name: org.short_name ?? "",
      short_code: org.short_code ?? "",
    },
  };
}
