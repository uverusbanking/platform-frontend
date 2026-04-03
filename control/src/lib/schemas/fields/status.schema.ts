import { UserStatus } from "@/types/user.types";
import { z } from "zod";

export const statusSchema = z.nativeEnum(UserStatus, {
  message: "Status is required",
});
