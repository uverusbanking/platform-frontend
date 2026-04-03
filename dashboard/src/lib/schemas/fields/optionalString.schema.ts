import { z } from "zod";

export const optionalStringSchema = z.string().trim().optional();
