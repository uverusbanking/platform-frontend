"use client";

import { CheckCircle2, Loader2, UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUploadMutation } from "@/hooks/mutations/useUploadMutation";

interface DocumentRowProps {
  doc: {
    label: string;
    key: string;
    desc: string;
  };
  className?: string;
}

export function DocumentRow({ doc, className }: DocumentRowProps) {
  const form = useFormContext();
  const uploadMutation = useUploadMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileUrl = form.watch(`documents.${doc.key}.fileUrl`);
  const fileName = form.watch(`documents.${doc.key}.fileName`);
  const isUploaded = !!fileUrl;

  const handleFileChange = (file: File | File[] | null) => {
    const fileToStage = Array.isArray(file) ? file[0] : file;
    if (fileToStage) {
      setSelectedFile(fileToStage);
    }
  };

  const handleUploadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedFile) return;

    const loadingToast = toast.loading("Uploading file...");

    try {
      const response = await uploadMutation.mutateAsync({
        file: selectedFile,
        userType: "PLATFORM",
      });

      form.setValue(
        `documents.${doc.key}`,
        {
          id: response.data.id,
          fileUrl: response.data.file_url,
          documentType: doc.key,
          fileName: selectedFile.name,
        },
        { shouldValidate: true },
      );

      toast.success("File uploaded successfully!", { id: loadingToast });
      setSelectedFile(null);
    } catch (error) {
      toast.error("Failed to upload file", { id: loadingToast });
      console.error(error);
    }
  };

  const displayName = selectedFile ? selectedFile.name : fileName;

  return (
    <FileUploader
      handleChange={handleFileChange}
      name={`documents.${doc.key}`}
      types={["JPG", "JPEG", "PNG", "PDF"]}
      multiple={false}
      maxSize={5}
      disabled={!!selectedFile}
      fileOrFiles={selectedFile || (fileName ? new File([], fileName) : null)}
    >
      <div
        className={`relative flex items-center justify-between p-5 rounded-xl border transition-all duration-300 group ${
          isUploaded
            ? "bg-success/5 border-success/30 hover:bg-success/10"
            : "bg-background border-border/60 hover:border-primary/50"
        } ${className || ""}`}
      >
        <div className="flex items-center gap-5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              isUploaded
                ? "bg-success/20 text-success"
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            }`}
          >
            {isUploaded ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>
          <div>
            <p
              className={`font-bold text-sm ${isUploaded ? "text-success-900" : "text-foreground"}`}
            >
              {doc.label}
            </p>
            {!displayName ? (
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                {doc.desc} or drag and drop here
              </p>
            ) : (
              <p
                className={`text-xs font-medium mt-1 truncate max-w-[200px] ${selectedFile ? "text-amber-600" : "text-success"}`}
              >
                {displayName} {selectedFile && "(Pending Upload)"}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 z-10 relative">
          {isUploaded && !selectedFile ? (
            <div className="flex flex-col items-end">
              <Badge
                variant="outline"
                className="bg-background/70 border-success/30 text-success font-bold text-[10px] uppercase mb-1"
              >
                Uploaded
              </Badge>
              <span className="text-[10px] text-muted-foreground font-medium">
                Click to replace
              </span>
            </div>
          ) : (
            <div className="text-right mr-2 hidden sm:block">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">
                {selectedFile ? "Ready" : "Optional"}
              </p>
              <p className="text-[10px] text-muted-foreground">Max 5MB</p>
            </div>
          )}
          <div className="flex flex-col-reverse">
            {selectedFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSelectedFile(null);
                }}
                className="flex items-center w-fit mx-auto p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            )}
            <Button
              type="button"
              variant={isUploaded && !selectedFile ? "outline" : "default"}
              size="sm"
              disabled={uploadMutation.isPending}
              onClick={selectedFile ? handleUploadClick : undefined}
              className={`rounded-lg font-bold transition-all ${
                isUploaded ? "border-success/30 text-success" : "bg-primary"
              }`}
            >
              {uploadMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : selectedFile ? (
                <span className="text-white">Confirm Upload</span>
              ) : isUploaded ? (
                <>Replace File</>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </FileUploader>
  );
}
