import { newsletterKeys } from "@/libs/queryKeys";
import { useMutation } from "@tanstack/react-query";
import { newsletterService } from "../../services/newsletterService";



export const useNewsletterSubscribe = () => {
    return useMutation({
        mutationKey: newsletterKeys.subscribe(),
        mutationFn: (email) => newsletterService.subscribe(email),
    });
};