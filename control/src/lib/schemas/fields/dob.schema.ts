import { z } from "zod";

export const dobSchema = z
  .string()
  .trim()
  .min(1, "Date of Birth is required")
  .regex(
    /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
    "Date of Birth must be in YYYY-MM-DD format",
  )
  .refine((val) => {
    const [year, month, day] = val.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }, "Date of Birth must be a valid date")
  .refine((val) => {
    const [year, month, day] = val.split("-").map(Number);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate <= today;
  }, "Date of Birth cannot be in the future");
