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
import { defaultApiResponse } from "@/utils/resources";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ICustomerData } from "../AddCustomerDialog";
import DisplayRespondsMessage from "@/components/DisplayResponse";
import { Textarea } from "@/components/ui/textarea";
import { useGetLocations } from "@/hooks/endpoints/useOptionsHook";
import { addressSchema } from "@/lib/schemas/customer/address.schema";

const FormSchema = addressSchema;

interface Props {
  data: ICustomerData;
  nextStep: (data: ICustomerData) => void;
  prevStep: () => void;
}

export function AddressSteps({ data, nextStep, prevStep }: Props) {
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      postalCode: data.postalCode || "",
      country: data.country || "",
    },
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const { data: countriesRes, isLoading: isLoadingCountries } =
    useGetLocations();
  const { data: statesRes, isLoading: isLoadingStates } =
    useGetLocations(selectedCountry);
  const { data: lgasRes, isLoading: isLoadingLGAs } =
    useGetLocations(selectedState);

  const countries = countriesRes?.data || [];
  const states = statesRes?.data || [];
  const lgas = lgasRes?.data || [];

  useEffect(() => {
    if (data) {
      setValue("address", data.address, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("city", data.city, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("state", data.state, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("postalCode", data.postalCode, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("country", data.country, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [data, setValue]);

  // Reset state and city when country changes
  useEffect(() => {
    if (selectedCountry && data.country !== selectedCountry) {
      setValue("state", "", { shouldValidate: true });
      setValue("city", "", { shouldValidate: true });
    }
  }, [selectedCountry, setValue, data.country]);

  // Reset city when state changes
  useEffect(() => {
    if (selectedState && data.state !== selectedState) {
      setValue("city", "", { shouldValidate: true });
    }
  }, [selectedState, setValue, data.state]);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    setApiResponse(defaultApiResponse);
    nextStep({ ...data, ...formData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Address Information</CardTitle>
          <CardDescription>Current residential address</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              aria-invalid={!!errors.address}
              aria-describedby="address-error"
              {...register("address")}
              placeholder="Enter full street address"
              rows={3}
            />

            {errors.address && (
              <p className="text-red-500 text-sm mt-1" id="address-error">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("country")}
                onValueChange={(value) =>
                  setValue("country", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger disabled={isLoadingCountries}>
                  <div className="flex items-center gap-2">
                    {isLoadingCountries && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    <SelectValue
                      placeholder={
                        isLoadingCountries ? "Loading..." : "Select country"
                      }
                    />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.slug}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.country && (
                <p className="text-red-500 text-sm mt-1" id="country-error">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">
                State <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("state")}
                disabled={!selectedCountry || isLoadingStates}
                onValueChange={(value) =>
                  setValue("state", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    {isLoadingStates && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    <SelectValue
                      placeholder={
                        isLoadingStates ? "Loading..." : "Select state"
                      }
                    />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.slug}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.state && (
                <p className="text-red-500 text-sm mt-1" id="state-error">
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">
                City/LGA <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("city")}
                disabled={!selectedState || isLoadingLGAs}
                onValueChange={(value) =>
                  setValue("city", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    {isLoadingLGAs && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    <SelectValue
                      placeholder={isLoadingLGAs ? "Loading..." : "Select LGA"}
                    />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {lgas.map((lga) => (
                    <SelectItem key={lga.id} value={lga.slug}>
                      {lga.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.city && (
                <p className="text-red-500 text-sm mt-1" id="city-error">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                aria-invalid={!!errors.postalCode}
                aria-describedby="postalCode-error"
                {...register("postalCode")}
                placeholder="Enter postal code"
              />

              {errors.postalCode && (
                <p className="text-red-500 text-sm mt-1" id="postalCode-error">
                  {errors.postalCode.message}
                </p>
              )}
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
