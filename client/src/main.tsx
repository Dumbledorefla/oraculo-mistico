import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import { AuthProvider } from "./contexts/AuthProvider";
import "./index.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

/**
 * TRPCProvider component that wraps the app with tRPC client.
 * Uses useAuth0() to get the token dynamically.
 */
function TRPCProvider({ children }: { children: React.ReactNode }) {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [trpcClient, setTrpcClient] = useState<ReturnType<typeof trpc.createClient> | null>(null);

  useEffect(() => {
    const client = trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          async headers() {
            if (isAuthenticated && !isLoading) {
              try {
                const token = await getAccessTokenSilently();
                return {
                  Authorization: `Bearer ${token}`,
                };
              } catch (error) {
                console.error("[Auth0] Failed to get token:", error);
              }
            }
            return {};
          },
          fetch(input, init) {
            return globalThis.fetch(input, {
              ...(init ?? {}),
              credentials: "include",
            });
          },
        }),
      ],
    });
    setTrpcClient(client);
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  if (!trpcClient) {
    return <div>Loading...</div>;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <TRPCProvider>
      <App />
    </TRPCProvider>
  </AuthProvider>
);
