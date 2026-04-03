import { z } from "zod";
import { firstNameSchema } from "../fields/firstName.schema";
import { lastNameSchema } from "../fields/lastName.schema";
import { middleNameSchema } from "../fields/middleName.schema";
import { emailSchema } from "../fields/email.schema";
import { bvnSchema } from "../fields/bvn.schema";
import { phoneNumberSchema } from "../fields/phoneNumber.schema";
import { genderSchema } from "../fields/gender.schema";
import { dobSchema } from "../fields/dob.schema";

export const previewSchema = z.object({
  firstName: firstNameSchema(),
  lastName: lastNameSchema(),
  middleName: middleNameSchema(),
  email: emailSchema,
  bvn: bvnSchema,
  phoneNumber: phoneNumberSchema(),
  dob: dobSchema,
  gender: genderSchema,
});
