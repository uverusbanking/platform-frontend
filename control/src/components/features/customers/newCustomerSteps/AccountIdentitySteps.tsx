import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultApiResponse, toDateInputValue } from "@/lib/resources";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { ICustomerData } from "../AddCustomerDialog";
import DisplayRespondsMessage from "@/components/DisplayResponse";
// import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import apiClient, { apiErrorResponse } from "@/lib/axios";
import { useUserStore } from "@/state/userStore";

import { useGetKYCDocumentTypes } from "@/hooks/queries/useOptionsQueries";
import { accountIdentitySchema } from "@/lib/schemas/customer/accountIdentity.schema";

const FormSchema = accountIdentitySchema;

interface Props {
  data: ICustomerData;
  nextStep: (data: ICustomerData) => void;
  prevStep: () => void;
}

type IDocuments = {
  key: string; // "idDocument",
  title: string; // "ID Document",
  isLoading: boolean;
  fileUrl: string;
};

export function AccountIdentitySteps({ data, nextStep, prevStep }: Props) {
  const { userData } = useUserStore();
  const { data: kycTypesRes, isLoading: isLoadingKYCTypes } =
    useGetKYCDocumentTypes();
  const kycTypes = kycTypesRes?.data || [];

  const [apiResponse, setApiResponse] = useState(defaultApiResponse);
  const [documents, setDocuments] = useState<IDocuments[]>([
    {
      key: "idDocument",
      title: "ID Document",
      isLoading: false,
      fileUrl: "",
    },
    {
      key: "proofOfAddress",
      title: "Proof of Address",
      isLoading: false,
      fileUrl: "",
    },
    {
      key: "passportPhotograph",
      title: "Passport Photograph",
      isLoading: false,
      fileUrl: "",
    },
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      // setValue('initialDeposit', data.initialDeposit, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setValue("idType", data.idType, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("idNumber", data.idNumber, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("nin", data.nin, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("bvn", data.bvn, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("idDocument", data.idDocument, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("proofOfAddress", data.proofOfAddress, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("passportPhotograph", data.passportPhotograph, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    return () => {};
  }, [data, setValue]); // Added setValue to deps

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    setApiResponse(defaultApiResponse);
    console.log(formData);

    nextStep({ ...data, ...formData });
  };

  const handleFileUpload = async (key: string, file: File) => {
    setApiResponse(defaultApiResponse);

    const document = documents.find((d) => d.key === key);
    if (!document) {
      setApiResponse({
        display: true,
        status: false,
        message: "Document not found",
      });
      return;
    }

    try {
      setDocuments((prev) =>
        upsertDocument(prev, { ...document, isLoading: true }),
      );

      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", key);
      formData.append("userId", userData.id);
      formData.append("userType", "COMPANY");

      const fileType =
        key === "idDocument"
          ? "ID_FRONT"
          : key === "proofOfAddress"
            ? "PROOF_OF_ADDRESS"
            : "PASSPORT_PHOTO";
      formData.append("fileType", fileType);

      const response = (
        await apiClient.post("/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "*/*",
          },
        })
      ).data;
      console.log(response);

      const newDocument: IDocuments = {
        fileUrl: response.data.file_url,
        key: key,
        title: document.title,
        isLoading: false,
      };
      setDocuments((prev) => upsertDocument(prev, newDocument));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(key as any, response.data.id, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } catch (error) {
      const err = apiErrorResponse(error, "Oops, something went wrong");
      setDocuments((prev) =>
        upsertDocument(prev, { ...document, isLoading: false }),
      );

      console.log(err);
      setApiResponse({
        display: true,
        status: false,
        message: err.error,
        errorMsg: err.errorMsgs,
      });
    }
  };

  /**
   * Adds or updates a document in state, ensuring only one entry per documentType.
   */
  const upsertDocument = (
    documents: IDocuments[],
    newDoc: IDocuments,
  ): IDocuments[] => {
    const exists = documents.some((doc) => doc.key === newDoc.key);

    if (exists) {
      // Replace existing document with same documentType
      return documents.map((doc) => (doc.key === newDoc.key ? newDoc : doc));
    }

    // Add new document
    return [...documents, newDoc];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Account Setup & Identity Verification
          </CardTitle>
          <CardDescription>
            Account type, Identity documents and verification numbers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bvn">BVN *</Label>
              <Input
                id="bvn"
                aria-invalid={!!errors.bvn}
                aria-describedby="bvn-error"
                {...register("bvn")}
                placeholder="Enter 11-digit BVN"
                maxLength={11}
                readOnly
              />
              {errors.bvn && (
                <p className="text-red-500 text-sm mt-1" id="bvn-error">
                  {errors.bvn.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nin">NIN</Label>
              <Input
                id="nin"
                aria-invalid={!!errors.nin}
                aria-describedby="nin-error"
                {...register("nin")}
                placeholder="Enter 11-digit NIN"
                maxLength={11}
              />
              {errors.nin && (
                <p className="text-red-500 text-sm mt-1" id="nin-error">
                  {errors.nin.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idType">ID Type *</Label>
              <Select
                value={watch("idType")}
                onValueChange={(value) =>
                  setValue("idType", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              >
                <SelectTrigger disabled={isLoadingKYCTypes}>
                  <div className="flex items-center gap-2">
                    {isLoadingKYCTypes && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                    <SelectValue
                      placeholder={
                        isLoadingKYCTypes ? "Loading..." : "Select ID type"
                      }
                    />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {kycTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number *</Label>
              <Input
                id="idNumber"
                aria-invalid={!!errors.idNumber}
                aria-describedby="idNumber-error"
                {...register("idNumber")}
                placeholder="Enter ID number"
              />
              {errors.idNumber && (
                <p className="text-red-500 text-sm mt-1" id="idNumber-error">
                  {errors.idNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {documents.map((doc) => (
              <div key={doc.key} className="space-y-3 group">
                <Label
                  htmlFor={doc.key}
                  className="cursor-pointer block relative"
                >
                  <div
                    className="aspect-[4/3] border-2 border-dashed border-border rounded-xl  
                                        flex flex-col items-center justify-center p-4 transition-all duration-300
                                        hover:border-primary/50 hover:bg-primary/5 group-hover:scale-[1.02]"
                  >
                    {doc.isLoading ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                        <p className="text-xs font-medium text-muted-foreground animate-pulse">
                          Uploading...
                        </p>
                      </div>
                    ) : doc.fileUrl ? (
                      <div className="relative w-full h-full rounded-lg overflow-hidden group/image">
                        <Image
                          src={doc.fileUrl}
                          alt={doc.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/image:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/90 p-2 rounded-full shadow-lg">
                            <Upload className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="p-4 rounded-full bg-surface-elevated shadow-sm group-hover:bg-primary/10 group-hover:shadow-md transition-all duration-300">
                          <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors">
                            {doc.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                            Click or drop file
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Label>

                <Input
                  id={doc.key}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.size <= 10 * 1024 * 1024) {
                      handleFileUpload(doc.key, file);
                    } else if (file) {
                      setApiResponse({
                        display: true,
                        status: false,
                        message: "File size must be less than 10MB",
                      });
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <DisplayRespondsMessage response={apiResponse} />

      <DialogFooter className="flex justify-between mt-6">
        <div className="flex gap-2">
          <Button variant="outline" type="button" onClick={prevStep}>
            Previous
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-primary hover:bg-primary-dark"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
