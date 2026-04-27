"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Palette, Globe } from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import {
  IOrganisation,
  IBrandConfig,
  IConfiguredDomain,
} from "@/types/organisation.types";

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
  domains: IConfiguredDomain[];
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "domains",
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
          configured_domains: values.domains,
        }),
      ]);
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANISATION.GET_BY_ID, organisation.id],
      });
      toast.success("Brand configuration saved");
      onOpenChange(false);
    } catch {
      toast.error("Failed to save brand configuration");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

            <FormField
              name="brand.brandLogoUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Logo URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://..."
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
                    <FormLabel className={labelCls}>
                      Privacy Policy URL
                    </FormLabel>
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
                  <FormItem className="col-span-2">
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
            </div>

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

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <Globe className="w-4 h-4 mt-3 text-muted-foreground shrink-0" />
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <FormField
                      name={`domains.${index}.name`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          {index === 0 && (
                            <FormLabel className={labelCls}>
                              Environment
                            </FormLabel>
                          )}
                          <FormControl>
                            <Input
                              placeholder="production"
                              className={inputCls}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`domains.${index}.url`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          {index === 0 && (
                            <FormLabel className={labelCls}>URL</FormLabel>
                          )}
                          <FormControl>
                            <Input
                              placeholder="https://app.example.com"
                              className={inputCls}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-1 text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
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
  return {
    brand: {
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
    },
    domains: (org.configured_domains ?? []).map((d) => ({
      name: d.name,
      url: d.url,
    })),
  };
}
