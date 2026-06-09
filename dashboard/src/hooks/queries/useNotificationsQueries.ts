import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../endpoints/useNotifications";

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
};
