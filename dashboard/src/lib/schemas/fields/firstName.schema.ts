import { z } from "zod";

export const firstNameSchema = (label = "First name") =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .min(2, `${label} must be at least 2 characters`)
    .regex(/^[\p{L}][\p{L} '\-]*$/u, `${label} contains invalid characters`);
