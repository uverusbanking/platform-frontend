"use client";

import { useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetLocations } from "@/hooks/queries/useOptionsQueries";
import { ILocation } from "@/types/option.types";

export function BusinessInfoStep() {
  const form = useFormContext();

  // Location fetching logic
  const watchedCountry = form.watch("country");
  const watchedState = form.watch("state");

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

  const countries = countriesResponse?.data || [];
  const states = statesResponse?.data || [];
  const cities = citiesResponse?.data || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-5">
        <FormField
          name="organisationName"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Registered Organisation Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Acme Corporation Ltd"
                  className="h-12 rounded-lg bg-background border-border/60 hover:border-primary/40 focus:border-primary transition-all shadow-sm focus:ring-4 focus:ring-primary/10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="businessEmail"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Business Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="ops@company.com"
                  className="h-12 rounded-lg bg-background border-border/60 hover:border-primary/40 focus:border-primary transition-all shadow-sm focus:ring-4 focus:ring-primary/10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="businessPhone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Business Phone
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="+234..."
                  className="h-12 rounded-lg bg-background border-border/60 hover:border-primary/40 focus:border-primary transition-all shadow-sm focus:ring-4 focus:ring-primary/10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="cacNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                CAC Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="RC123456"
                  className="h-12 rounded-lg bg-background border-border/60 hover:border-primary/40 focus:border-primary transition-all shadow-sm focus:ring-4 focus:ring-primary/10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="tin"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                TIN{" "}
                <span className="normal-case text-[10px] opacity-70">
                  (Tax Identification)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="12345678-0001"
                  className="h-12 rounded-lg bg-background border-border/60 hover:border-primary/40 focus:border-primary transition-all shadow-sm focus:ring-4 focus:ring-primary/10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="py-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px bg-border flex-1" />
          <h4 className="font-bold text-xs uppercase tracking-widest text-primary/80 bg-primary/5 px-3 py-1 rounded-full">
            Office Address
          </h4>
          <div className="h-px bg-border flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <FormField
            name="streetAddress"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Street Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="123 Main St"
                    className="h-12 rounded-lg bg-background border-border/60 hover:border-primary/40 focus:border-primary transition-all shadow-sm focus:ring-4 focus:ring-primary/10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="country"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Country
                </FormLabel>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue("state", "");
                    form.setValue("city", "");
                  }}
                  value={field.value}
                  disabled={isLoadingCountries}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 rounded-lg bg-background border-border/60 hover:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-50">
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
            name="state"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  State
                </FormLabel>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue("city", "");
                  }}
                  value={field.value}
                  disabled={
                    !watchedCountry || isLoadingStates || states.length === 0
                  }
                >
                  <FormControl>
                    <SelectTrigger className="h-12 rounded-lg bg-background border-border/60 hover:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-50">
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
            name="city"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  City
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={
                    !watchedState || isLoadingCities || cities.length === 0
                  }
                >
                  <FormControl>
                    <SelectTrigger className="h-12 rounded-lg bg-background border-border/60 hover:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-50">
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
            name="zipCode"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Zip Code
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="100001"
                    className="h-12 rounded-lg bg-background border-border/60 hover:border-primary/40 focus:border-primary transition-all shadow-sm focus:ring-4 focus:ring-primary/10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
