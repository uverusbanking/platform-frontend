import { z } from "zod";

export const middleNameSchema = (label = "Middle name") =>
  z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // optional field
        return /^[\p{L}][\p{L} '\-]*$/u.test(val);
      },
      {
        message: `${label} contains invalid characters`,
      },
    );
