"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableUserVirtualSelect from "./SelectUser";
import { Banknote } from "lucide-react";
import { ICustomer } from "@/types/customer.types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { currencyDisplay, defaultApiResponse } from "@/utils/resources";
import {
  useGetBanks,
  useInitiateTransfer,
  useVerifyAccount,
} from "@/hooks/endpoints/useTransferHook";
import { defaultBankList } from "./banks";
import SearchableVirtualSelect from "./SelectBank";
import { useUserStore } from "@/state/userStore";
import DisplayRespondsMessage from "@/components/DisplayResponse";
import { getApiErrorMessage } from "@/utils/apiClient";

const FormSchema = z.object({
  senderAccountId: z.string().min(1, "Sender account is required"),
  destinationBank: z.string().min(1, "Destination bank is required"),
  destinationAccountNumber: z
    .string()
    .min(1, "Destination account number is required"),
  accountName: z.string().min(1, "Account name is required"),
  amount: z
    .string()
    .min(3, "Min. amount must be greater than 100")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 100;
      },
      {
        message: "Amount must be a number greater than or equal to 100",
      },
    ),
  narration: z.string().optional(),
  transferFee: z.number().optional(),
});

type Props = {
  customer?: ICustomer;
};

function BankTransfers({ customer }: Props) {
  const userData = useUserStore((state) => state.userData);
  const { data: bankResponse, isLoading: isLoadingBanks } = useGetBanks(
    userData.organisation_id,
  );
  const { mutateAsync: verifyAccount, isPending: isVerifyingAccount } =
    useVerifyAccount();
  const banks = bankResponse?.data.length ? bankResponse.data : defaultBankList;
  const { mutateAsync: initiateTransfer, isPending: isInitiatingTransfer } =
    useInitiateTransfer();
  const [apiResponse, setApiResponse] = useState(defaultApiResponse);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  // For selected user details
  const selectedUserId = watch("senderAccountId");
  const [selectedUser, setSelectedUser] = useState<ICustomer | undefined>(
    undefined,
  );

  // Keep selectedUser in sync with senderAccountId
  useEffect(() => {
    setApiResponse(defaultApiResponse);

    if (customer) {
      setValue("senderAccountId", customer.id);
      setSelectedUser(customer);
    }

    if (selectedUserId && selectedUser && selectedUser.id !== selectedUserId) {
      setValue("senderAccountId", "");
      setSelectedUser(undefined);
    }
  }, [selectedUserId, customer]);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    setApiResponse(defaultApiResponse);
    await initiateTransfer(
      {
        customer_id: formData.senderAccountId,
        bank_code: formData.destinationBank,
        account_number: formData.destinationAccountNumber,
        bank_name:
          banks.find((bank) => bank.bank_code === formData.destinationBank)
            ?.bank_name || formData.destinationBank,
        amount: Number(formData.amount),
        currency: "NGN",
        narration:
          formData.narration ||
          `Transfer from ${selectedUser?.first_name} ${selectedUser?.last_name}`,
        // meta_data: [
        //   { sender_name: `${selectedUser?.first_name} ${selectedUser?.last_name}`, sender_address: "N/A" }
        // ],
      },
      {
        onSuccess: (res) => {
          reset();
          setSelectedUser(undefined);
          if (customer) {
            setValue("senderAccountId", customer.id);
            setSelectedUser(customer);
          }

          toast("Transfer Initiated", {
            description: `Bank transfer has been processed successfully.`,
          });
        },
        onError: (err) => {
          console.error("Transfer Initiation Error:", err);
          const message = getApiErrorMessage(err, "Transfer initiation failed");

          toast("Transfer initiation failed", {
            description: message,
          });

          setApiResponse({
            display: true,
            status: false,
            message,
          });
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-5 w-5" />
          Bank Transfers
        </CardTitle>
        <CardDescription>
          Transfer from user account to another account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Selected user details display */}
          <div>
            {selectedUser ? (
              <div className="mb-2 p-3 border rounded bg-muted/50 flex flex-col gap-1">
                <div className="font-semibold text-lg">
                  {selectedUser.first_name} {selectedUser.last_name}{" "}
                  {selectedUser.middle_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Acct: {selectedUser.account_number}{" "}
                  {selectedUser.balance !== undefined &&
                    " • " + currencyDisplay(selectedUser.balance)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Email: {selectedUser.email} | Phone:{" "}
                  {selectedUser.phone_number}
                </div>
              </div>
            ) : (
              <></>
              // <div className="mb-2 text-sm text-muted-foreground">No user selected</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-account">User Account</Label>
              <Controller
                control={control}
                name={"senderAccountId"}
                render={({ field: { onChange, value } }) => (
                  <SearchableUserVirtualSelect
                    onSelect={(user) => {
                      onChange(user.id);
                      setSelectedUser(user);
                    }}
                    selectedUser={selectedUser}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dest-bank">Destination Bank</Label>
              <Controller
                control={control}
                name={"destinationBank"}
                render={({ field: { onChange, value } }) => {
                  return (
                    <SearchableVirtualSelect
                      items={banks}
                      selectedItem={value}
                      onSelect={async (item) => {
                        onChange(item.bank_code);

                        const acctNo = watch("destinationAccountNumber");
                        // If account number is 10 digits, re-verify account
                        if (acctNo && acctNo.length === 10) {
                          await verifyAccount(
                            {
                              bank_code: item.bank_code,
                              account_number: acctNo,
                            },
                            {
                              onSuccess: (res) => {
                                // Set account name
                                setValue("accountName", res.data.accountName);
                                toast.success("Account verified successfully");
                              },
                              onError: (err) => {
                                console.error(
                                  "Account Verification Error:",
                                  err,
                                );
                                setValue("accountName", "");
                                toast.error(
                                  "Failed to verify account. Please check the details and try again.",
                                );
                              },
                            },
                          );
                        }
                      }}
                    />
                  );
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dest-account">Account Number</Label>
              <Controller
                control={control}
                name={"destinationAccountNumber"}
                render={({ field: { onChange, value } }) => (
                  <Input
                    id="dest-account"
                    placeholder="Destination account number"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={value || ""}
                    onChange={async (e) => {
                      // Only allow numbers
                      const val = e.target.value.replace(/\D/g, "");

                      if (val.length <= 10) {
                        onChange(val);
                        if (val.length === 10) {
                          const destinationBank = watch("destinationBank");
                          await verifyAccount(
                            { bank_code: destinationBank, account_number: val },
                            {
                              onSuccess: (res) => {
                                console.log(
                                  "Account Verification Success:",
                                  res,
                                );
                                // Set account name
                                setValue("accountName", res.data.accountName);
                                toast.success("Account verified successfully");
                              },
                              onError: (err) => {
                                console.error(
                                  "Account Verification Error:",
                                  err,
                                );
                                setValue("accountName", "");
                                toast.error(
                                  "Failed to verify account. Please check the details and try again.",
                                );
                              },
                            },
                          );
                        }
                      }
                    }}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-name">Account Name</Label>
              {isVerifyingAccount ? (
                <div className="flex items-center gap-2 px-3 py-2 border rounded bg-muted animate-pulse h-10">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Verifying account…
                  </span>
                </div>
              ) : (
                <Input
                  id="account-name"
                  placeholder="Account holder name"
                  {...register("accountName")}
                  readOnly
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer-amount">Amount (₦)</Label>
              <Input
                id="transfer-amount"
                type="number"
                placeholder="Enter amount"
                inputMode="numeric"
                {...register("amount")}
              />
              {errors.amount && (
                <p className="text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="narration">Narration</Label>
              <Input id="narration" type="text" {...register("narration")} />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="transfer-fee">Transfer Fee (₦)</Label>
              <Input id="transfer-fee" type="number" value="0"
                {...register('transferFee')}
              />
            </div> */}
          </div>

          <div className="pt-2">
            <DisplayRespondsMessage response={apiResponse} />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isInitiatingTransfer}
          >
            {isInitiatingTransfer
              ? "Processing Transfer..."
              : "Process Bank Transfer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default BankTransfers;
