import { z } from "zod";

export const cacNumberSchema = z
  .string()
  .trim()
  .min(1, "CAC number is required")
  .min(5, "CAC number must be at least 5 characters");
