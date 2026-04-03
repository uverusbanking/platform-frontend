import { z } from "zod";

// export const phoneNumberSchema = (message: string) =>
//   z.string().refine(
//     (val) => {
//       // Simple regex for international phone numbers
//       const phoneRegex = /^\+?[1-9]\d{1,14}$/;
//       return phoneRegex.test(val);
//     },
//     {
//       message: message,
//     },
//   );

export const phoneNumberSchema = (label: string = "Phone number") =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .regex(/^\+?[1-9]\d{6,14}$/, `Invalid ${label}`);
