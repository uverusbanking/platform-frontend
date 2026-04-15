"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetLocations,
  useGetKYCDocumentTypes,
} from "@/hooks/queries/useOptionsQueries";
import { Loader2, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ILocation, IKYCDocumentType } from "@/types/option.types";

import { DocumentRow } from "./DocumentRow";

interface DirectorCardProps {
  index: number;
  remove: (index: number) => void;
  fieldsCount: number;
}

export function DirectorCard({
  index,
  remove,
  fieldsCount,
}: DirectorCardProps) {
  const fileTypes = ["JPG", "JPEG", "PNG", "PDF"];

  const { watch, setValue, control } = useFormContext();
  const watchedCountry = watch(`directors.${index}.country`);
  const watchedState = watch(`directors.${index}.state`);
  const watchedDocType = watch(`directors.${index}.idType`);

  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useGetLocations({ type: "COUNTRY" });
  const { data: statesResponse, isLoading: isLoadingStates } = useGetLocations({
    parent_id: watchedCountry,
    type: "STATE",
  });
  const { data: citiesResponse, isLoading: isLoadingCities } = useGetLocations({
    parent_id: watchedState,
    type: "LGA",
  });
  const { data: kycDocTypesResponse, isLoading: isLoadingDocTypes } =
    useGetKYCDocumentTypes();

  const countries = countriesResponse?.data || [];
  const states = statesResponse?.data || [];
  const cities = citiesResponse?.data || [];
  const kycDocTypes = kycDocTypesResponse?.data || [];

  return (
    <Card className="border-border/40 bg-muted/10 overflow-hidden rounded-2xl relative group/card mb-6">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="rounded-lg font-bold">
            Director #{index + 1}
          </Badge>
          {fieldsCount > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-error hover:bg-error/10 hover:text-error opacity-0 group-hover/card:opacity-100 transition-opacity"
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name={`directors.${index}.firstName`}
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    className="h-11 rounded-xl bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={`directors.${index}.lastName`}
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    className="h-11 rounded-xl bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={`directors.${index}.bvn`}
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">BVN</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12345678901"
                    maxLength={11}
                    className="h-11 rounded-xl bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={`directors.${index}.nin`}
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">NIN</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12345678901"
                    maxLength={11}
                    className="h-11 rounded-xl bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={`directors.${index}.idType`}
            control={control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="font-bold">ID Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoadingDocTypes}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-xl bg-background disabled:cursor-not-allowed disabled:opacity-50">
                      <SelectValue
                        placeholder={
                          isLoadingDocTypes ? "Loading..." : "Select ID Type"
                        }
                      />
                      {isLoadingDocTypes && (
                        <Loader2 className="w-4 h-4 animate-spin opacity-50 absolute right-8" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {kycDocTypes.map((docType: IKYCDocumentType) => (
                      <SelectItem key={docType.value} value={docType.value}>
                        {docType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2">
            <DocumentRow
              key={"idDocument"}
              doc={{
                label: watchedDocType?.replace(/_/g, " "),
                key: `directors.${index}.idDocument`,
                desc: `Upload ${watchedDocType?.replace(/_/g, " ")}`,
              }}
            />
          </div>
        </div>

        <div className="pt-2">
          <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Director Address
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name={`directors.${index}.streetAddress`}
              control={control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-bold">Street Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Director St"
                      className="h-11 rounded-xl bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`directors.${index}.country`}
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Country</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      setValue(`directors.${index}.state`, "");
                      setValue(`directors.${index}.city`, "");
                    }}
                    value={field.value}
                    disabled={isLoadingCountries}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl bg-background disabled:cursor-not-allowed disabled:opacity-50">
                        <SelectValue
                          placeholder={
                            isLoadingCountries ? "Loading..." : "Select Country"
                          }
                        />
                        {isLoadingCountries && (
                          <Loader2 className="w-4 h-4 animate-spin opacity-50 absolute right-8" />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country: ILocation) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`directors.${index}.state`}
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">State</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      setValue(`directors.${index}.city`, "");
                    }}
                    value={field.value}
                    disabled={
                      !watchedCountry || isLoadingStates || states.length === 0
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl bg-background disabled:cursor-not-allowed disabled:opacity-50">
                        <SelectValue
                          placeholder={
                            isLoadingStates ? "Loading..." : "Select State"
                          }
                        />
                        {isLoadingStates && (
                          <Loader2 className="w-4 h-4 animate-spin opacity-50 absolute right-8" />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map((state: ILocation) => (
                        <SelectItem key={state.id} value={state.id}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`directors.${index}.city`}
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">City</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={
                      !watchedState || isLoadingCities || cities.length === 0
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl bg-background disabled:cursor-not-allowed disabled:opacity-50">
                        <SelectValue
                          placeholder={
                            isLoadingCities ? "Loading..." : "Select City"
                          }
                        />
                        {isLoadingCities && (
                          <Loader2 className="w-4 h-4 animate-spin opacity-50 absolute right-8" />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city: ILocation) => (
                        <SelectItem key={city.id} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`directors.${index}.zipCode`}
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Zip Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="100001"
                      className="h-11 rounded-xl bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <FormField
            name={`directors.${index}.ownershipPercentage`}
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Ownership (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100"
                    className="h-11 rounded-xl bg-background"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={`directors.${index}.isBeneficialOwner`}
            control={control}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border/40 p-3 bg-white/50">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-bold">
                    UBO Status
                  </FormLabel>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    Beneficial Owner
                  </div>
                </div>
                <FormControl>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-md border-primary text-primary focus:ring-primary"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
