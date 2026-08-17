import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  login,
  logout,
  getProfile,
  register,
  changePassword,
  updateAccountInformation,
  forgotPassword,
  resetPassword,
} from "@/app/api/services/authService"; 
import { cartKeys, customerKeys } from "@/libs/queryKeys";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(customerKeys.profile(), data.data);
      queryClient.invalidateQueries({ queryKey: customerKeys.profile() });
      queryClient.invalidateQueries({ queryKey: cartKeys.getCartList() });
      toast.success(`Logged in as ${data?.data?.firstname}`);
      router.refresh();
      router.push("/account");
    },
    onError: (error) => {
      toast.error(error?.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      toast.success(data?.message || "Registration successful");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error?.message || "Registration failed");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      queryClient.setQueryData(customerKeys.profile(), null);
      queryClient.removeQueries({ queryKey: customerKeys.profile() });
      queryClient.invalidateQueries({ queryKey: cartKeys.getCartList() });
      toast.success(data?.message);
      router.push("/account/login");
    },
    onError: (error) => {
      toast.error(error?.message || "Logout failed");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      toast.success(data?.message || "Password changed successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to change password");
    },
  });
};

export const useUpdateAccountInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccountInformation,
    onSuccess: (data) => {
      queryClient.setQueryData(customerKeys.profile(), data.data);
      toast.success(data?.message || "Information updated");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update information");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success(data?.message || "Reset link sent");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to send reset link");
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successful");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to reset password");
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: customerKeys.profile(),
    queryFn: async () => {
      try {
        const response = await getProfile();
        return response.data;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};