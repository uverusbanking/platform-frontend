"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Palette, Globe, UploadCloud, X } from "lucide-react";
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
} from "@/hooks/mutations/usePlatformMutations";
import { useUploadMutation } from "@/hooks/mutations/useUploadMutation";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import {
  IOrganisation,
  IBrandConfig,
  IConfiguredDomains,
} from "@/types/organisation.types";

const labelCls =
  "text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const inputCls =
  "h-11 bg-muted/30 border-border/60 hover:border-primary/40 focus:border-primary transition-all";

// Icon: 1024×1024px, no transparency — scales to iOS/Android/PWA icons
// Logo: min 800×200px (4:1 ratio), transparency OK — used in nav bars / headers
const IMAGE_SPECS = {
  icon: {
    label: "Brand Icon",
    hint: "Square app icon — 1024×1024px min, PNG/JPG, ≤2 MB. Used as the iOS, Android, and web app icon.",
    minW: 1024,
    minH: 1024,
    maxMB: 2,
    accept: "image/png,image/jpeg",
    types: ["PNG", "JPG", "JPEG"],
    aspectHint: "1:1 (square)",
  },
  logo: {
    label: "Brand Logo",
    hint: "Horizontal logo — min 800×200px, PNG with transparency, ≤2 MB. Used in navigation bars and headers.",
    minW: 800,
    minH: 200,
    maxMB: 2,
    accept: "image/png",
    types: ["PNG"],
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
}

function ImageUploadField({ field, value, onChange }: ImageUploadFieldProps) {
  const spec = IMAGE_SPECS[field];
  const uploadMutation = useUploadMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [staged, setStaged] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!staged) return;
    const loading = toast.loading("Uploading image…");
    try {
      const res = await uploadMutation.mutateAsync({
        file: staged,
        userType: "PLATFORM",
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

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground">{spec.hint}</p>

      <div
        className={`relative border-2 border-dashed rounded-xl transition-colors ${
          staged
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
        />

        {previewSrc ? (
          <div className="flex items-center gap-4 p-4">
            <div
              className={`overflow-hidden rounded-lg border border-border/40 bg-checkered shrink-0 ${
                isSquare ? "w-16 h-16" : "w-32 h-12"
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
                  <span className="text-muted-foreground">
                    (pending upload)
                  </span>
                </p>
              ) : (
                <p className="text-xs font-medium text-success truncate">
                  Uploaded
                </p>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {spec.aspectHint}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {staged ? (
                <>
                  <Button
                    type="button"
                    size="sm"
                    disabled={uploadMutation.isPending || validating}
                    onClick={handleUpload}
                  >
                    {uploadMutation.isPending ? (
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
          </div>
        ) : (
          <button
            type="button"
            className="w-full flex flex-col items-center gap-2 py-6 px-4 text-center"
            onClick={() => inputRef.current?.click()}
            disabled={validating || uploadMutation.isPending}
          >
            {validating ? (
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">
              {validating
                ? "Validating…"
                : `Click or drag ${spec.types.join("/")} here`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

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
  const isPending = brandPending || domainsPending;

  const form = useForm<FormValues>({
    defaultValues: buildDefaults(organisation),
  });

  useEffect(() => {
    if (open) form.reset(buildDefaults(organisation));
  }, [open, organisation, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await Promise.all([
        updateBrand({ id: organisation.id, brand: values.brand }),
        updateDomains({
          id: organisation.id,
          ...values.domains,
        }),
      ]);
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
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as
          | { message?: string; errors?: string[] }
          | undefined;
        const errors = data?.errors;
        if (errors?.length) {
          errors.forEach((e) => toast.error(e));
        } else {
          toast.error(data?.message ?? "Failed to save brand configuration");
        }
      } else {
        toast.error("Failed to save brand configuration");
      }
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
  };
}
