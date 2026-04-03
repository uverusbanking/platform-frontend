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
import { defaultApiResponse } from "@/lib/resources";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ICustomerData } from "../AddCustomerDialog";
import DisplayRespondsMessage from "@/components/DisplayResponse";
import { previewSchema } from "@/lib/schemas/customer/preview.schema";
import { Gender } from "@/types/enums";

const formSchema = previewSchema;

interface Props {
  data: ICustomerData;
  nextStep: (data: ICustomerData) => void;
  prevStep: () => void;
}

export function PreviewSteps({ data, nextStep, prevStep }: Props) {
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      email: data.email,
      bvn: data.bvn,
      phoneNumber: data.phoneNumber,
      dob: data.dob,
      gender: data.gender as Gender,
    },
  });

  useEffect(() => {
    if (data) {
      setValue("firstName", data.firstName, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("middleName", data.middleName, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("lastName", data.lastName, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("email", data.email, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("bvn", data.bvn, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("phoneNumber", data.phoneNumber, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("dob", data.dob, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("gender", data.gender as Gender, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    return () => {};
  }, [data]);

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    setApiResponse(defaultApiResponse);

    nextStep({ ...data, middleName: formData.middleName || "" });
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
                disabled
                readOnly
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
                readOnly
                disabled
                placeholder="Enter last name"
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
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                {...register("email")}
                readOnly
                disabled
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
                aria-invalid={!!errors.phoneNumber}
                aria-describedby="phoneNumber-error"
                {...register("phoneNumber")}
                readOnly
                disabled
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
              <Label htmlFor="dob">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dob"
                type="date"
                aria-invalid={!!errors.dob}
                aria-describedby="dob-error"
                {...register("dob")}
                readOnly
                disabled
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
                value={data?.gender as Gender}
                onValueChange={(value) => setValue("gender", value as Gender)}
                disabled
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
            </div>
          </div>
        </CardContent>
      </Card>

      <DisplayRespondsMessage response={apiResponse} />

      <DialogFooter className="flex justify-between mt-6">
        <div className="flex gap-2">
          <Button variant="outline" onClick={prevStep}>
            Previous
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
