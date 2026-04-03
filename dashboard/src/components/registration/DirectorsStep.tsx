import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyData } from "@/app/(auth)/register/page";
import DisplayRespondsMessage from "../DisplayResponse";
import { useState } from "react";
import { defaultApiResponse } from "@/utils/resources";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { directorInterface } from "@/types/companyRegistration";
import { directorSchema } from "@/lib/schemas/registration/director.schema";

const FormSchema = directorSchema;

interface DirectorsStepProps {
  data: CompanyData;
  onChange: (data: CompanyData) => void;

  handlePrevious: () => void;
  handleNext: () => void;
  handleSubmitBtn: () => void;
  currentStep: number;
  steps: unknown[];
}

export function DirectorsStep({
  data,
  onChange,
  handlePrevious,
  handleNext,
  handleSubmitBtn,
  currentStep,
  steps,
}: DirectorsStepProps) {
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);
  const [directors, setDirectors] = useState<directorInterface[]>(
    () => data.directors ?? [],
  );

  const {
    register,
    setValue,
    getValues,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    setApiResponse(defaultApiResponse);

    const director: directorInterface = {
      // id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName,
      bvn: formData.bvn,
      nin: formData.nin,
      idType: formData.idType,
      idNumber: formData.idNumber,
      streetAddress: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      ownershipPercentage: Number(formData.ownershipPercentage),
      isBeneficialOwner: formData.isBeneficialOwner ? true : false,
    };

    setDirectors([...directors, director]);
    reset();
  };

  const handleNextBtn = () => {
    onChange({ ...data, directors });
    handleNext();
    reset();
    setValue("idType", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("isBeneficialOwner", false, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleEditBtn = (bvn: string) => {
    const director = directors.find((d) => d.bvn === bvn);
    if (director) {
      setValue("firstName", director.firstName);
      setValue("lastName", director.lastName);
      setValue("middleName", director.middleName);
      setValue("bvn", director.bvn);
      setValue("nin", director.nin);
      setValue("idType", director.idType);
      setValue("idNumber", director.idNumber);
      setValue("streetAddress", director.streetAddress);
      setValue("city", director.city);
      setValue("state", director.state);
      setValue("zipCode", director.zipCode);
      setValue("country", director.country);
      setValue(
        "ownershipPercentage",
        director.ownershipPercentage
          ? director.ownershipPercentage.toString()
          : "",
      );
      setValue("isBeneficialOwner", director.isBeneficialOwner);

      // remove the BVN from the directors array
      handleRemoveBtn(bvn);
    }
  };

  const handleRemoveBtn = (bvn: string) => {
    const newDirectors = directors.filter((d) => d.bvn !== bvn);
    setDirectors(newDirectors);
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Add all directors and beneficial owners (anyone with 10% or more
          ownership). Each person must provide their BVN, NIN, and valid
          identification.
        </p>
      </div>

      {directors.map((director, index) => (
        <Card key={director.bvn}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">
              Director/Beneficial Owner #{index + 1}
            </CardTitle>

            <div className="flex flex-row items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveBtn(director.bvn)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  handleEditBtn(director.bvn);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  placeholder="John Doe"
                  type="text"
                  inputMode="text"
                  value={director.firstName}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input
                  placeholder="Doe"
                  type="text"
                  inputMode="text"
                  value={director.lastName}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>Middle Name</Label>
                <Input
                  placeholder="Doe"
                  type="text"
                  inputMode="text"
                  value={director.middleName}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>BVN (Bank Verification Number) *</Label>
                <Input
                  placeholder="12345678901"
                  maxLength={11}
                  type="number"
                  inputMode="numeric"
                  value={director.bvn}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>NIN (National Identification Number) *</Label>
                <Input
                  placeholder="12345678901"
                  maxLength={11}
                  type="number"
                  inputMode="numeric"
                  value={director.nin}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>ID Type *</Label>
                <Select value={director.idType} disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national_id">National ID</SelectItem>
                    <SelectItem value="drivers_license">
                      Driver&apos;s License
                    </SelectItem>
                    <SelectItem value="international_passport">
                      International Passport
                    </SelectItem>
                    {/* <SelectItem value="voters_card">Voter's Card</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>ID Number *</Label>
                <Input
                  placeholder="ID number"
                  type="text"
                  inputMode="text"
                  value={director.idNumber}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>Ownership Percentage</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="25"
                  inputMode="numeric"
                  value={director.ownershipPercentage}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>Street Address *</Label>
                <Input
                  type="text"
                  placeholder="Full registered company address"
                  value={director.streetAddress}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>Zip Code</Label>
                <Input
                  type="text"
                  placeholder="Zip Code"
                  value={director.zipCode}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>City *</Label>
                <Input
                  type="text"
                  placeholder="City"
                  value={director.city}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>State *</Label>
                <Input
                  type="text"
                  placeholder="State"
                  value={director.state}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label>Country *</Label>
                <Input
                  type="text"
                  placeholder="Country"
                  value={director.country}
                  readOnly
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isBeneficialOwner"
                checked={director.isBeneficialOwner}
                disabled
              />
              <label
                htmlFor="isBeneficialOwner"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                This person is a beneficial owner (≥10% ownership)
              </label>
            </div>
          </CardContent>
        </Card>
      ))}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John Doe"
                  type="text"
                  inputMode="text"
                  aria-invalid={!!errors.firstName}
                  aria-describedby="firstName-error"
                  {...register("firstName")}
                />

                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1" id="firstName-error">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  type="text"
                  inputMode="text"
                  aria-invalid={!!errors.lastName}
                  aria-describedby="lastName-error"
                  {...register("lastName")}
                />

                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1" id="lastName-error">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  placeholder="Doe"
                  type="text"
                  inputMode="text"
                  aria-invalid={!!errors.middleName}
                  aria-describedby="middleName-error"
                  {...register("middleName")}
                />

                {errors.middleName && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="middleName-error"
                  >
                    {errors.middleName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bvn">BVN (Bank Verification Number) *</Label>
                <Input
                  id="bvn"
                  placeholder="12345678901"
                  maxLength={11}
                  type="number"
                  inputMode="numeric"
                  {...register("bvn")}
                  aria-invalid={!!errors.bvn}
                  aria-describedby="bvn-error"
                />

                {errors.bvn && (
                  <p className="text-red-500 text-sm mt-1" id="bvn-error">
                    {errors.bvn.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nin">
                  NIN (National Identification Number) *
                </Label>
                <Input
                  id="nin"
                  placeholder="12345678901"
                  maxLength={11}
                  type="number"
                  inputMode="numeric"
                  {...register("nin")}
                  aria-invalid={!!errors.nin}
                  aria-describedby="nin-error"
                />

                {errors.nin && (
                  <p className="text-red-500 text-sm mt-1" id="nin-error">
                    {errors.nin.message}
                  </p>
                )}
              </div>

              {/* ID Type */}
              <div className="space-y-2">
                <Label htmlFor="idType">ID Type *</Label>
                <Select
                  // {...register('idType')}
                  aria-invalid={!!errors.idType}
                  aria-describedby="idType-error"
                  value={getValues("idType") || ""}
                  onValueChange={(e) => {
                    setValue("idType", e, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NIN">National ID</SelectItem>
                    <SelectItem value="DRIVERS_LICENSE">
                      Driver&apos;s License
                    </SelectItem>
                    <SelectItem value="PASSPORT">
                      International Passport
                    </SelectItem>
                    {/* <SelectItem value="voters_card">Voter's Card</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              {/* ID Number */}
              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number *</Label>
                <Input
                  id="idNumber"
                  placeholder="ID number"
                  type="text"
                  inputMode="text"
                  {...register("idNumber")}
                  aria-invalid={!!errors.idNumber}
                  aria-describedby="idNumber-error"
                />

                {errors.idNumber && (
                  <p className="text-red-500 text-sm mt-1" id="idNumber-error">
                    {errors.idNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownershipPercentage">
                  Ownership Percentage
                </Label>
                <Input
                  id="ownershipPercentage"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="25"
                  inputMode="numeric"
                  {...register("ownershipPercentage")}
                  aria-invalid={!!errors.ownershipPercentage}
                  aria-describedby="ownershipPercentage-error"
                />

                {errors.ownershipPercentage && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="ownershipPercentage-error"
                  >
                    {errors.ownershipPercentage.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address *</Label>
                <Input
                  id="streetAddress"
                  type="text"
                  placeholder="Full registered company address"
                  aria-invalid={!!errors.streetAddress}
                  aria-describedby="streetAddress-error"
                  {...register("streetAddress")}
                />
                {errors.streetAddress && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="streetAddress-error"
                  >
                    {errors.streetAddress.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  type="text"
                  placeholder="Zip Code"
                  aria-invalid={!!errors.zipCode}
                  aria-describedby="zipCode-error"
                  {...register("zipCode")}
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-1" id="zipCode-error">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="City"
                  aria-invalid={!!errors.city}
                  aria-describedby="city-error"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1" id="city-error">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="State"
                  aria-invalid={!!errors.state}
                  aria-describedby="state-error"
                  {...register("state")}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1" id="state-error">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="Country"
                  aria-invalid={!!errors.country}
                  aria-describedby="country-error"
                  {...register("country")}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1" id="country-error">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isBeneficialOwner"
                checked={getValues("isBeneficialOwner")}
                onCheckedChange={(checked) =>
                  setValue("isBeneficialOwner", checked ? true : false, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
              <label
                htmlFor="isBeneficialOwner"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                This person is a beneficial owner (≥10% ownership)
              </label>
            </div>
          </CardContent>
        </Card>

        {directors.length <= 4 && (
          <Button type="submit" variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Director/Beneficial Owner
          </Button>
        )}

        {directors.length === 0 && (
          <p className="text-sm text-destructive">
            At least one director or beneficial owner is required
          </p>
        )}

        <DisplayRespondsMessage response={apiResponse} />
      </form>

      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button
            type="button"
            disabled={!directors.length}
            onClick={() => handleNextBtn()}
          >
            Next
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmitBtn}>
            Submit Application
          </Button>
        )}
      </div>
    </div>
  );
}
