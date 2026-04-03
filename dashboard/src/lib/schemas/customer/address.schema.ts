import { z } from "zod";
import { requiredStringSchema } from "../fields/requiredString.schema";
import { postalCodeSchema } from "../fields/postalCode.schema";

export const addressSchema = z.object({
  address: requiredStringSchema("Business street address"),
  city: requiredStringSchema("City"),
  state: requiredStringSchema("State"),
  postalCode: postalCodeSchema,
  country: requiredStringSchema("Country"),
});
