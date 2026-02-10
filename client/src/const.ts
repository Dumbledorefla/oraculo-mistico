export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Auth0 SDK handles login automatically via loginWithRedirect()
// This is kept for compatibility but not used anymore
export const getLoginUrl = () => {
  return "/"; // Redirect to home, Auth0 SDK will handle login
};
