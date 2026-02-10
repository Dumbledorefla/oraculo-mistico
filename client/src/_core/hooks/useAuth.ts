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

  // Convert Auth0 user to our user format
  const user = auth0User ? {
    id: auth0User.sub || '',
    email: auth0User.email || '',
    name: auth0User.name || '',
    picture: auth0User.picture || '',
    // Check role from custom claim or assign admin to specific email
    role: (
      (auth0User['https://chavedooraculo.com/role'] as 'admin' | 'user') ||
      (auth0User.email === 'milton.contato177@gmail.com' ? 'admin' : 'user')
    ) as 'admin' | 'user',
    createdAt: auth0User.updated_at || new Date().toISOString(),
  } : null;

  // Debug: log user info
  useEffect(() => {
    if (user) {
      console.log('[useAuth] User info:', { email: user.email, role: user.role });
    }
  }, [user]);

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
