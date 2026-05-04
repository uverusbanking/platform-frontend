"use client";

import { useRef, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUploadMutation } from "@/hooks/mutations/useUploadMutation";

// Icon: 1024×1024px, no transparency — scales to iOS/Android/PWA icons
// Logo: min 800×200px (4:1 ratio), transparency OK — used in nav bars / headers
export const IMAGE_SPECS = {
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

export type ImageField = keyof typeof IMAGE_SPECS;

export function validateImageFile(
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

export function ImageUploadField({
  field,
  value,
  onChange,
}: ImageUploadFieldProps) {
  const spec = IMAGE_SPECS[field];
  const uploadMutation = useUploadMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [validating, setValidating] = useState(false);

  const busy = validating || uploadMutation.isPending;

  const handleFileSelect = async (file: File) => {
    setValidating(true);
    const error = await validateImageFile(file, spec);
    setValidating(false);
    if (error) {
      toast.error(error);
      return;
    }
    const loading = toast.loading("Uploading image…");
    try {
      const res = await uploadMutation.mutateAsync({
        file,
        userType: "PLATFORM",
      });
      onChange(res.data.file_url);
      toast.success("Image uploaded", { id: loading });
    } catch {
      toast.error("Upload failed", { id: loading });
    }
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

  const isSquare = field === "icon";

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground">{spec.hint}</p>

      <div
        className={`relative border-2 border-dashed rounded-xl transition-colors ${
          value
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

        {value ? (
          <div className="flex items-center gap-4 p-4">
            <div
              className={`overflow-hidden rounded-lg border border-border/40 bg-checkered shrink-0 ${
                isSquare ? "w-16 h-16" : "w-32 h-12"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={spec.label}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-success truncate">
                Uploaded
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {spec.aspectHint}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {busy ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Replace"
              )}
            </Button>
          </div>
        ) : (
          <button
            type="button"
            className="w-full flex flex-col items-center gap-2 py-6 px-4 text-center"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {busy ? (
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">
              {validating
                ? "Validating…"
                : uploadMutation.isPending
                  ? "Uploading…"
                  : `Click or drag ${spec.types.join("/")} here`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
