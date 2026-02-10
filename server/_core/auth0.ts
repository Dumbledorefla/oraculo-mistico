import { Express, Request, Response } from "express";

/**
 * Auth0 callback route handler
 * Handles the OAuth callback from Auth0 after user authentication
 */
export function registerAuth0Routes(app: Express) {
  app.get("/callback", async (req: Request, res: Response) => {
    try {
      // Auth0 sends code and state parameters
      const code = req.query.code as string;
      const state = req.query.state as string;

      if (!code) {
        console.error("[Auth0] No authorization code received");
        return res.redirect("/?error=no_code");
      }

      // Redirect to home page after successful authentication
      // The Auth0 SDK will handle the session creation
      res.redirect("/");
    } catch (error) {
      console.error("[Auth0] Callback failed", error);
      res.redirect("/?error=auth_failed");
    }
  });

  // Logout route
  app.get("/logout", (req: Request, res: Response) => {
    // Clear any session cookies
    res.clearCookie("auth_session");
    
    // Redirect to Auth0 logout
    const auth0Domain = process.env.VITE_AUTH0_DOMAIN;
    const clientId = process.env.VITE_AUTH0_CLIENT_ID;
    const returnTo = encodeURIComponent(process.env.AUTH0_BASE_URL || "https://chavedooraculo.com");
    
    if (auth0Domain && clientId) {
      res.redirect(`https://${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`);
    } else {
      res.redirect("/");
    }
  });
}
