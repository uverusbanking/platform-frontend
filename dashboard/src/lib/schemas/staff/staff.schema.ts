import { firstNameSchema } from "@/lib/schemas/fields/firstName.schema";
import { lastNameSchema } from "@/lib/schemas/fields/lastName.schema";
import { emailSchema } from "@/lib/schemas/fields/email.schema";
import { roleSchema } from "@/lib/schemas/fields/role.schema";
import { genderSchema } from "@/lib/schemas/fields/gender.schema";
import { passwordSchema } from "@/lib/schemas/fields/password.schema";
import { z } from "zod";
import { middleNameSchema } from "../fields/middleName.schema";
import { phoneNumberSchema } from "../fields/phoneNumber.schema";

export const staffSchema = z.object({
  first_name: firstNameSchema(),
  last_name: lastNameSchema(),
  middle_name: middleNameSchema(),
  email: emailSchema,
  phone_number: phoneNumberSchema(),
  role: roleSchema,
  gender: genderSchema,
  password: passwordSchema,
});
