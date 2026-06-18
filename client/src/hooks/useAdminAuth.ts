import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Import admin user types from shared schema
import type { adminUsers } from "@shared/schema";

export type AdminUser = typeof adminUsers.$inferSelect;

// Login form schema
export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export function useAdminAuth() {
  const { toast } = useToast();

  // Query for current admin user
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/admin/auth/me"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/admin/auth/me", {
          credentials: "include",
        });
        
        if (response.status === 401) {
          // Not authenticated - return null instead of throwing
          return null;
        }
        
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      } catch (error) {
        // Handle network errors etc.
        console.error("Auth check failed:", error);
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: AdminLoginForm): Promise<AdminUser> => {
      const response = await apiRequest("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      return response.json();
    },
    onSuccess: (user: AdminUser) => {
      // Update cache with user data
      queryClient.setQueryData(["/api/admin/auth/me"], user);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.username}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/admin/auth/logout", {
        method: "POST",
      });
      return { success: true };
    },
    onSuccess: () => {
      // Clear cache
      queryClient.setQueryData(["/api/admin/auth/me"], null);
      queryClient.invalidateQueries();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: any) => {
      console.error("Logout error:", error);
      // Even if logout fails on server, clear client state
      queryClient.setQueryData(["/api/admin/auth/me"], null);
      queryClient.invalidateQueries();
    },
  });

  return {
    user: user as AdminUser | null,
    isLoading,
    isAuthenticated: !!user && !error,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    loginPending: loginMutation.isPending,
    logoutPending: logoutMutation.isPending,
  };
}