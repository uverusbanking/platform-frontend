import { z } from "zod";

export const bvnSchema = z
  .string()
  .trim()
  .min(1, "BVN is required")
  .regex(/^\d{11}$/, "BVN must be 11 digits");
