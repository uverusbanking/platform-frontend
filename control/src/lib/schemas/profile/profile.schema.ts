import { z } from "zod";
import { firstNameSchema } from "../fields/firstName.schema";
import { lastNameSchema } from "../fields/lastName.schema";
import { middleNameSchema } from "../fields/middleName.schema";
import { phoneNumberSchema } from "../fields/phoneNumber.schema";
import { genderSchema } from "../fields/gender.schema";

export const profileSchema = z.object({
  first_name: firstNameSchema(),
  last_name: lastNameSchema(),
  middle_name: middleNameSchema(),
  phone_number: phoneNumberSchema(),
  gender: genderSchema,
});
