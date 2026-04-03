import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultApiResponse, toDateInputValue } from "@/lib/resources";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ICustomerData } from "../AddCustomerDialog";
import {
  useGetEmploymentStatuses,
  useGetNextOfKinRelationships,
} from "@/hooks/queries/useOptionsQueries";
import { Textarea } from "@/components/ui/textarea";
import { EmploymentSchema } from "@/lib/schemas/customer/employment.schema";

const FormSchema = EmploymentSchema;

interface Props {
  data: ICustomerData;
  nextStep: (data: ICustomerData) => void;
  prevStep: () => void;
  isCreatingCustomer: boolean;
}

export function EmploymentSteps({
  data,
  nextStep,
  prevStep,
  isCreatingCustomer,
}: Props) {
  const { data: employmentStatusesRes, isLoading: isLoadingStatuses } =
    useGetEmploymentStatuses();
  const { data: relationshipsRes, isLoading: isLoadingRelationships } =
    useGetNextOfKinRelationships();

  const employmentStatuses = employmentStatusesRes?.data || [];
  const relationships = relationshipsRes?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    setValue("occupation", data.occupation, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("employer", data.employer, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("monthlyIncome", data.monthlyIncome, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("employmentStatus", data.employmentStatus, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("nextOfKinFirstName", data.nextOfKinFirstName, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("nextOfKinMiddleName", data.nextOfKinMiddleName, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("nextOfKinLastName", data.nextOfKinLastName, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("nextOfKinRelationship", data.nextOfKinRelationship, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("nextOfKinPhone", data.nextOfKinPhone, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("nextOfKinAddress", data.nextOfKinAddress, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    return () => {};
  }, [data]);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    nextStep({ ...data, ...formData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Employment Information</CardTitle>
          <CardDescription>Enter employment details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Employment Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Employment Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation *</Label>
                <Input
                  id="occupation"
                  aria-invalid={!!errors.occupation}
                  aria-describedby="occupation-error"
                  {...register("occupation")}
                  placeholder="Enter occupation"
                />

                {errors.occupation && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="occupation-error"
                  >
                    {errors.occupation.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employer">Employer</Label>
                <Input
                  id="employer"
                  aria-invalid={!!errors.employer}
                  aria-describedby="employer-error"
                  {...register("employer")}
                  placeholder="Enter employer name"
                />

                {errors.employer && (
                  <p className="text-red-500 text-sm mt-1" id="employer-error">
                    {errors.employer.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income (₦)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  aria-invalid={!!errors.monthlyIncome}
                  aria-describedby="monthlyIncome-error"
                  {...register("monthlyIncome")}
                  placeholder="0.00"
                />

                {errors.monthlyIncome && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="monthlyIncome-error"
                  >
                    {errors.monthlyIncome.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentStatus">Employment Status *</Label>
                <Select
                  value={watch("employmentStatus")}
                  onValueChange={(value) =>
                    setValue("employmentStatus", value, {
                      shouldDirty: true,
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                  {...register("employmentStatus")}
                >
                  <SelectTrigger disabled={isLoadingStatuses}>
                    <div className="flex items-center gap-2">
                      {isLoadingStatuses && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      )}
                      <SelectValue
                        placeholder={
                          isLoadingStatuses ? "Loading..." : "Select status"
                        }
                      />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {employmentStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.employmentStatus && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="employmentStatus-error"
                  >
                    {errors.employmentStatus.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Next of Kin Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Next of Kin</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kinFirstName">First Name *</Label>
                <Input
                  id="kinFirstName"
                  aria-invalid={!!errors.nextOfKinFirstName}
                  aria-describedby="kinFirstName-error"
                  {...register("nextOfKinFirstName")}
                  placeholder="Enter first name"
                />

                {errors.nextOfKinFirstName && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="nextOfKinFirstName-error"
                  >
                    {errors.nextOfKinFirstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextOfKinMiddleName">Middle Name</Label>
                <Input
                  id="nextOfKinMiddleName"
                  aria-invalid={!!errors.nextOfKinMiddleName}
                  aria-describedby="nextOfKinMiddleName-error"
                  {...register("nextOfKinMiddleName")}
                  placeholder="Enter middle name"
                />

                {errors.nextOfKinMiddleName && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="nextOfKinMiddleName-error"
                  >
                    {errors.nextOfKinMiddleName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextOfKinLastName">Last Name *</Label>
                <Input
                  id="nextOfKinLastName"
                  aria-invalid={!!errors.nextOfKinLastName}
                  aria-describedby="nextOfKinLastName-error"
                  {...register("nextOfKinLastName")}
                  placeholder="Enter last name"
                />

                {errors.nextOfKinLastName && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="nextOfKinLastName-error"
                  >
                    {errors.nextOfKinLastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nextOfKinPhone">Phone Number *</Label>
                <Input
                  id="nextOfKinPhone"
                  aria-invalid={!!errors.nextOfKinPhone}
                  aria-describedby="nextOfKinPhone-error"
                  {...register("nextOfKinPhone")}
                  placeholder="+234 XXX XXX XXXX"
                />

                {errors.nextOfKinPhone && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="nextOfKinPhone-error"
                  >
                    {errors.nextOfKinPhone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextOfKinRelationship">Relationship *</Label>
                <Select
                  value={watch("nextOfKinRelationship")}
                  onValueChange={(value) =>
                    setValue("nextOfKinRelationship", value, {
                      shouldDirty: true,
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                >
                  <SelectTrigger disabled={isLoadingRelationships}>
                    <div className="flex items-center gap-2">
                      {isLoadingRelationships && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      )}
                      <SelectValue
                        placeholder={
                          isLoadingRelationships
                            ? "Loading..."
                            : "Select relationship"
                        }
                      />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {relationships.map((rel) => (
                      <SelectItem key={rel.value} value={rel.value}>
                        {rel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.nextOfKinRelationship && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="nextOfKinRelationship-error"
                  >
                    {errors.nextOfKinRelationship.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kinAddress">Address</Label>
              <Textarea
                id="kinAddress"
                aria-invalid={!!errors.nextOfKinAddress}
                aria-describedby="nextOfKinAddress-error"
                {...register("nextOfKinAddress")}
                placeholder="Enter address"
                rows={3}
              />

              {errors.nextOfKinAddress && (
                <p
                  className="text-red-500 text-sm mt-1"
                  id="nextOfKinAddress-error"
                >
                  {errors.nextOfKinAddress.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <DialogFooter className="flex justify-between mt-6">
        <div className="flex gap-2">
          <Button variant="outline" onClick={prevStep}>
            Previous
          </Button>

          <Button
            type="submit"
            disabled={isCreatingCustomer}
            className="bg-gradient-primary hover:bg-primary-dark"
          >
            {isCreatingCustomer ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create Customer"
            )}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
