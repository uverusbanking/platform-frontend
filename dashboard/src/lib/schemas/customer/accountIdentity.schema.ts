import { z } from "zod";
import { requiredStringSchema } from "../fields/requiredString.schema";
import { optionalStringSchema } from "../fields/optionalString.schema";
import { bvnSchema } from "../fields/bvn.schema";
import { ninSchema } from "../fields/nin.schema";

export const accountIdentitySchema = z.object({
  // accountType: z.string().trim().nonempty("Account type is required"),
  // branch: z.string().trim().nonempty("Branch is required"),
  // officer: z.string().trim().nonempty("Account officer is required"),
  // initialDeposit: z.string().trim().nonempty("Initial deposit is required"),
  idType: requiredStringSchema("ID type"),
  idNumber: requiredStringSchema("ID number"),
  nin: ninSchema,
  bvn: bvnSchema,
  idDocument: optionalStringSchema,
  proofOfAddress: optionalStringSchema,
  passportPhotograph: optionalStringSchema,
});
