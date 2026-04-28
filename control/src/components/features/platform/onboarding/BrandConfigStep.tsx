"use client";

import { useFormContext } from "react-hook-form";
import { Globe } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const inputCls =
  "h-12 rounded-lg bg-background border-border/60 hover:border-primary/40 focus:border-primary transition-all shadow-sm focus:ring-4 focus:ring-primary/10";

const labelCls =
  "text-xs font-bold uppercase tracking-wider text-muted-foreground";

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="h-px bg-border flex-1" />
      <h4 className="font-bold text-xs uppercase tracking-widest text-primary/80 bg-primary/5 px-3 py-1 rounded-full">
        {label}
      </h4>
      <div className="h-px bg-border flex-1" />
    </div>
  );
}

function ColorInput({ name, label }: { name: string; label: string }) {
  const form = useFormContext();
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={labelCls}>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={field.value || "#000000"}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-12 h-12 rounded-lg border border-border/60 cursor-pointer p-1 bg-background"
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
  );
}

export function BrandConfigStep() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <SectionDivider label="Brand Identity" />

      <div className="grid grid-cols-2 gap-5">
        <FormField
          name="config.brand.brandName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Brand Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Uverus Pay"
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
          name="config.brand.shortBrandName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Short Brand Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Uverus"
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
          name="config.brand.brandLogoUrl"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className={labelCls}>Brand Logo URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/logo.png"
                  className={inputCls}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ColorInput name="config.brand.primaryColor" label="Primary Colour" />
        <ColorInput
          name="config.brand.secondaryColor"
          label="Secondary Colour"
        />
      </div>

      <SectionDivider label="Contact & Links" />

      <div className="grid grid-cols-2 gap-5">
        <FormField
          name="config.brand.supportEmail"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Support Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="support@company.com"
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
          name="config.brand.supportPhone"
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
          name="config.brand.websiteUrl"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Website URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://company.com"
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
          name="config.brand.privacyUrl"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Privacy Policy URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://company.com/privacy"
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
          name="config.brand.termsUrl"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className={labelCls}>Terms of Service URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://company.com/terms"
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

      <SectionDivider label="SEO" />

      <div className="grid grid-cols-2 gap-5">
        <FormField
          name="config.brand.seo.title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Page Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Company - Digital Banking"
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
          name="config.brand.seo.author"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Author</FormLabel>
              <FormControl>
                <Input
                  placeholder="Company Corp."
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
          name="config.brand.seo.description"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className={labelCls}>Meta Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Secure digital banking and instant transfers."
                  className="rounded-lg bg-background border-border/60 hover:border-primary/40 focus:border-primary transition-all shadow-sm focus:ring-4 focus:ring-primary/10 resize-none"
                  rows={3}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <SectionDivider label="Configured Domains" />

      <p className="text-[11px] text-muted-foreground -mt-3">
        Configure the domain for each role. Personal App and Corporate App are
        used for origin verification.
      </p>

      <div className="space-y-4">
        {(
          [
            {
              key: "config.domains.personal_app",
              label: "Personal App Domain",
              placeholder: "app.company.com",
            },
            {
              key: "config.domains.corporate_app",
              label: "Corporate App Domain",
              placeholder: "business.company.com",
            },
            {
              key: "config.domains.marketing",
              label: "Marketing / Root Domain",
              placeholder: "company.com",
            },
            {
              key: "config.domains.email",
              label: "Email Send-From Domain",
              placeholder: "mail.company.com",
            },
          ] as const
        ).map(({ key, label, placeholder }) => (
          <FormField
            key={key}
            name={key}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="w-3 h-3" />
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
    </div>
  );
}
