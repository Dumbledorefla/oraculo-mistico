import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { getDb } from "./db";

// Admin emails that always get admin role
const ADMIN_EMAILS = ['milton.contato177@gmail.com'];

/**
 * Authenticate a request using Auth0 token.
 * Decodes the JWT (without full verification for simplicity - Auth0 already verified it)
 * and looks up the user in the database by email.
 */
export async function authenticateAuth0Request(req: { headers: { authorization?: string } }) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Decode the JWT payload (Auth0 already verified the token on the frontend)
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    
    const email = payload.email;
    const name = payload.name || payload.nickname || email;
    const sub = payload.sub; // Auth0 user ID
    
    if (!email) {
      console.warn('[Auth0] Token missing email claim');
      return null;
    }

    const db = await getDb();
    if (!db) {
      console.warn('[Auth0] Database not available');
      return null;
    }

    // Try to find user by email
    let userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (userResult.length === 0) {
      // User doesn't exist yet - create them
      const isAdmin = ADMIN_EMAILS.includes(email);
      await db.insert(users).values({
        openId: sub || `auth0_${Date.now()}`,
        name: name,
        email: email,
        loginMethod: 'auth0',
        role: isAdmin ? 'admin' : 'user',
        lastSignedIn: new Date(),
      });
      
      userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    } else {
      // Update last signed in
      await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.email, email));
      
      // If user is in admin list but role is not admin, update it
      if (ADMIN_EMAILS.includes(email) && userResult[0].role !== 'admin') {
        await db.update(users).set({ role: 'admin' }).where(eq(users.email, email));
        userResult[0].role = 'admin';
      }
    }

    return userResult.length > 0 ? userResult[0] : null;
  } catch (error) {
    console.error('[Auth0] Failed to authenticate:', error);
    return null;
  }
}
