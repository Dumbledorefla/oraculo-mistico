export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate Auth0 login URL
export const getLoginUrl = () => {
  const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN || "";
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "";
  const redirectUri = `${window.location.origin}/callback`;
  
  if (!auth0Domain || !clientId) {
    console.error("Auth0 configuration missing");
    return "/";
  }

  const url = new URL(`https://${auth0Domain}/authorize`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid profile email");

  return url.toString();
};
