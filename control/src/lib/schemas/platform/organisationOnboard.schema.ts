import { z } from "zod";
import { organisationDirectorSchema } from "./organisationDirector.schema";
import { requiredStringSchema } from "../fields/requiredString.schema";
import { postalCodeSchema } from "../fields/postalCode.schema";
import { tinSchema } from "../fields/tin.schema";
import { cacNumberSchema } from "../fields/cacNumber.schema";
import { emailSchema } from "../fields/email.schema";
import { phoneNumberSchema } from "../fields/phoneNumber.schema";
import { documentSchema } from "./organizationDocument.schema";

export const OrganisationOnboardSchema = z.object({
  organisationName: requiredStringSchema("Organisation Name"),
  streetAddress: requiredStringSchema("Street Address"),
  city: requiredStringSchema("City"),
  state: requiredStringSchema("State"),
  zipCode: postalCodeSchema,
  country: requiredStringSchema("Country"),
  tin: tinSchema,
  cacNumber: cacNumberSchema,
  businessEmail: emailSchema,
  businessPhone: phoneNumberSchema(),
  directors: z
    .array(organisationDirectorSchema)
    .min(1, "At least one director is required"),
  documents: z.object({
    cacCertificate: documentSchema,
    memorandum: documentSchema,
    boardResolution: documentSchema,
    proofOfAddress: documentSchema,
    uboDeclaration: documentSchema,
  }),
});
