import { z } from "zod";

export const createApiKeySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
  environment: z.enum(["LIVE", "SANDBOX"]),
});
