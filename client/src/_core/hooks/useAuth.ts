import { useAuth0 } from '@auth0/auth0-react';
import { getLoginUrl } from "@/const";
import { useEffect } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  
  const {
    user: auth0User,
    isLoading,
    isAuthenticated,
    error,
    logout: auth0Logout,
  } = useAuth0();

  // Admin emails list - these users always get admin role
  const ADMIN_EMAILS = ['milton.contato177@gmail.com'];

  // Determine role: check admin email list first, then Auth0 custom claim, then default to 'user'
  const determineRole = (email: string | undefined): 'admin' | 'user' => {
    if (email && ADMIN_EMAILS.includes(email)) return 'admin';
    const claimRole = auth0User?.['https://chavedooraculo.com/role'];
    if (claimRole === 'admin') return 'admin';
    return 'user';
  };

  // Convert Auth0 user to our user format
  const user = auth0User ? {
    id: auth0User.sub || '',
    email: auth0User.email || '',
    name: auth0User.name || '',
    picture: auth0User.picture || '',
    role: determineRole(auth0User.email),
    createdAt: auth0User.updated_at || new Date().toISOString(),
  } : null;

  const logout = async () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (isLoading) return;
    if (user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    isLoading,
    user,
  ]);

  // Store user info in localStorage for compatibility
  useEffect(() => {
    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(user)
    );
  }, [user]);

  return {
    user,
    loading: isLoading,
    error: error || null,
    isAuthenticated,
    refresh: () => {}, // Auth0 handles refresh automatically
    logout,
  };
}
