"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Building2,
  Users,
  FileText,
  ShieldCheck,
  Loader2,
  Settings2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  useRegisterOrganisation,
  useCheckOrganisationExists,
  useUpdateBrandSettings,
  useUpdateConfiguredDomains,
  useUpdateOrganisation,
} from "@/hooks/mutations/usePlatformMutations";
import { IBrandConfig } from "@/types/organisation.types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useIsFetching } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import axios, { AxiosError } from "axios";

import { BusinessInfoStep } from "./onboarding/BusinessInfoStep";
import { DirectorsStep } from "./onboarding/DirectorsStep";
import { OrganisationDocumentsStep } from "./onboarding/OrganisationDocumentsStep";
import { BrandConfigStep } from "./onboarding/BrandConfigStep";
import { ReviewStep } from "./onboarding/ReviewStep";
import { FieldErrors, Path } from "react-hook-form";
import { OrganisationOnboardSchema } from "@/lib/schemas/platform/organisationOnboard.schema";

const formSchema = OrganisationOnboardSchema;

type FormValues = z.infer<typeof formSchema>;

export function OnboardOrganisationDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isVerifyingOrg, setIsVerifyingOrg] = useState(false);
  const registerMutation = useRegisterOrganisation();
  const checkOrgMutation = useCheckOrganisationExists();
  const brandSettingsMutation = useUpdateBrandSettings();
  const configuredDomainsMutation = useUpdateConfiguredDomains();
  const updateOrgMutation = useUpdateOrganisation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organisationName: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      tin: "",
      cacNumber: "",
      businessEmail: "",
      businessPhone: "",
      directors: [
        {
          firstName: "",
          lastName: "",
          middleName: "",
          bvn: "",
          nin: "",
          idType: "NIN",
          idDocument: { id: "", fileUrl: "", documentType: "idDocument" },
          streetAddress: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          ownershipPercentage: 0,
          isBeneficialOwner: true,
        },
      ],
      documents: {
        cacCertificate: { id: "", fileUrl: "", documentType: "cacCertificate" },
        memorandum: { id: "", fileUrl: "", documentType: "memorandum" },
        boardResolution: {
          id: "",
          fileUrl: "",
          documentType: "boardResolution",
        },
        proofOfAddress: { id: "", fileUrl: "", documentType: "proofOfAddress" },
        uboDeclaration: { id: "", fileUrl: "", documentType: "uboDeclaration" },
      },
      config: {
        brand: {
          brandName: "",
          shortBrandName: "",
          brandLogoUrl: "",
          brandIconUrl: "",
          primaryColor: "",
          secondaryColor: "",
          supportEmail: "",
          supportPhone: "",
          websiteUrl: "",
          privacyUrl: "",
          termsUrl: "",
          seo: { title: "", description: "", author: "" },
        },
        domains: {
          personal_app: "",
          corporate_app: "",
          marketing: "",
          email: "",
        },
        identifiers: {
          slug: "",
          prefix: "",
          short_name: "",
          short_code: "",
        },
      },
    },
  });

  function showApiError(error: unknown, title: string) {
    const data = axios.isAxiosError(error)
      ? (error.response?.data as
          | { message?: string; errors?: string[] }
          | undefined)
      : undefined;
    const errors = data?.errors ?? [];
    const items = errors.length > 0 ? errors : [data?.message ?? title];
    toast.error(title, {
      description: (
        <ul className="mt-1 space-y-0.5">
          {items.map((e, i) => (
            <li key={i} className="text-xs">
              · {e}
            </li>
          ))}
        </ul>
      ),
      duration: 6000,
    });
  }

  const onSubmit = async (values: FormValues) => {
    // Registration is the critical step — abort on failure
    let orgId: string | undefined;
    try {
      const org = await registerMutation.mutateAsync(values);
      orgId = org.data?.organisation?.id ?? org.data?.id;
    } catch (error) {
      console.error("Registration error:", error);
      showApiError(error, "Failed to register organisation");
      return;
    }

    if (!orgId) {
      toast.error("Organisation created but ID could not be resolved.");
      return;
    }

    let hasConfigError = false;

    const brand = values.config?.brand;
    const hasBrandData =
      brand &&
      Object.values(brand).some((v) =>
        typeof v === "string" ? v.trim() !== "" : !!v,
      );
    if (hasBrandData) {
      try {
        await brandSettingsMutation.mutateAsync({
          id: orgId,
          brand: brand as IBrandConfig,
        });
      } catch (err) {
        hasConfigError = true;
        showApiError(err, "Brand configuration couldn't be saved");
      }
    }

    const domains = values.config?.domains;
    const hasDomains =
      domains &&
      Object.values(domains).some(
        (v) => typeof v === "string" && v.trim() !== "",
      );
    if (hasDomains) {
      try {
        await configuredDomainsMutation.mutateAsync({ id: orgId, ...domains });
      } catch (err) {
        hasConfigError = true;
        showApiError(err, "Domain configuration couldn't be saved");
      }
    }

    const identifiers = values.config?.identifiers;
    const hasIdentifiers =
      identifiers &&
      Object.values(identifiers).some(
        (v) => typeof v === "string" && v.trim() !== "",
      );
    if (hasIdentifiers) {
      try {
        await updateOrgMutation.mutateAsync({
          id: orgId,
          slug: identifiers.slug || undefined,
          prefix: identifiers.prefix || undefined,
          short_name: identifiers.short_name || undefined,
          short_code: identifiers.short_code || undefined,
        });
      } catch (err) {
        hasConfigError = true;
        showApiError(err, "Organisation identifiers couldn't be saved");
      }
    }

    if (hasConfigError) {
      toast.warning(
        "Organisation created — some settings couldn't be saved. Review the errors and update via the edit dialog.",
        { duration: 8000 },
      );
    } else {
      toast.success("Organisation onboarded successfully!");
    }
    setOpen(false);
    form.reset();
    setStep(1);
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Validation errors:", errors);
    toast.error("Please fill in all required fields correctly.");
  };

  const nextStep = async () => {
    let fieldsToValidate: Path<FormValues>[] = [];
    if (step === 1) {
      fieldsToValidate = [
        "organisationName",
        "streetAddress",
        "city",
        "state",
        "zipCode",
        "tin",
        "cacNumber",
        "businessEmail",
        "businessPhone",
      ];
    } else if (step === 2) {
      fieldsToValidate = ["directors"];
    } else if (step === 3) {
      fieldsToValidate = ["documents"];
    } else if (step === 4) {
      fieldsToValidate = ["config"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (!isValid) return;

    if (step === 1) {
      const { cacNumber, tin, businessEmail } = form.getValues();
      setIsVerifyingOrg(true);
      try {
        await checkOrgMutation.mutateAsync({
          cacRegistrationNumber: cacNumber,
          tin,
          businessEmail,
        });
        setIsVerifyingOrg(false);
        setStep(step + 1);
      } catch (error) {
        setIsVerifyingOrg(false);
        const err = error as AxiosError<{ message: string; errors?: string[] }>;
        const message =
          err?.response?.data?.errors?.[0] ||
          err?.response?.data?.message ||
          "Organisation verification failed. It might already exist.";
        toast.error(message);
      }
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const steps = [
    { title: "Business Info", icon: Building2 },
    { title: "Directors", icon: Users },
    { title: "Documents", icon: FileText },
    { title: "Config", icon: Settings2 },
    { title: "Review", icon: ShieldCheck },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="font-bold rounded-xl px-4 cursor-pointer">
            <Plus className="w-5 h-5" />
            Onboard Organisation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Onboard New Organisation</DialogTitle>
        <div className="flex h-[90vh] bg-background">
          {/* Left Sidebar - Steps */}
          <div className="w-[280px] p-8 border-r border-border/40 flex flex-col backdrop-blur-xl">
            <div className="mb-10">
              <Badge
                variant="outline"
                className="mb-4 backdrop-blur-sm border-primary/20 text-primary shadow-sm font-bold tracking-widest text-[10px] uppercase px-3 py-1"
              >
                Admin Panel
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Onboarding
              </h2>
              <p className="text-sm text-muted-foreground mt-1 font-medium leading-relaxed">
                Add a new corporate partner to the ecosystem.
              </p>
            </div>

            <div className="space-y-0 flex-1 relative">
              {/* Connector Line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border/40 z-0 rounded-full" />

              {steps.map((s, i) => {
                const isActive = step === i + 1;
                const isCompleted = step > i + 1;

                return (
                  <div
                    key={s.title}
                    className="relative z-10 flex items-center gap-4 group py-3"
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        borderColor: isActive
                          ? "var(--primary)"
                          : isCompleted
                            ? "var(--success)"
                            : "transparent",
                      }}
                      className={`
                            w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2
                            ${
                              isCompleted
                                ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-500/20"
                                : isActive
                                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/10"
                                  : "bg-white border-border text-muted-foreground group-hover:bg-slate-50 group-hover:border-primary/50"
                            }
                        `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <s.icon className="w-5 h-5" />
                      )}
                    </motion.div>
                    <div className="flex flex-col">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? "text-primary" : "text-muted-foreground/60"}`}
                      >
                        Step 0{i + 1}
                      </span>
                      <span
                        className={`font-bold text-sm transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"}`}
                      >
                        {s.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto pt-8 border-t border-border/40">
              <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 hover:opacity-100 cursor-help">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Verified by
                  </p>
                  <p className="text-xs font-bold text-foreground">
                    Uverus Security
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Form */}
          <div className="flex-1 flex flex-col overflow-hidden bg-surface relative">
            <div className="p-8 pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{steps[step - 1].title}</h3>
                <p className="text-sm text-muted-foreground">
                  Complete the details below to proceed
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-4">
              <Form {...form}>
                <form className="space-y-6">
                  <AnimatePresence mode="wait" initial={false}>
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <BusinessInfoStep />
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <DirectorsStep />
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <OrganisationDocumentsStep />
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <BrandConfigStep />
                      </motion.div>
                    )}

                    {step === 5 && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <ReviewStep />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
                {/* Footer - Actions */}
                <div className="p-8 pt-4 border-t border-border/40 flex justify-between items-center bg-background/50 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      className={`rounded-xl h-12 font-bold px-6 ${step === 1 ? "invisible" : ""}`}
                      onClick={prevStep}
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Back
                    </Button>

                    {useIsFetching({
                      queryKey: [QUERY_KEYS.OPTIONS.LOCATIONS],
                    }) > 0 && (
                      <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">
                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        Syncing Locations...
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {step < 5 ? (
                      <Button
                        type="button"
                        className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 font-bold px-8 shadow-lg shadow-primary/20"
                        onClick={nextStep}
                        disabled={isVerifyingOrg}
                      >
                        {isVerifyingOrg ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Continue
                            <ChevronRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="bg-gradient-primary hover:opacity-90 shadow-fintech text-white rounded-xl h-12 font-bold px-10 min-w-40"
                        onClick={form.handleSubmit(onSubmit, onError)}
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Complete Onboarding"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
