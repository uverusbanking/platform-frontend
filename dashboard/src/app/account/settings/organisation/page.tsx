"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Building, Mail, MapPin, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { useUserStore } from "@/state/userStore";
import { useGetOrganisation } from "@/hooks/queries/useOrganisationQueries";
import { useUpdateOrganisation } from "@/hooks/mutations/useOrganisationMutations";
import {
  IOrganisation,
  IUpdateOrganisationPayload,
} from "@/types/organisation.types";

export default function OrganisationSettingsPage() {
  const { userData } = useUserStore();
  const { data: orgData, isLoading } = useGetOrganisation();
  const { mutate: updateOrg, isPending: isUpdating } = useUpdateOrganisation();

  const organisation = orgData?.data;
  const isOwner = userData?.role?.toUpperCase() === "ORGANISATION_OWNER";

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<IUpdateOrganisationPayload>();

  useEffect(() => {
    if (organisation) {
      reset({
        name: organisation.organisation_name,
        email: organisation.business_email,
        phone_number: organisation.business_phone,
        address: organisation.registered_address_street,
        description: organisation.description || "",
        website: organisation.website || "",
      });
    }
  }, [organisation, reset]);

  const onSubmit = (data: IUpdateOrganisationPayload) => {
    updateOrg(data, {
      onSuccess: () => {
        toast.success("Organisation details updated successfully");
        reset(data);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update organisation details");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md overflow-hidden">
      <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-600">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">
                Organisation Settings
              </CardTitle>
              <CardDescription>
                Manage your organisation&apos;s public presence.
              </CardDescription>
            </div>
          </div>
          {!isOwner && (
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-700 border-orange-200"
            >
              <Shield className="w-3 h-3 mr-1" />
              View Only
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
          <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30 text-muted-foreground">
            {organisation?.logo_url ? (
              <img
                src={organisation.logo_url}
                alt="Logo"
                className="h-full w-full object-cover rounded-2xl"
              />
            ) : (
              <Building className="h-8 w-8 opacity-50" />
            )}
          </div>
          <div className="space-y-1 py-1">
            <h3 className="text-xl font-bold">
              {organisation?.organisation_name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {organisation?.business_email}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {organisation?.registered_address_street}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2.5">
              <Label
                htmlFor="org_name"
                className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
              >
                Company Name
              </Label>
              <Input
                id="org_name"
                disabled={!isOwner}
                {...register("name")}
                className="bg-muted/30 border-transparent focus:border-orange-500/20 focus:bg-background transition-all h-11"
              />
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="org_email"
                className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
              >
                Email Address
              </Label>
              <Input
                id="org_email"
                type="email"
                disabled={!isOwner}
                {...register("email")}
                className="bg-muted/30 border-transparent focus:border-orange-500/20 focus:bg-background transition-all h-11"
              />
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="org_phone"
                className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
              >
                Phone Number
              </Label>
              <Input
                id="org_phone"
                disabled={!isOwner}
                {...register("phone_number")}
                className="bg-muted/30 border-transparent focus:border-orange-500/20 focus:bg-background transition-all h-11 font-mono"
              />
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="org_website"
                className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
              >
                Website
              </Label>
              <Input
                id="org_website"
                placeholder="https://..."
                disabled={!isOwner}
                {...register("website")}
                className="bg-muted/30 border-transparent focus:border-orange-500/20 focus:bg-background transition-all h-11 text-blue-600 underline-offset-4"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="org_address"
              className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
            >
              Office Address
            </Label>
            <Input
              id="org_address"
              disabled={!isOwner}
              {...register("address")}
              className="bg-muted/30 border-transparent focus:border-orange-500/20 focus:bg-background transition-all h-11"
            />
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="org_description"
              className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
            >
              Description
            </Label>
            <Textarea
              id="org_description"
              disabled={!isOwner}
              {...register("description")}
              className="bg-muted/30 border-transparent focus:border-orange-500/20 focus:bg-background transition-all min-h-[100px] resize-none p-4 leading-relaxed"
              placeholder="Tell us about your company..."
            />
          </div>

          {isOwner && (
            <div className="flex justify-end pt-4 border-t border-border/40">
              <Button
                type="submit"
                disabled={isUpdating || !isDirty}
                className="min-w-[150px] shadow-sm bg-orange-600 hover:bg-orange-700 text-white font-bold h-11 rounded-xl"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Details"
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
