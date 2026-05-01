"use client";

import { useRef, useState } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";
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
