import { Gender } from "@/types/enums";
import { z } from "zod";

export const genderSchema = z.nativeEnum(Gender, {
  message: "Gender is required",
});
