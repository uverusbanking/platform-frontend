import { ROLES } from "@/auth/roles";
import { z } from "zod";

export const roleSchema = z.nativeEnum(ROLES, {
  message: "Role is required",
});
