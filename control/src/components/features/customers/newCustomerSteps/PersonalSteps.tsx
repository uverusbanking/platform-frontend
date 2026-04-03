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
import DisplayRespondsMessage from "@/components/DisplayResponse";
import { useVerifyNewCustomerRegistration } from "@/hooks/mutations/useCustomerRegistrationMutations";
import { apiErrorResponse } from "@/lib/axios";
import { IVerifyNewCustomerRegistrationPayload } from "@/types/customer.types";
import { useUserStore } from "@/state/userStore";
import { personalSchema } from "@/lib/schemas/customer/personal.schema";

const FormSchema = personalSchema;

interface Props {
  data?: z.infer<typeof FormSchema>;
  nextStep: (data: z.infer<typeof FormSchema>) => void;
  closeDialog: () => void;
}

export function PersonalSteps({ data, nextStep, closeDialog }: Props) {
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);
  const userData = useUserStore((state) => state.userData);
  const { mutateAsync: verifyNewCustomerRegistration } =
    useVerifyNewCustomerRegistration();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: data,
  });

  useEffect(() => {
    if (data) {
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
      setValue("gender", data.gender, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    return () => {};
  }, [data]);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    setApiResponse(defaultApiResponse);
    console.log(formData);

    const payload: IVerifyNewCustomerRegistrationPayload = {
      email: formData.email,
      bvn: formData.bvn,
      phone_number: formData.phoneNumber,
      dob: formData.dob,
      gender: formData.gender,
      company_id: userData.organisation_id || "",
      environment: userData.view_mode || "LIVE",
    };

    await verifyNewCustomerRegistration(payload, {
      onSuccess: (data) => {
        console.log(data);
        const personalInfo = {
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: "",
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dob: toDateInputValue(data.dob),
          gender: formData.gender,
          bvn: data.bvn,
        };

        nextStep(personalInfo);
      },
      onError: (error) => {
        const err = apiErrorResponse(error);

        setApiResponse({
          display: true,
          status: false,
          message: err.error || "Something went wrong",
          errorMsg: err.errorMsgs,
        });
      },
    });
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
                {...register("gender")}
                value={watch("gender")}
                onValueChange={(value) => {
                  setValue(
                    "gender",
                    value as z.infer<typeof FormSchema>["gender"],
                    {
                      shouldValidate: true,
                      shouldTouch: true,
                      shouldDirty: true,
                    },
                  );
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
            className="cursor-pointer"
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
