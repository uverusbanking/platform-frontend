"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Hash,
  ShieldCheck,
  Zap,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IOrganisation } from "@/types/organisation.types";
import { useUpdateOrganisation } from "@/hooks/mutations/usePlatformMutations";
import { useGetLocations } from "@/hooks/queries/useOptionsQueries";
import { ILocation } from "@/types/option.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { organisationSchema } from "@/lib/schemas/platform/organisation.schema";

const EditOrganisationSchema = organisationSchema;

type EditOrganisationValues = z.infer<typeof EditOrganisationSchema>;

interface EditOrganisationDialogProps {
  organisation: IOrganisation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditOrganisationDialog({
  organisation,
  open,
  onOpenChange,
}: EditOrganisationDialogProps) {
  const { mutateAsync: updateOrganisation, isPending } =
    useUpdateOrganisation();

  const form = useForm<EditOrganisationValues>({
    resolver: zodResolver(EditOrganisationSchema),
    defaultValues: {
      organisationName: organisation.organisation_name,
      businessEmail: organisation.business_email,
      businessPhone: organisation.business_phone,
      tin: organisation.tin || "",
      cacNumber: organisation.cac_registration_number || "",
      streetAddress: organisation.registered_address_street || "",
      city: organisation.registered_address_city || "",
      state: organisation.registered_address_state || "",
      country: organisation.registered_address_country || "",
      zipCode: organisation.registered_address_postal_code || "",
      provision_sandbox_token: false,
      live_organisation_id: organisation.id,
    },
  });

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

  useEffect(() => {
    if (open) {
      form.reset({
        organisationName: organisation.organisation_name,
        businessEmail: organisation.business_email,
        businessPhone: organisation.business_phone,
        tin: organisation.tin || "",
        cacNumber: organisation.cac_registration_number || "",
        streetAddress: organisation.registered_address_street || "",
        city: organisation.registered_address_city || "",
        state: organisation.registered_address_state || "",
        country: organisation.registered_address_country || "",
        zipCode: organisation.registered_address_postal_code || "",
        provision_sandbox_token: false,
        live_organisation_id: organisation.id,
      });
    }
  }, [open, organisation, form]);

  const onSubmit = async (data: EditOrganisationValues) => {
    try {
      // Build a payload with only the fields that have actually changed
      const changedFields: Partial<EditOrganisationValues> = {};

      if (data.organisationName !== organisation.organisation_name) {
        changedFields.organisationName = data.organisationName;
      }
      if (data.businessEmail !== organisation.business_email) {
        changedFields.businessEmail = data.businessEmail;
      }
      if (data.businessPhone !== organisation.business_phone) {
        changedFields.businessPhone = data.businessPhone;
      }
      if (data.tin !== (organisation.tin || "")) {
        changedFields.tin = data.tin;
      }
      if (data.cacNumber !== (organisation.cac_registration_number || "")) {
        changedFields.cacNumber = data.cacNumber;
      }
      if (
        data.streetAddress !== (organisation.registered_address_street || "")
      ) {
        changedFields.streetAddress = data.streetAddress;
      }
      if (data.city !== (organisation.registered_address_city || "")) {
        changedFields.city = data.city;
      }
      if (data.state !== (organisation.registered_address_state || "")) {
        changedFields.state = data.state;
      }
      if (data.country !== (organisation.registered_address_country || "")) {
        changedFields.country = data.country;
      }
      if (
        data.zipCode !== (organisation.registered_address_postal_code || "")
      ) {
        changedFields.zipCode = data.zipCode;
      }

      // Always include sandbox provisioning fields if they're set
      if (data.provision_sandbox_token) {
        changedFields.provision_sandbox_token = data.provision_sandbox_token;
        changedFields.live_organisation_id = data.live_organisation_id;
      }

      if (Object.keys(changedFields).length === 0) {
        toast.error("No changes detected. Please modify at least one field.");
        return;
      }

      await updateOrganisation({
        id: organisation.id,
        ...changedFields,
      });

      const fieldCount = Object.keys(changedFields).filter(
        (k) => k !== "live_organisation_id",
      ).length;
      toast.success(`${fieldCount} field(s) updated successfully`);
      onOpenChange(false);
    } catch (error: unknown) {
      const errMsg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to sync organisation";
      toast.error(errMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-none shadow-2xl p-0 bg-surface rounded-2xl bg-white">
        <DialogHeader className="p-8 pb-4 bg-muted/5 border-b border-border/40">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Edit Organisation
              </DialogTitle>
              <DialogDescription className="font-medium">
                Update core business details and registration information.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-8 space-y-8"
          >
            {/* Basic Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px flex-1 bg-border/40" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-2">
                  Basic Information
                </span>
                <span className="h-px flex-1 bg-border/40" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="organisationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Building2 className="w-3 h-3" /> Organisation Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11 rounded-xl bg-muted/30 border-border/40 focus:ring-primary/10 transition-all"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Business Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="h-11 rounded-xl bg-muted/30 border-border/40 focus:ring-primary/10 transition-all"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Phone className="w-3 h-3" /> Business Phone
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11 rounded-xl bg-muted/30 border-border/40 focus:ring-primary/10 transition-all"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Registration Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px flex-1 bg-border/40" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-2">
                  Registration Details
                </span>
                <span className="h-px flex-1 bg-border/40" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Hash className="w-3 h-3" /> TIN
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11 rounded-xl bg-muted/30 border-border/40 focus:ring-primary/10 transition-all font-mono"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cacNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Hash className="w-3 h-3" /> CAC Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11 rounded-xl bg-muted/30 border-border/40 focus:ring-primary/10 transition-all font-mono"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px flex-1 bg-border/40" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-2">
                  Registered Address
                </span>
                <span className="h-px flex-1 bg-border/40" />
              </div>

              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Street Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-11 rounded-xl bg-muted/30 border-border/40 focus:ring-primary/10 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Globe className="w-3 h-3" /> Country
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
                          <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-border/40 focus:ring-primary/10 transition-all">
                            <SelectValue
                              placeholder={
                                isLoadingCountries ? "Loading..." : "Country"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border/40 shadow-xl">
                          {countries.map((country: ILocation) => (
                            <SelectItem
                              key={country.id}
                              value={country.id}
                              className="rounded-lg"
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
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
                          !watchedCountry ||
                          isLoadingStates ||
                          states.length === 0
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-border/40 focus:ring-primary/10 transition-all">
                            <SelectValue
                              placeholder={
                                isLoadingStates ? "Loading..." : "State"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border/40 shadow-xl">
                          {states.map((state: ILocation) => (
                            <SelectItem
                              key={state.id}
                              value={state.id}
                              className="rounded-lg"
                            >
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        City
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={
                          !watchedState ||
                          isLoadingCities ||
                          cities.length === 0
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-border/40 focus:ring-primary/10 transition-all">
                            <SelectValue
                              placeholder={
                                isLoadingCities ? "Loading..." : "City"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border/40 shadow-xl">
                          {cities.map((city: ILocation) => (
                            <SelectItem
                              key={city.id}
                              value={city.name}
                              className="rounded-lg"
                            >
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Zip / Postal Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-11 rounded-xl bg-muted/30 border-border/40 focus:ring-primary/10 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Sandbox Sync Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px flex-1 bg-border/40" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-2">
                  Synchronization & Sandbox
                </span>
                <span className="h-px flex-1 bg-border/40" />
              </div>

              <Card className="border border-primary/10 bg-primary/5 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <FormField
                    control={form.control}
                    name="provision_sandbox_token"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-xl">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-bold flex items-center gap-2 text-primary">
                            <Zap className="w-4 h-4 fill-primary" /> Provision
                            Sandbox Token
                          </FormLabel>
                          <FormDescription className="text-xs font-medium text-muted-foreground max-w-[280px]">
                            Generate environment tokens and sync registration
                            data to the sandbox environment.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="px-6 h-12 rounded-xl font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="px-8 h-12 bg-gradient-primary hover:opacity-90 shadow-lg shadow-primary/20 font-bold rounded-xl transition-all active:scale-[0.98] min-w-[160px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Synchronizing...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
