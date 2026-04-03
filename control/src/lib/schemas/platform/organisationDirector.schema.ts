import { z } from "zod";
import { bvnSchema } from "../fields/bvn.schema";
import { firstNameSchema } from "../fields/firstName.schema";
import { lastNameSchema } from "../fields/lastName.schema";
import { middleNameSchema } from "../fields/middleName.schema";
import { ninSchema } from "../fields/nin.schema";
import { postalCodeSchema } from "../fields/postalCode.schema";
import { requiredStringSchema } from "../fields/requiredString.schema";
import { documentSchema } from "./organizationDocument.schema";

export const organisationDirectorSchema = z.object({
  firstName: firstNameSchema(),
  lastName: lastNameSchema(),
  middleName: middleNameSchema(),
  bvn: bvnSchema,
  nin: ninSchema,
  idType: requiredStringSchema("ID Type"),
  idDocument: documentSchema,
  streetAddress: requiredStringSchema("Street Address"),
  city: requiredStringSchema("City"),
  state: requiredStringSchema("State"),
  zipCode: postalCodeSchema.optional(),
  country: requiredStringSchema("Country"),
  ownershipPercentage: z.number().min(0).max(100),
  isBeneficialOwner: z.boolean(),
});
