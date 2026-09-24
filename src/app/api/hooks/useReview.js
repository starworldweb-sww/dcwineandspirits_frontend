import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../services/reviewService";
import { reviewKeys } from "@/libs/queryKeys";

// import { productKeys } from "../products/product.queryKey"; // agar product detail page par review_count / average_rating dikhta hai, to uska actual queryKey file yahan import karna

// Step 3: hook jo component use karega (form submit par)
export const useWriteReview = (productId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewService.writeReivewOnProduct,
    onSuccess: () => {
     
      queryClient.invalidateQueries({
        queryKey: reviewKeys.byProduct(productId),
      });

  
    },
  });
};