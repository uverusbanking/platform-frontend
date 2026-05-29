import { z } from "zod";

export const loginPasswordSchema = z.string().min(1, "Password is required");
