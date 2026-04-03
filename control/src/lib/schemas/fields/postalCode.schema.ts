import { z } from "zod";

export const postalCodeSchema = z
  .string()
  .trim()
  .min(1, "Postal code is required")
  .regex(/^\d{6}$/, "Postal code must be 6 digits");
