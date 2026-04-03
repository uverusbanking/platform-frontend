import { z } from "zod";
import { emailSchema } from "../fields/email.schema";
import { passwordSchema } from "../fields/password.schema";

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
