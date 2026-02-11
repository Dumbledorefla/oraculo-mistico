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
 * Get Auth0 access token from localStorage.
 * Auth0 stores tokens in localStorage when cacheLocation="localstorage" is set.
 * 
 * We use the access_token because the Auth0 configuration doesn't return id_token.
 * The backend will decode the access token to get user information.
 */
function getAuth0IdToken(): string | null {
  try {
    // Auth0 stores tokens with a key pattern: @@auth0spajs@@::CLIENT_ID::default::scope
    // Look for the key that contains access_token
    for (const key of Object.keys(localStorage)) {
      if (key.includes('@@auth0spajs@@') && !key.includes('@@user@@')) {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data?.body?.access_token) {
          return data.body.access_token;
        }
      }
    }
  } catch (e) {
    console.error('[Auth0] Failed to get token from localStorage:', e);
  }
  return null;
}

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      headers() {
        const token = getAuth0IdToken();
        if (token) {
          return {
            Authorization: `Bearer ${token}`,
          };
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

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </AuthProvider>
);
