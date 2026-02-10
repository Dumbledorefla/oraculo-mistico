import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Auth0 logout serverless function
 * Handles logout and redirects to Auth0 logout endpoint
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Clear any session cookies
    res.setHeader('Set-Cookie', [
      'auth_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
    ]);
    
    // Redirect to Auth0 logout
    const auth0Domain = process.env.VITE_AUTH0_DOMAIN;
    const clientId = process.env.VITE_AUTH0_CLIENT_ID;
    const returnTo = encodeURIComponent(
      process.env.AUTH0_BASE_URL || 'https://chavedooraculo.com'
    );
    
    if (auth0Domain && clientId) {
      const logoutUrl = `https://${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`;
      return res.redirect(logoutUrl);
    }
    
    return res.redirect('/');
  } catch (error) {
    console.error('[Auth0] Logout failed', error);
    return res.redirect('/');
  }
}
