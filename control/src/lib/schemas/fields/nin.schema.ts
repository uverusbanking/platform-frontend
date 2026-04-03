import { z } from "zod";

export const ninSchema = z
  .string()
  .trim()
  .min(1, "NIN is required")
  .regex(/^\d{11}$/, "NIN must be 11 digits");
