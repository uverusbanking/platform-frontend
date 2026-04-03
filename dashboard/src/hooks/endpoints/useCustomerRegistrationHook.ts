import { IApiResponse } from "@/types/apiResponseType";
import { IRegisterNewCustomerPayload } from "@/types/customer.types";
import { registerNewCustomer } from "@/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useRegisterNewCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IApiResponse<unknown>,
    AxiosError<unknown, IApiResponse<unknown>>,
    IRegisterNewCustomerPayload
  >({
    mutationFn: registerNewCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] });
      // You might want to show a success toast message here
      // toast.success(data.message || "Profile updated successfully", {description: ""});
    },
  });
};
