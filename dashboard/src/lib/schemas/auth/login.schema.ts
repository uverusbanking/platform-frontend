import { z } from "zod";
import { emailSchema } from "../fields/email.schema";
import { loginPasswordSchema } from "../fields/login_password.schema";

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});
