"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Wallet,
  ChevronRight,
  Edit,
  ExternalLink,
  Info,
  MapPin,
  Fingerprint,
  FileCheck,
  Eye,
  EyeOff,
  Activity,
  Banknote,
  Snowflake,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { APP_ROUTES } from "@/lib/routes";
import { useGetCustomerById } from "@/hooks/queries/useCustomerQueries";
import { ICustomer } from "@/types/customer.types";
import { useGetWallets } from "@/hooks/queries/useWalletQueries";
import { IWallet } from "@/types/wallet.types";
import { useUserStore } from "@/state/userStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FreezeCustomerDialog } from "@/components/customers/FreezeCustomerDialog";
import { UnFreezeCustomerDialog } from "@/components/customers/UnFreezeCustomerDialog";
import { SetTierDialog } from "@/components/customers/SetTierDialog";
import { WalletFreezeDialog } from "@/components/customers/WalletFreezeDialog";
import { HeldTransactionsList } from "@/components/customers/HeldTransactionsList";
import { AdjustmentsList } from "@/components/customers/AdjustmentsList";
import { LedgerAdjustmentDialog } from "@/components/customers/LedgerAdjustmentDialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { can } from "@/auth/can";
import { PERMISSIONS } from "@/auth/permissions";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

export default function CustomerDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [showFreezeDialog, setShowFreezeDialog] = useState(false);
  const [showUnfreezeDialog, setShowUnfreezeDialog] = useState(false);
  const [showSetTierDialog, setShowSetTierDialog] = useState(false);
  const [showWalletFreezeDialog, setShowWalletFreezeDialog] = useState(false);
  const [showLedgerAdjustmentDialog, setShowLedgerAdjustmentDialog] =
    useState(false);
  const { data: customerResponse, isLoading } = useGetCustomerById(id);
  const customer: ICustomer | undefined = customerResponse?.data;
  const userData = useUserStore((state) => state.userData);
  const view_mode = userData?.view_mode;
  const [showBalance, setShowBalance] = useState(false);
  const [activeWalletIdx, setActiveWalletIdx] = useState(0);
  const { data: walletsResponse } = useGetWallets({
    customer_id: id,
    environment: view_mode,
  });
  const navigate = useNavigate();

  if (isLoading) return <CustomerDetailSkeleton />;

  const wallets: IWallet[] = walletsResponse?.data ?? [];
  const wallet: IWallet | undefined = wallets[activeWalletIdx];
  const totalBalance = Number(wallet?.balance ?? 0);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in">
        <div className="p-8 rounded-3xl bg-muted/20 mb-8 border border-border/40">
          <User className="w-16 h-16 text-muted-foreground/30" />
        </div>
        <h2 className="text-3xl font-extrabold  mb-3">Customer Not Found</h2>
        <p className="text-muted-foreground text-base max-w-sm mb-10 leading-relaxed">
          The customer record you&apos;re looking for might have been moved or
          deleted from our platform.
        </p>
        <Link to={APP_ROUTES.ACCOUNT.CUSTOMERS.LIST}>
          <Button
            variant="outline"
            className="h-12 px-10 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 mr-3" />
            Return to Directory
          </Button>
        </Link>
      </div>
    );
  }

  const fullName =
    `${customer.first_name || ""} ${customer.last_name || ""}`.trim();
  const statusValue = (customer.status || "").toLowerCase();
  const isFrozen = statusValue === "frozen";
  const statusBadgeClass =
    (
      {
        active: "bg-success/10 text-success border-success/20",
        frozen: "bg-destructive/10 text-destructive border-destructive/20",
        blocked: "bg-destructive/10 text-destructive border-destructive/20",
      } as const
    )[statusValue] || "bg-muted/40 text-muted-foreground border-border/40";
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-8 space-y-12"
    >
      {/* Premium Header/Hero Section */}
      <motion.header
        variants={itemVariants}
        className="relative rounded-[0.5rem] overflow-hidden bg-card border border-border/50 shadow-xl"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-bl from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-8 flex-1">
            <div className="flex items-center gap-3">
              <Link to={APP_ROUTES.ACCOUNT.CUSTOMERS.LIST}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-muted/80 border border-border/20 backdrop-blur-sm transition-all group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <nav className="flex items-center gap-2 text-sm font-semibold text-muted-foreground/60">
                <span className="hover:text-foreground cursor-pointer transition-colors">
                  Customers
                </span>
                <ChevronRight className="w-4 h-4 opacity-40" />
                <span className="text-foreground/90">Detailed Profile</span>
              </nav>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-primary rounded-4xl blur-xl opacity-20" />
                <Avatar className="h-28 w-28 border-4 border-background shadow-2xl rounded-[1.8rem] relative z-10 ring-1 ring-border/50">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.first_name}&backgroundColor=0047AB`}
                  />
                  <AvatarFallback className="bg-primary text-3xl font-black text-white rounded-[1.8rem]">
                    {customer.first_name?.[0]}
                    {customer.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 p-2 bg-success rounded-xl border-2 border-background shadow-lg z-20">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-4">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                    {fullName}
                  </h1>
                  <Badge
                    className={`${statusBadgeClass} font-black uppercase text-[10px] px-3 py-1 rounded-full backdrop-blur-sm`}
                  >
                    {customer.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold text-muted-foreground/80">
                  <span className="flex items-center gap-2.5 group cursor-pointer hover:text-primary transition-colors">
                    <Mail className="w-4 h-4 opacity-70 group-hover:scale-110 transition-transform" />
                    {customer.email}
                  </span>
                  <span className="flex items-center gap-2.5 group cursor-pointer hover:text-primary transition-colors">
                    <Phone className="w-4 h-4 opacity-70 group-hover:scale-110 transition-transform" />
                    {customer.phone_number}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="h-14 px-8 rounded-2xl font-black text-sm border-border shadow-sm hover:bg-muted/40 transition-all active:scale-95"
            >
              <Edit className="w-5 h-5 mr-3" />
              Modify Profile
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-14 px-10 rounded-2xl font-black text-sm bg-primary shadow-fintech hover:opacity-90 transition-all active:scale-95 group">
                  Action Center
                  <ChevronRight className="w-4 h-4 ml-3 group-data-[state=open]:rotate-90 transition-transform" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 p-3 rounded-2xl border-border/60 shadow-2xl backdrop-blur-xl"
              >
                <DropdownMenuItem
                  className="h-12 rounded-xl cursor-pointer gap-3 font-bold"
                  onClick={() =>
                    navigate(
                      `/account/banking/transactions?customer_id=${customer.id}&tab=bank-transfer`,
                    )
                  }
                >
                  <Banknote className="w-4 h-4" />
                  Transfer Funds
                </DropdownMenuItem>
                <DropdownMenuItem className="h-12 rounded-xl cursor-pointer gap-3 font-bold">
                  <ExternalLink className="w-4 h-4" />
                  View Full Audit
                </DropdownMenuItem>
                {can(
                  userData,
                  isFrozen
                    ? PERMISSIONS.UNFREEZE_CUSTOMER
                    : PERMISSIONS.FREEZE_CUSTOMER,
                ) && (
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      if (isFrozen) {
                        setShowUnfreezeDialog(true);
                      } else {
                        setShowFreezeDialog(true);
                      }
                    }}
                    className={`h-12 rounded-xl cursor-pointer gap-3 font-bold ${
                      isFrozen
                        ? "text-primary hover:bg-primary/5 hover:text-primary"
                        : "text-destructive hover:bg-destructive/5 hover:text-destructive"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {isFrozen ? "Unfreeze Customer" : "Freeze Customer"}
                  </DropdownMenuItem>
                )}
                {can(userData, PERMISSIONS.SET_CUSTOMER_TIER) && (
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      setShowSetTierDialog(true);
                    }}
                    className="h-12 rounded-xl cursor-pointer gap-3 font-bold"
                  >
                    <Activity className="w-4 h-4" />
                    Override Tier
                  </DropdownMenuItem>
                )}
                {wallet && (
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      setShowWalletFreezeDialog(true);
                    }}
                    className={`h-12 rounded-xl cursor-pointer gap-3 font-bold ${
                      wallet.is_funding_frozen || wallet.is_transfer_frozen
                        ? "text-primary hover:bg-primary/5 hover:text-primary"
                        : "text-destructive hover:bg-destructive/5 hover:text-destructive"
                    }`}
                  >
                    <Wallet className="w-4 h-4" />
                    {wallet.is_funding_frozen || wallet.is_transfer_frozen
                      ? "Unfreeze Wallet"
                      : "Freeze Wallet"}
                  </DropdownMenuItem>
                )}
                {wallet && can(userData, PERMISSIONS.LEDGER_ADJUSTMENT) && (
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      setShowLedgerAdjustmentDialog(true);
                    }}
                    className="h-12 rounded-xl cursor-pointer gap-3 font-bold text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                  >
                    <Banknote className="w-4 h-4" />
                    Ledger Adjustment
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      {/* Wallet Section */}
      {wallets.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 p-6 rounded-2xl border border-border/40 bg-muted/10 text-muted-foreground"
        >
          <Wallet className="w-5 h-5 opacity-40" />
          <span className="text-sm font-semibold">
            No wallets found for this customer.
          </span>
        </motion.div>
      ) : wallets.length === 1 ? (
        <motion.div variants={itemVariants}>
          <WalletCard
            wallet={wallets[0]}
            selected
            showBalance={showBalance}
            onToggleBalance={() => setShowBalance(!showBalance)}
          />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Wallet className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              {wallets.length} Wallets
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full ml-auto"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-4">
              {wallets.map((w, idx) => (
                <CarouselItem
                  key={w.id}
                  className="pl-4 basis-[92%] md:basis-[55%] lg:basis-[45%]"
                >
                  <div
                    onClick={() => setActiveWalletIdx(idx)}
                    className="cursor-pointer"
                  >
                    <WalletCard
                      wallet={w}
                      selected={activeWalletIdx === idx}
                      showBalance={showBalance}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-5 bg-background/80 border-border/50" />
            <CarouselNext className="hidden md:flex -right-5 bg-background/80 border-border/50" />
          </Carousel>
          {wallet && (
            <p className="text-[10px] text-muted-foreground font-semibold px-1">
              Selected: <span className="text-foreground">{wallet.name}</span> ·{" "}
              {wallet.account_number}
            </p>
          )}
        </motion.div>
      )}

      {wallet?.is_funding_frozen && wallet.id && (
        <motion.section variants={itemVariants} className="space-y-4">
          <HeldTransactionsList walletId={wallet.id} />
        </motion.section>
      )}

      {wallet?.id && (
        <motion.section variants={itemVariants} className="space-y-4">
          <AdjustmentsList walletId={wallet.id} />
        </motion.section>
      )}

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
      <SetTierDialog
        id={customer.id}
        currentTier={customer.kyc_level ?? 1}
        open={showSetTierDialog}
        onOpenChange={setShowSetTierDialog}
      />
      {wallet && (
        <WalletFreezeDialog
          wallet={wallet}
          open={showWalletFreezeDialog}
          onOpenChange={setShowWalletFreezeDialog}
        />
      )}
      {wallet && (
        <LedgerAdjustmentDialog
          walletId={wallet.id}
          open={showLedgerAdjustmentDialog}
          onOpenChange={setShowLedgerAdjustmentDialog}
        />
      )}

      {/* Main Grid Content */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-12 space-y-12">
          <motion.section variants={itemVariants} className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Administrative Profile
                </h2>
                <p className="text-sm font-medium text-muted-foreground/60">
                  Verified identity and residential protocols
                </p>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase text-[10px] px-4 py-1.5 rounded-xl">
                Identity Status: {customer.kyc?.status || "Incomplete"}
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Address Details */}
              <Card className="border-border/50 shadow-premium bg-card overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-muted/20 flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="font-black text-[11px] uppercase tracking-widest text-foreground/80">
                    Account Details
                  </h3>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-1">
                    <div className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                      Bank Name
                    </div>
                    <div className="text-sm font-bold text-foreground truncate">
                      {wallet?.bank_name || "---"}
                    </div>
                  </div>
                  <div className="grid grid-cols-1  gap-8">
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                        Account Number
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {wallet?.account_number || "---"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                        Account Name
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {wallet?.account_name?.split("/").pop()?.trim() ||
                          "---"}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              {/* Identity Details */}
              <Card className="border-border/50 shadow-premium bg-card overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-muted/20 flex items-center gap-3">
                  <Fingerprint className="w-4 h-4 text-primary" />
                  <h3 className="font-black text-[11px] uppercase tracking-widest text-foreground/80">
                    Identity & Verification
                  </h3>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                        Bank Verification (BVN)
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {customer.kyc?.bvn || "---"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                        Tax Identity (NIN)
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {customer.kyc?.nin || "---"}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border/40">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                          Date of Birth
                        </div>
                        <div className="text-sm font-bold text-foreground">
                          {customer.kyc?.date_of_birth
                            ? new Date(
                                customer.kyc.date_of_birth,
                              ).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "---"}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-success/5 border border-success/10">
                        <FileCheck className="w-5 h-5 text-success" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Address Details */}
              <Card className="border-border/50 shadow-premium bg-card overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-muted/20 flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="font-black text-[11px] uppercase tracking-widest text-foreground/80">
                    Residential Protocol
                  </h3>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-1">
                    <div className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                      Street Address
                    </div>
                    <div className="text-sm font-bold text-foreground truncate">
                      {customer.kyc?.address_street || "---"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                        City
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {customer.kyc?.address_city || "---"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                        State
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {customer.kyc?.address_state || "---"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                        Postal Code
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {customer.kyc?.address_postal_code || "---"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">
                        Country
                      </div>
                      <div className="text-sm font-bold text-foreground uppercase">
                        {customer.kyc?.address_country || "---"}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.section>
        </div>

        {/* Right Column: Security & Infrastructure */}
        <div className="lg:col-span-4 space-y-10">
          {/* Quick Support Node */}
          <motion.div
            variants={itemVariants}
            className="p-10 rounded-[2.5rem] bg-muted/20 border border-border/40 flex flex-col items-center text-center gap-6"
          >
            <div className="p-4 rounded-2xl bg-background shadow-sm border border-border/20">
              <Info className="w-6 h-6 text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <span className="text-sm font-black text-foreground">
                Need Support?
              </span>
              <p className="text-xs font-semibold text-muted-foreground/60 leading-relaxed">
                Dedicated account manager available 24/7 for premium nodes.
              </p>
            </div>
            <Button
              variant="link"
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:no-underline"
            >
              Open Direct Channel
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function WalletCard({
  wallet,
  selected,
  showBalance,
  onToggleBalance,
}: {
  wallet: IWallet;
  selected: boolean;
  showBalance: boolean;
  onToggleBalance?: () => void;
}) {
  const balance = Number(wallet.balance ?? 0);
  const isFrozenWallet = wallet.is_transfer_frozen || wallet.is_funding_frozen;
  const gradients = [
    "from-[#0047AB] via-[#0056D2] to-[#002B6B]",
    "from-violet-600 via-purple-600 to-indigo-700",
    "from-emerald-500 via-teal-600 to-cyan-700",
    "from-rose-500 via-pink-600 to-fuchsia-700",
    "from-amber-500 via-orange-500 to-red-600",
  ];
  const gradient = gradients[0];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ${
        selected
          ? "ring-2 ring-white/40 scale-[1.01]"
          : "opacity-80 hover:opacity-100"
      } bg-linear-to-br ${isFrozenWallet ? "from-[#8b0000] via-[#cd5c5c] to-[#ff0000]" : gradient}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-2xl pointer-events-none" />

      <div className="relative p-7 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
              {wallet.account_type} · {wallet.environment}
            </div>
            <div className="text-sm font-black text-white truncate max-w-[160px]">
              {wallet.name}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                wallet.status === "ACTIVE"
                  ? "bg-white/20"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {wallet.status}
            </div>
            {isFrozenWallet && (
              <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded-full">
                <Snowflake className="w-2.5 h-2.5 text-white/70" />
                <span className="text-[8px] font-black text-white/70 uppercase">
                  Frozen
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="font-mono text-sm font-bold tracking-[0.15em] text-white/80">
          {wallet.account_number.replace(/(\d{4})(?=\d)/g, "$1 ")}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-0.5">
              Available Balance
            </div>
            <div className="text-2xl font-black tracking-tight text-white">
              {showBalance
                ? `${wallet.currency} ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "•••• ••••"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-0.5">
              Bank
            </div>
            <div className="text-xs font-black text-white/80">
              {wallet.bank_name}
            </div>
          </div>
        </div>

        {onToggleBalance && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-5 right-5 h-8 w-8 rounded-full hover:bg-white/10 text-white/70"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBalance();
            }}
          >
            {showBalance ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function CustomerDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-8 space-y-12 animate-pulse">
      <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-3xl" />
        ))}
      </div>
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          <Skeleton className="h-[600px] w-full rounded-[2.5rem]" />
        </div>
        <div className="lg:col-span-4 space-y-10">
          <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
          <Skeleton className="h-[300px] w-full rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}
