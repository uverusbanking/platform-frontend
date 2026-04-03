import { UserStatus } from "@/types/enums";
import { z } from "zod";

export const statusSchema = z.nativeEnum(UserStatus, {
  message: "Status is required",
});
