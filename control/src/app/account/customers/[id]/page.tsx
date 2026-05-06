"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Link as LinkIcon,
  CreditCard,
  User,
  Shield,
  Wallet,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  History,
  Edit,
  Lock as LockIcon,
  Copy,
  Snowflake,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useGetPlatformCustomerWallets } from "@/hooks/endpoints/useWallet";
import { useUserStore } from "@/state/userStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { FreezeCustomerDialog } from "@/components/features/customers/FreezeCustomerDialog";
import { UnFreezeCustomerDialog } from "@/components/features/customers/UnFreezeCustomerDialog";
import { TransactionDetailModal } from "@/components/features/transactions/TransactionDetailModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CustomerActivityTab } from "./CustomerActivityTab";
import { can } from "@/auth/can";
import { PERMISSIONS } from "@/auth/permissions";
import { useGetCustomerById } from "@/hooks/queries/useCustomerQueries";
import { useGetPlatformCustomerTransactions } from "@/hooks/queries/useTransactionQueries";


export default function CustomerDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [showFreezeDialog, setShowFreezeDialog] = useState(false);
  const [showUnfreezeDialog, setShowUnfreezeDialog] = useState(false);
  const [activeWalletIdx, setActiveWalletIdx] = useState(0);
  const { data: customerResponse, isLoading } = useGetCustomerById(id);
  const customer = customerResponse?.data;

  const statusValue = String(customer?.status ?? "").toLowerCase();
  const isFrozen = statusValue === "frozen";
  const statusClassMap = {
    active: "bg-success/10 text-success border-success/20",
    frozen: "bg-destructive/10 text-destructive border-destructive/20",
    blocked: "bg-destructive/10 text-destructive border-destructive/20",
  } as const;
  const statusBadgeClass =
    statusValue in statusClassMap
      ? statusClassMap[statusValue as keyof typeof statusClassMap]
      : "bg-muted/40 text-muted-foreground border-border/40";

  const userData = useUserStore((state) => state.userData);
  const { data: wallets = [] } = useGetPlatformCustomerWallets(id);

  if (isLoading) return <CustomerDetailSkeleton />;
  if (!customer)
    return <div className="p-12 text-center">Customer not found.</div>;

  const fullName = `${customer.first_name} ${customer.last_name}`;
  const kycStatus = customer.kyc_level >= 2 ? "Verified" : "Partially Verified";

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Dynamic Header with Navigation */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link to="/account/customers">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted/50"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Link
              to="/account/customers"
              className="hover:text-primary transition-colors"
            >
              Customers
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{fullName}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-2 border-b border-border/50">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-primary rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity" />
              <Avatar className="h-24 w-24 border-4 border-background ring-4 ring-primary/5 shadow-2xl relative">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.first_name}`}
                />
                <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold uppercase">
                  {customer.first_name[0]}
                  {customer.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-success text-white p-1.5 rounded-full border-4 border-background shadow-lg">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-normal text-foreground">
                  {fullName}
                </h1>
                <Badge
                  className={`${statusBadgeClass}  font-black uppercase text-[10px] px-3 py-1 rounded-full backdrop-blur-sm`}
                >
                  {customer.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5 underline decoration-primary/30 decoration-2 underline-offset-4">
                  <Mail className="w-4 h-4" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="w-4 h-4 text-primary/60" />
                  Joined{" "}
                  {new Date(customer.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              className="flex-1 lg:flex-none h-12 rounded-xl border-border/60 hover:bg-muted/50 font-bold px-6"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex-1 lg:flex-none bg-primary h-12 rounded-xl px-6 font-bold shadow-fintech active:scale-95 transition-all group">
                  Management Actions
                  <ChevronRight className="w-4 h-4 ml-3 group-data-[state=open]:rotate-90 transition-transform" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 p-2 rounded-xl border-border/50 shadow-2xl backdrop-blur-xl"
              >
                <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground pb-2 px-3">
                  Account Control
                </DropdownMenuLabel>
                <DropdownMenuItem className="rounded-lg h-10 gap-2 cursor-pointer">
                  <Wallet className="h-4 w-4 text-primary/70" />
                  <span className="font-semibold">Deposit Funds</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg h-10 gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4 text-primary/70" />
                  <span className="font-semibold">Issue New Card</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg h-10 gap-2 cursor-pointer">
                  <LinkIcon className="h-4 w-4 text-primary/70" />
                  <span className="font-semibold">Generate Payment Link</span>
                </DropdownMenuItem>
                {can(
                  userData,
                  isFrozen
                    ? PERMISSIONS.UNFREEZE_CUSTOMER
                    : PERMISSIONS.FREEZE_CUSTOMER,
                ) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(event) => {
                        event.preventDefault();
                        if (isFrozen) {
                          setShowUnfreezeDialog(true);
                        } else {
                          setShowFreezeDialog(true);
                        }
                      }}
                      className={`rounded-lg h-10 gap-2 cursor-pointer ${
                        isFrozen
                          ? "text-primary hover:bg-primary/5 hover:text-primary"
                          : "text-destructive hover:bg-destructive/5 hover:text-destructive"
                      }`}
                    >
                      <ShieldAlert className="h-4 w-4" />
                      <span className="font-bold">
                        {isFrozen ? "Unfreeze Customer" : "Freeze Customer"}
                      </span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <FreezeCustomerDialog
        id={customer.id}
        open={showFreezeDialog}
        onOpenChange={setShowFreezeDialog}
      />
      <UnFreezeCustomerDialog
        id={customer.id}
        open={showUnfreezeDialog}
        onOpenChange={setShowUnfreezeDialog}
      />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stats and Info */}
        <div className="lg:col-span-12 space-y-8">
          {/* <div className="grid sm:grid-cols-3 gap-6">
            <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Wallet className="h-16 w-16 text-primary" />
              </div>
              <CardContent className="p-6 space-y-2">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Available Balance
                </div>
                <div className="text-3xl font-bold tracking-normal">
                  ₦
                  {totalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-success font-bold mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +2.5% vs last month
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md">
              <CardContent className="p-6 space-y-2">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  KYC Status
                </div>
                <div className="text-3xl font-bold tracking-normal">
                  Tier {customer.kyc_level}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <Progress
                    value={customer.kyc_level * 33.3}
                    className="h-1.5 flex-1 bg-muted/30"
                  />
                  <span className="text-[11px] font-bold text-primary/70">
                    {kycStatus}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-premium bg-surface/50 backdrop-blur-md">
              <CardContent className="p-6 space-y-2">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Avg. Monthly Volume
                </div>
                <div className="text-3xl font-bold tracking-normal">
                  ₦245.5k
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-bold mt-1">
                  <History className="w-3 h-3" />
                  Based on last 6 months
                </div>
              </CardContent>
            </Card>
          </div> */}

          {/* Wallet Carousel */}
          {wallets.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5 text-primary" />
                  {wallets.length} Wallet{wallets.length > 1 ? "s" : ""} Linked
                </div>
              </div>

              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {wallets.map((wallet, idx) => {
                    const gradients = [
                      "from-violet-600 via-purple-600 to-indigo-700",
                      "from-emerald-500 via-teal-600 to-cyan-700",
                      "from-rose-500 via-pink-600 to-fuchsia-700",
                      "from-amber-500 via-orange-500 to-red-600",
                      "from-sky-500 via-blue-600 to-indigo-700",
                    ];
                    const gradient = gradients[idx % gradients.length];
                    const balanceNum = parseFloat(wallet.balance || "0");
                    const isFrozenWallet = wallet.is_transfer_frozen || wallet.is_funding_frozen;

                    return (
                      <CarouselItem key={wallet.id} className="pl-4 basis-[85%] md:basis-[48%]">
                        <div className="relative group/card h-full">
                          {/* Glow */}
                          <div className={`absolute -inset-1 bg-gradient-to-br ${gradient} rounded-3xl blur-md opacity-20 group-hover/card:opacity-30 transition-opacity duration-500`} />

                          <div className={`relative h-full bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-xl overflow-hidden text-white flex flex-col justify-between`}>
                            {/* Background circles */}
                            <div className="absolute inset-0 pointer-events-none">
                              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-2 border-white/10" />
                              <div className="absolute -bottom-16 -left-8 w-52 h-52 rounded-full border-2 border-white/10" />
                            </div>

                            {/* Top row */}
                            <div className="relative flex items-start justify-between mb-6">
                              <div>
                                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">
                                  {wallet.account_type} · {wallet.environment}
                                </div>
                                <div className="text-base font-black tracking-wide truncate max-w-[150px]">
                                  {wallet.name}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1.5">
                                <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${wallet.status === "ACTIVE" ? "bg-white/20" : "bg-white/10 text-white/50"}`}>
                                  {wallet.status}
                                </div>
                                {isFrozenWallet && (
                                  <div className="flex items-center gap-1 bg-white/10 text-white/70 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                                    <Snowflake className="w-2.5 h-2.5" />
                                    FROZEN
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Chip + account number */}
                            <div className="relative mb-6">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-6 rounded-md bg-gradient-to-br from-yellow-300/60 to-amber-400/60 shadow-inner" />
                              </div>
                              <div className="font-mono text-lg font-bold tracking-[0.2em] text-white/90">
                                {wallet.account_number.replace(/(\d{4})(?=\d)/g, "$1 ")}
                              </div>
                            </div>

                            {/* Balance + bank */}
                            <div className="relative flex items-end justify-between mt-auto">
                              <div>
                                <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-0.5">
                                  Available Balance
                                </div>
                                <div className="text-2xl font-black tracking-tight">
                                  {wallet.currency} {balanceNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-0.5">Bank</div>
                                <div className="text-xs font-black text-white/80">{wallet.bank_name}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                {wallets.length > 1 && (
                  <>
                    <CarouselPrevious className="hidden md:flex -left-6 bg-background/80 backdrop-blur-sm border-border/50" />
                    <CarouselNext className="hidden md:flex -right-6 bg-background/80 backdrop-blur-sm border-border/50" />
                  </>
                )}
              </Carousel>
            </div>
          )}

          <Tabs defaultValue="history" className="w-full">
            <TabsList className="bg-muted/20 p-1.5 rounded-2xl w-full sm:w-auto h-auto grid grid-cols-4 sm:flex sm:items-center gap-1 border border-border/30 backdrop-blur-md mb-6">
              <TabsTrigger
                value="history"
                className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all"
              >
                History
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all"
              >
                Identity & KYC
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all"
              >
                Security
              </TabsTrigger>
            </TabsList>

            <HistoryTab customerId={id} />

            <TabsContent value="activity">
              <CustomerActivityTab customerId={id} />
            </TabsContent>


            <TabsContent
              value="documents"
              className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-none shadow-premium bg-surface/50 p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-border/30">
                    <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-lg font-bold tracking-normal">
                        Identity Information
                      </div>
                      <div className="text-[10px] uppercase font-bold text-primary tracking-widest">
                        Verified BVN & Personal Info
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          Date of Birth
                        </div>
                        <div className="font-bold text-foreground">
                          {new Date(customer.date_of_birth).toLocaleDateString(
                            "en-US",
                            { month: "long", day: "numeric", year: "numeric" },
                          )}
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          Gender
                        </div>
                        <div className="font-bold text-foreground uppercase tracking-widest text-sm">
                          {customer.gender}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          BVN Number
                        </div>
                        <div className="font-mono font-bold text-foreground tracking-widest">
                          {customer.kyc?.bvn || "UNAVAILABLE"}
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          KYC Level
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 font-bold">
                          TIER {customer.kyc_level}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-1 pt-4 border-t border-border/30">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Registered Address
                      </div>
                      <div className="font-bold text-foreground leading-relaxed">
                        {customer.kyc?.address_street &&
                          `${customer.kyc.address_street}, `}
                        {customer.kyc?.address_city &&
                          `${customer.kyc.address_city}, `}
                        {customer.kyc?.address_state || "Address incomplete"}
                        <br />
                        {customer.kyc?.address_country || ""}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="border-none shadow-premium bg-surface/50 p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-border/30">
                    <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                      <History className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-lg font-bold tracking-normal">
                        Verification History
                      </div>
                      <div className="text-[10px] uppercase font-bold text-primary tracking-widest">
                        Audit Trail
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        step: "BVN Confirmation",
                        date: "Jan 15, 2024",
                        icon: CheckCircle2,
                        status: "Success",
                        color: "text-success",
                      },
                      {
                        step: "Address Verification",
                        date: "Jan 18, 2024",
                        icon: AlertCircle,
                        status: "In Hub",
                        color: "text-warning",
                      },
                      {
                        step: "Mobile OTP Pairing",
                        date: "Jan 15, 2024",
                        icon: CheckCircle2,
                        status: "Success",
                        color: "text-success",
                      },
                      {
                        step: "Liveness Biometric",
                        date: "Jan 15, 2024",
                        icon: CheckCircle2,
                        status: "Verified",
                        color: "text-success",
                      },
                    ].map((step, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <step.icon className={`w-5 h-5 ${step.color}`} />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground">
                              {step.step}
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                              {step.date}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="opacity-70 font-bold text-[9px] uppercase tracking-normal"
                        >
                          {step.status}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full h-11 rounded-xl bg-muted/30 hover:bg-muted/50 text-foreground font-bold text-xs gap-2 border border-border/50">
                    View Complete Audit Log
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Card>
              </div>
            </TabsContent>

            <TabsContent
              value="security"
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="border-none shadow-premium bg-surface/50 p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-border/30">
                    <div className="p-2.5 bg-error/10 rounded-2xl text-error">
                      <LockIcon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col text-left">
                      <div className="text-lg font-bold tracking-normal">
                        Security Access
                      </div>
                      <div className="text-[10px] uppercase font-bold text-error tracking-widest">
                        Account Hardening
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-border/30 bg-muted/20 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <div className="font-bold text-sm">
                            Two-Factor Auth
                          </div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                            Enabled via SMS & App
                          </div>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-lg h-9 font-bold text-[10px] uppercase tracking-widest"
                      >
                        Toggle Protection
                      </Button>
                    </div>

                    <div className="p-4 rounded-xl border border-border/30 bg-muted/20 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <div className="font-bold text-sm">
                            Account Lockdown
                          </div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                            Revoke all active sessions
                          </div>
                        </div>
                        <Shield className="w-4 h-4 text-warning" />
                      </div>
                      <Button className="w-full rounded-lg h-9 font-bold text-[10px] uppercase tracking-widest bg-error hover:bg-error/90">
                        Execute Freeze
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="border-none shadow-premium bg-surface/50 p-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-border/30 mb-6">
                    <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col text-left">
                      <div className="text-lg font-bold tracking-normal">
                        Limits & Bounds
                      </div>
                      <div className="text-[10px] uppercase font-bold text-primary tracking-widest">
                        Transaction thresholds
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <span>Daily Max (Withdrawal)</span>
                        <span className="text-foreground">₦100k / ₦500k</span>
                      </div>
                      <Progress value={20} className="h-2 bg-muted/30" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <span>Daily Max (Transfers)</span>
                        <span className="text-foreground">₦45k / ₦2,000k</span>
                      </div>
                      <Progress value={2} className="h-2 bg-muted/30" />
                    </div>

                    <div className="pt-4 grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="rounded-lg h-10 font-bold text-xs"
                      >
                        Request Increase
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-lg h-10 font-bold text-xs"
                      >
                        Reset All
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Mini Details Table */}
        {/* <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-premium bg-surface border-t-4 border-t-primary overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Core Attributes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 transition-all hover:translate-x-1">
                <div className="h-10 w-10 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                    Direct Dial
                  </span>
                  <span className="font-bold text-foreground">
                    {customer.phone_number}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 transition-all hover:translate-x-1">
                <div className="h-10 w-10 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                    Branch Node
                  </span>
                  <span className="font-bold text-foreground">
                    Lagos Virtual Hub
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 transition-all hover:translate-x-1">
                <div className="h-10 w-10 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                    Account Role
                  </span>
                  <span className="font-bold text-foreground uppercase tracking-widest text-sm italic">
                    Premium Retail
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 transition-all hover:translate-x-1">
                <div className="h-10 w-10 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                    BVN Identity
                  </span>
                  <span className="font-mono font-bold text-foreground tracking-widest">
                    {customer.kyc?.bvn || "SECURED"}
                  </span>
                </div>
              </div>
            </CardContent>
            <div className="bg-muted/30 p-4 border-t border-border/30">
              <Button
                variant="ghost"
                className="w-full text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5 h-11 rounded-xl"
              >
                Download Compliance Pack
              </Button>
            </div>
          </Card>

          <Card className="border-none shadow-premium bg-gradient-primary text-white overflow-hidden relative group">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            <CardContent className="p-8 space-y-4 relative z-10">
              <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">
                Referral Program
              </div>
              <h3 className="text-2xl font-bold leading-tight tracking-normal">
                Grow with your network.
              </h3>
              <p className="text-xs font-medium opacity-80 leading-relaxed">
                Invite this customer to our referral program and earn 1% on
                their future deposits.
              </p>
              <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-12 shadow-xl active:scale-95 transition-all text-sm">
                Activate Referral Link
              </Button>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
}

function HistoryTab({ customerId }: { customerId: string }) {
  const [typeFilter, setTypeFilter] = useState<"ALL" | "CREDIT" | "DEBIT">("ALL");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const filters = {
    limit: 5,
    page,
    ...(typeFilter !== "ALL" ? { type: typeFilter as "CREDIT" | "DEBIT" } : {}),
  };

  const { data, isLoading } = useGetPlatformCustomerTransactions(customerId, filters);

  const transactions = data?.data ?? [];
  const meta = data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = meta?.pages ?? 1;

  const statusStyles = {
    SUCCESSFUL: "text-success bg-success/10",
    FAILED: "text-destructive bg-destructive/10",
    PENDING: "text-warning bg-warning/10",
  } as const;

  const filterLabels = { ALL: "All Types", CREDIT: "Credits", DEBIT: "Debits" };

  return (
    <TabsContent
      value="history"
      className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
    >
      <Card className="border-none shadow-premium bg-surface/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-bold tracking-normal flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            Transaction History
          </CardTitle>
          <div className="flex items-center gap-3">
            {total > 0 && (
              <span className="text-xs font-bold text-muted-foreground">
                {total.toLocaleString()} total
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs font-bold gap-1.5">
                  {filterLabels[typeFilter]}
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Filter by type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(["ALL", "CREDIT", "DEBIT"] as const).map((t) => (
                  <DropdownMenuItem
                    key={t}
                    className={`text-xs font-bold ${typeFilter === t ? "text-primary" : ""}`}
                    onClick={() => { setTypeFilter(t); setPage(1); }}
                  >
                    {filterLabels[t]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y divide-border/30">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-5">
                  <Skeleton className="h-11 w-11 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="p-4 bg-muted/30 rounded-full">
                <History className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <p className="font-bold text-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground">
                This customer has no transaction history.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {transactions.map((tx) => {
                const isCredit = tx.type === "CREDIT";
                const statusStyle =
                  statusStyles[tx.status as keyof typeof statusStyles] ??
                  "text-muted-foreground bg-muted/20";
                const amount = parseFloat(tx.amount);
                return (
                  <div
                    key={tx.id}
                    onClick={() => navigate(`/account/transactions/${tx.id}`)}
                    className={`flex items-center justify-between px-5 py-4 group/tx transition-all border-l-4 cursor-pointer active:scale-[0.99] ${
                      isCredit
                        ? "border-l-success hover:bg-success/5"
                        : "border-l-destructive hover:bg-destructive/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2.5 rounded-2xl shrink-0 ${
                          isCredit
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {isCredit ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="font-bold text-foreground group-hover/tx:text-primary transition-colors truncate max-w-[200px]">
                          {tx.description || "—"}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                          <span className="font-mono">{tx.reference}</span>
                          <span>·</span>
                          <span>
                            {new Date(tx.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div
                        className={`text-base font-black ${
                          isCredit ? "text-success" : "text-foreground"
                        }`}
                      >
                        {isCredit ? "+" : "-"}
                        {tx.currency}{" "}
                        {amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${statusStyle}`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        {!isLoading && total > 0 && (
          <div className="border-t border-border/30 p-4 space-y-3">
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-bold gap-1.5"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-3 h-3" />
                  Previous
                </Button>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-bold gap-1.5"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            )}
            
          </div>
        )}
        <Link to={`/account/customers/${customerId}/transactions`} className="block w-full">
              <Button className="w-full gap-2 font-bold" size="sm">
                View More
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
      </Card>
    </TabsContent>
  );
}

function CustomerDetailSkeleton() {
  return (
    <div className="space-y-10 animate-pulse pb-20">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-6 border-b">
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <Skeleton className="h-12 w-32 rounded-xl" />
          <Skeleton className="h-12 w-48 rounded-xl" />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          <Skeleton className="h-14 w-full max-w-md rounded-2xl" />
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <Skeleton className="h-[400px] w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
