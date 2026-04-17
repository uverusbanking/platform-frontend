"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "config.domains",
  });

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

      <div className="space-y-3">
        {fields.map((f, i) => (
          <div key={f.id} className="flex gap-3 items-start">
            <FormField
              name={`config.domains.${i}.name`}
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  {i === 0 && (
                    <FormLabel className={labelCls}>Environment</FormLabel>
                  )}
                  <FormControl>
                    <Input
                      placeholder="Production"
                      className={inputCls}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`config.domains.${i}.url`}
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-[2]">
                  {i === 0 && <FormLabel className={labelCls}>URL</FormLabel>}
                  <FormControl>
                    <Input
                      placeholder="https://app.company.com"
                      className={inputCls}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`text-destructive hover:bg-destructive/10 rounded-lg shrink-0 ${i === 0 ? "mt-6" : ""}`}
              onClick={() => remove(i)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl h-10 border-dashed font-bold text-xs uppercase tracking-wider"
          onClick={() => append({ name: "", url: "" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Domain
        </Button>
      </div>
    </div>
  );
}
