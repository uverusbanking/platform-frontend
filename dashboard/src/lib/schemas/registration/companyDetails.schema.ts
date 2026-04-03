import { z } from "zod";
import { requiredStringSchema } from "../fields/requiredString.schema";
import { cacNumberSchema } from "../fields/cacNumber.schema";
import { tinSchema } from "../fields/tin.schema";
import { emailSchema } from "../fields/email.schema";
import { phoneNumberSchema } from "../fields/phoneNumber.schema";
import { postalCodeSchema } from "../fields/postalCode.schema";

export const companyDetailsSchema = z.object({
  companyName: requiredStringSchema("Company name"),
  cacNumber: cacNumberSchema,
  tin: tinSchema,
  businessEmail: emailSchema,
  businessPhone: phoneNumberSchema(),
  streetAddress: requiredStringSchema("Street address"),
  city: requiredStringSchema("City"),
  state: requiredStringSchema("State"),
  zipCode: postalCodeSchema.optional(),
  country: requiredStringSchema("Country"),
});
