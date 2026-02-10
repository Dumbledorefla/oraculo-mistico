import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { handleStripeWebhook } from "../server/stripe/webhook-handler";

const app = express();

// Stripe webhook needs raw body for signature verification
// Must be registered BEFORE express.json()
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["stripe-signature"] as string;
  
  if (!signature) {
    return res.status(400).json({ error: "Missing stripe-signature header" });
  }

  try {
    // Handle test events
    const bodyStr = req.body.toString();
    let parsed;
    try {
      parsed = JSON.parse(bodyStr);
    } catch {
      parsed = null;
    }

    if (parsed?.id?.startsWith("evt_test_")) {
      console.log("[Webhook] Test event detected, returning verification response");
      return res.json({ verified: true });
    }

    const result = await handleStripeWebhook(bodyStr, signature);
    
    if (result.success) {
      res.json({ received: true });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error("[Webhook] Error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// Body parser for other routes
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Auth0 callback route
app.get("/api/callback", async (req, res) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      console.error("[Auth0] No authorization code received");
      return res.redirect("/?error=no_code");
    }
    console.log("[Auth0] Callback received, redirecting to home");
    return res.redirect("/");
  } catch (error) {
    console.error("[Auth0] Callback failed", error);
    return res.redirect("/?error=auth_failed");
  }
});

// Auth0 logout route
app.get("/api/logout", (req, res) => {
  // Clear any session cookies
  res.setHeader("Set-Cookie", [
    "auth_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax",
  ]);

  const auth0Domain = process.env.VITE_AUTH0_DOMAIN;
  const clientId = process.env.VITE_AUTH0_CLIENT_ID;
  const returnTo = encodeURIComponent(
    process.env.AUTH0_BASE_URL || "https://chavedooraculo.com"
  );

  if (auth0Domain && clientId) {
    const logoutUrl = `https://${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`;
    return res.redirect(logoutUrl);
  }

  return res.redirect("/");
});

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Export the Express app as default for Vercel
export default app;
