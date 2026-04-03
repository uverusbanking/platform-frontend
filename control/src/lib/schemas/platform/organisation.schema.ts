import { z } from "zod";
import { emailSchema } from "../fields/email.schema";
import { phoneNumberSchema } from "../fields/phoneNumber.schema";
import { postalCodeSchema } from "../fields/postalCode.schema";
import { requiredStringSchema } from "../fields/requiredString.schema";
import { tinSchema } from "../fields/tin.schema";
import { cacNumberSchema } from "../fields/cacNumber.schema";

export const organisationSchema = z.object({
  organisationName: requiredStringSchema("Organisation name"),
  businessEmail: emailSchema,
  businessPhone: phoneNumberSchema(),
  tin: tinSchema,
  cacNumber: cacNumberSchema,
  streetAddress: requiredStringSchema("Street address"),
  city: requiredStringSchema("City"),
  state: requiredStringSchema("State"),
  country: requiredStringSchema("Country"),
  zipCode: postalCodeSchema.optional(),
  provision_sandbox_token: z.boolean(),
  live_organisation_id: z.string().optional(),
});
