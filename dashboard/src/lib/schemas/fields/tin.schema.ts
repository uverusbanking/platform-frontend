import { z } from "zod";

export const tinSchema = z
  .string()
  .trim()
  .min(1, "TIN is required")
  .min(5, "TIN must be at least 5 characters");
