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
import { useForm, type Resolver, type UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultApiResponse } from "@/utils/resources";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import DisplayRespondsMessage from "@/components/DisplayResponse";
import { useUserStore } from "@/state/userStore";
import { personalSchema } from "@/lib/schemas/customer/personal.schema";
import { ICustomerData } from "../AddCustomerDialog";

const FormSchema = personalSchema;
type FormValues = Pick<
  ICustomerData,
  | "firstName"
  | "lastName"
  | "middleName"
  | "email"
  | "bvn"
  | "phoneNumber"
  | "dob"
  | "gender"
>;
const resolver = zodResolver(FormSchema) as Resolver<FormValues>;

interface Props {
  data?: FormValues;
  nextStep: (data: FormValues) => void;
  closeDialog: () => void;
}

export function PersonalSteps({ data, nextStep, closeDialog }: Props) {
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);
  const userData = useUserStore((state) => state.userData);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver,
    mode: "onChange",
    defaultValues: data as FormValues,
  });

  const genderValue = watch("gender");
  const setFormValue = setValue as UseFormSetValue<FormValues>;

  useEffect(() => {
    if (data) {
      setFormValue("firstName", data.firstName, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setFormValue("lastName", data.lastName, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setFormValue("middleName", data.middleName || "", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setFormValue("email", data.email, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setFormValue("bvn", data.bvn, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setFormValue("phoneNumber", data.phoneNumber, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setFormValue("dob", data.dob, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setFormValue("gender", data.gender, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    return () => {};
  }, [data]);

  const onSubmit = async (formData: FormValues) => {
    setApiResponse(defaultApiResponse);

    const personalInfo = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName || "",
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      dob: formData.dob,
      gender: formData.gender,
      bvn: formData.bvn,
    };

    nextStep(personalInfo);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
          <CardDescription>Basic personal details</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                aria-invalid={!!errors.firstName}
                aria-describedby="firstName-error"
                {...register("firstName")}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1" id="firstName-error">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                aria-invalid={!!errors.lastName}
                aria-describedby="lastName-error"
                {...register("lastName")}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1" id="lastName-error">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name</Label>
            <Input
              id="middleName"
              aria-invalid={!!errors.middleName}
              aria-describedby="middleName-error"
              {...register("middleName")}
              placeholder="Enter middle name"
            />
            {errors.middleName && (
              <p className="text-red-500 text-sm mt-1" id="middleName-error">
                {errors.middleName.message}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                {...register("email")}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1" id="email-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                inputMode="tel"
                aria-invalid={!!errors.phoneNumber}
                aria-describedby="phoneNumber-error"
                {...register("phoneNumber")}
                placeholder="+234 XXX XXX XXXX"
              />

              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1" id="phoneNumber-error">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bvn">
                BVN <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bvn"
                type="text"
                inputMode="text"
                aria-invalid={!!errors.bvn}
                aria-describedby="bvn-error"
                {...register("bvn")}
                placeholder="Enter bvn"
              />
              {errors.bvn && (
                <p className="text-red-500 text-sm mt-1" id="bvn-error">
                  {errors.bvn.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                aria-invalid={!!errors.dob}
                aria-describedby="dob-error"
                {...register("dob")}
              />

              {errors.dob && (
                <p className="text-red-500 text-sm mt-1" id="dob-error">
                  {errors.dob.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select
                aria-invalid={!!errors.gender}
                aria-describedby="gender-error"
                value={genderValue}
                onValueChange={(value) => {
                  setFormValue("gender", value as FormValues["gender"], {
                    shouldValidate: true,
                    shouldTouch: true,
                    shouldDirty: true,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>

              {errors.gender && (
                <p className="text-red-500 text-sm mt-1" id="gender-error">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <DisplayRespondsMessage response={apiResponse} />

      <DialogFooter className="flex justify-between mt-6">
        <div className="flex gap-2">
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-primary hover:bg-primary-dark"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
