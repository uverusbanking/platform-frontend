import z from "zod";

export const documentSchema = z.object({
  id: z.string(),
  fileUrl: z.string().optional(),
  documentType: z.string(),
  fileName: z.string().optional(),
});
