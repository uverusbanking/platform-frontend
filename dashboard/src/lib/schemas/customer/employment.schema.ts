import { z } from "zod";
import { requiredStringSchema } from "../fields/requiredString.schema";
import { lastNameSchema } from "../fields/lastName.schema";
import { middleNameSchema } from "../fields/middleName.schema";
import { firstNameSchema } from "../fields/firstName.schema";
import { phoneNumberSchema } from "../fields/phoneNumber.schema";

export const EmploymentSchema = z.object({
  occupation: requiredStringSchema("Occupation"),
  employer: requiredStringSchema("Employer"),
  monthlyIncome: requiredStringSchema("Monthly income"),
  employmentStatus: requiredStringSchema("Employment status"),
  nextOfKinFirstName: firstNameSchema("Next of kin first name"),
  nextOfKinMiddleName: middleNameSchema(),
  nextOfKinLastName: lastNameSchema("Next of kin last name"),
  nextOfKinRelationship: requiredStringSchema("Next of kin relationship"),
  nextOfKinPhone: phoneNumberSchema("Next of kin phone number"),
  nextOfKinAddress: requiredStringSchema("Next of kin address"),
});
