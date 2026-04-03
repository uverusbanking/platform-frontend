import { z } from "zod";
import { firstNameSchema } from "../fields/firstName.schema";
import { lastNameSchema } from "../fields/lastName.schema";
import { middleNameSchema } from "../fields/middleName.schema";
import { bvnSchema } from "../fields/bvn.schema";
import { ninSchema } from "../fields/nin.schema";
import { requiredStringSchema } from "../fields/requiredString.schema";
import { postalCodeSchema } from "../fields/postalCode.schema";

export const directorSchema = z.object({
  firstName: firstNameSchema(),
  lastName: lastNameSchema(),
  middleName: middleNameSchema(),
  bvn: bvnSchema,
  nin: ninSchema,
  idType: requiredStringSchema("ID type"),
  idNumber: requiredStringSchema("ID number"),
  streetAddress: requiredStringSchema("Street address"),
  city: requiredStringSchema("City"),
  state: requiredStringSchema("State"),
  zipCode: postalCodeSchema.optional(),
  country: requiredStringSchema("Country"),
  ownershipPercentage: z.string().optional(),
  isBeneficialOwner: z.boolean().optional(),
});
