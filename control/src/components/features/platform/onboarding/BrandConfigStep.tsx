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
import { ImageUploadField } from "../shared/ImageUploadField";

const inputCls =
  "h-11 bg-muted/30 border-border/60 hover:border-primary/40 focus:border-primary transition-all";

const labelCls =
  "text-xs font-semibold uppercase tracking-wider text-muted-foreground";

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="h-px bg-border flex-1" />
      <h4 className="font-bold text-xs uppercase tracking-widest text-primary/70 bg-primary/5 px-3 py-1 rounded-full">
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
  );
}

export function BrandConfigStep() {
  const form = useFormContext();

  return (
    <div className="space-y-5">
      <SectionDivider label="Brand Images" />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className={labelCls}>Brand Icon</p>
          <FormField
            name="config.brand.brandIconUrl"
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
            name="config.brand.brandLogoUrl"
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

      <SectionDivider label="Brand Identity" />

      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ColorInput name="config.brand.primaryColor" label="Primary Colour" />
        <ColorInput
          name="config.brand.secondaryColor"
          label="Secondary Colour"
        />
      </div>

      <SectionDivider label="Organisation Identifiers" />

      <p className="text-[11px] text-muted-foreground -mt-2">
        Identifiers used for routing, branding, and reference generation. The
        slug is semi-permanent; prefix changes freely.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="config.identifiers.slug"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className={labelCls}>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="dandelion-corp"
                  className={inputCls}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    )
                  }
                />
              </FormControl>
              <p className="text-[11px] text-muted-foreground">
                Used as subdomain, API routing key, and brand config identifier.
                3–32 chars, lowercase letters, numbers, and hyphens only.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="config.identifiers.prefix"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Prefix</FormLabel>
              <FormControl>
                <Input
                  placeholder="UVRS"
                  className={inputCls}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""),
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
          name="config.identifiers.short_name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Trading Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Uverus Bank"
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
          name="config.identifiers.short_code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Short Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="UVE"
                  maxLength={3}
                  className={inputCls}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value.toUpperCase().slice(0, 3))
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

      <SectionDivider label="Contact & Links" />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="config.brand.supportEmail"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Support Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
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
      </div>

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
          <FormItem>
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

      <SectionDivider label="SEO Metadata" />

      <FormField
        name="config.brand.seo.title"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelCls}>Page Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Company — Digital Banking"
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
      </div>
      <FormField
        name="config.brand.seo.description"
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

      <SectionDivider label="Configured Domains" />

      <p className="text-[11px] text-muted-foreground -mt-2">
        Configure the domain for each role. Personal App and Corporate App are
        used for origin verification.
      </p>

      <div className="space-y-3">
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
