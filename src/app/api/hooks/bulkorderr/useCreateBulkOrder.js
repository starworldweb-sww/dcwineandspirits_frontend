// hooks/useBulkOrder.js
import axiosInstance from "@/config/axiosConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// CHANGE 1: plain axios hata kar apna axios instance (baseURL aur withCredentials isme pehle se set hain)


// ---------------------------------------------------------
// STEP 1: Query keys (is file ke andar hi)
// ---------------------------------------------------------
export const bulkOrderKeys = {
  all: ["bulkOrder"],
  create: () => [...bulkOrderKeys.all, "create"],
};

// ---------------------------------------------------------
// STEP 2: Service (API call yahan hai)
// CHANGE 2: baseURL instance se aata hai (.../api/v1), isliye sirf "/bulk-orders" likha hai
// ---------------------------------------------------------
export const bulkOrderService = {
  createBulkOrder: async (payload) => {
    const response = await axiosInstance.post("/bulk-orders", payload);
    return response.data;
  },
};

// ---------------------------------------------------------
// STEP 3: Hook (component mein isko call karna hai)
// ---------------------------------------------------------
export const useCreateBulkOrder = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: bulkOrderKeys.create(),
    mutationFn: bulkOrderService.createBulkOrder,
    onSuccess: (...args) => {
      // Agar kabhi bulk orders ki list query banao, toh wo refresh ho jayegi
      queryClient.invalidateQueries({ queryKey: bulkOrderKeys.all });

      // Component se diya hua onSuccess bhi chalega
      options.onSuccess?.(...args);
    },
    ...options,
  });
};