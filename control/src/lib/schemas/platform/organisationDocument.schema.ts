import { z } from "zod";

const documentSchema = z.object({
  id: z.string().min(1, "Document ID is required"),
  fileUrl: z.string().url("Invalid file URL"),
  documentType: z.string().min(1, "Document type is required"),
  fileName: z.string().optional(),
});

export const organisationDocumentSchema = z.object({
  documents: z.object({
    cacCertificate: documentSchema.optional(),
    memorandum: documentSchema.optional(),
    boardResolution: documentSchema.optional(),
    proofOfAddress: documentSchema.optional(),
    uboDeclaration: documentSchema.optional(),
  }),
});
