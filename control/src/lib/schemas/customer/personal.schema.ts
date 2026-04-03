import { z } from "zod";
import { emailSchema } from "../fields/email.schema";
import { genderSchema } from "../fields/gender.schema";
import { requiredStringSchema } from "../fields/requiredString.schema";
import { phoneNumberSchema } from "../fields/phoneNumber.schema";
import { bvnSchema } from "../fields/bvn.schema";

export const personalSchema = z.object({
  email: emailSchema,
  bvn: bvnSchema,
  phoneNumber: phoneNumberSchema(),
  dob: requiredStringSchema("Date of birth"),
  gender: genderSchema,
});
