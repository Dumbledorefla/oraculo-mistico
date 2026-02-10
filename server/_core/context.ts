import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { authenticateAuth0Request } from "../auth0";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // Try Manus OAuth first
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Manus OAuth failed, try Auth0 as fallback
    user = null;
  }

  // If Manus OAuth didn't work, try Auth0 token
  if (!user) {
    try {
      user = await authenticateAuth0Request(opts.req);
    } catch (error) {
      console.error("[Auth] Auth0 fallback failed:", error);
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
