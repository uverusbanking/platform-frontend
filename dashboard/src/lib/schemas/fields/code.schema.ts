import { z } from "zod";

export const codeSchema = z
  .string()
  .trim()
  .min(1, "Code is required")
  .min(4, "Code must be at least 4 characters")
  .max(6, "Code must be at most 6 characters")
  .regex(/^\d+$/, "Code must contain only digits");
