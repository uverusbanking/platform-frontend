import { z } from "zod";
import { organisationDirectorSchema } from "./organisationDirector.schema";
import { requiredStringSchema } from "../fields/requiredString.schema";
import { postalCodeSchema } from "../fields/postalCode.schema";
import { tinSchema } from "../fields/tin.schema";
import { cacNumberSchema } from "../fields/cacNumber.schema";
import { emailSchema } from "../fields/email.schema";
import { phoneNumberSchema } from "../fields/phoneNumber.schema";
import { documentSchema } from "./organizationDocument.schema";

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || z.string().url().safeParse(v).success, {
    message: "Must be a valid URL",
  })
  .optional();

const hexColor = z
  .string()
  .trim()
  .refine((v) => v === "" || /^#[0-9A-Fa-f]{6}$/.test(v), {
    message: "Must be a valid hex colour (e.g. #0052FF)",
  })
  .optional();

const brandConfigSchema = z.object({
  brandName: z.string().trim().optional(),
  shortBrandName: z.string().trim().optional(),
  brandLogoUrl: optionalUrl,
  brandIconUrl: optionalUrl,
  primaryColor: hexColor,
  secondaryColor: hexColor,
  supportEmail: z
    .string()
    .trim()
    .refine((v) => v === "" || z.string().email().safeParse(v).success, {
      message: "Must be a valid email",
    })
    .optional(),
  supportPhone: z.string().trim().optional(),
  websiteUrl: optionalUrl,
  privacyUrl: optionalUrl,
  termsUrl: optionalUrl,
  seo: z
    .object({
      title: z.string().trim().optional(),
      description: z.string().trim().optional(),
      author: z.string().trim().optional(),
    })
    .optional(),
});

const identifiersSchema = z.object({
  slug: z
    .string()
    .trim()
    .refine((v) => v === "" || /^[a-z][a-z0-9-]{2,31}$/.test(v), {
      message:
        "Slug must be 3–32 chars, start with a letter, and contain only lowercase letters, numbers, and hyphens",
    })
    .optional(),
  prefix: z
    .string()
    .trim()
    .max(10, "Prefix must be 10 characters or fewer")
    .optional(),
  short_name: z
    .string()
    .trim()
    .max(30, "Trading name must be 30 characters or fewer")
    .optional(),
  short_code: z
    .string()
    .trim()
    .refine((v) => v === "" || v.length === 3, {
      message: "Short code must be exactly 3 characters",
    })
    .optional(),
});

const fqdnOrEmpty = z
  .string()
  .trim()
  .refine(
    (v) =>
      v === "" ||
      /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(
        v,
      ),
    {
      message: "Must be a valid domain (e.g. app.example.com)",
    },
  )
  .optional();

const configuredDomainSchema = z.object({
  personal_app: fqdnOrEmpty,
  corporate_app: fqdnOrEmpty,
  marketing: fqdnOrEmpty,
  email: fqdnOrEmpty,
});

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
  config: z
    .object({
      brand: brandConfigSchema.optional(),
      domains: configuredDomainSchema.optional(),
      identifiers: identifiersSchema.optional(),
    })
    .optional(),
});
