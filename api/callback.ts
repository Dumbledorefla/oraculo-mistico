import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Auth0 callback serverless function
 * Handles OAuth callback after user authentication
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Auth0 sends code and state parameters
    const { code, state } = req.query;

    if (!code) {
      console.error('[Auth0] No authorization code received');
      return res.redirect('/?error=no_code');
    }

    console.log('[Auth0] Callback received, redirecting to home');
    
    // Redirect to home page after successful authentication
    // The Auth0 SDK in the frontend will handle session creation
    return res.redirect('/');
  } catch (error) {
    console.error('[Auth0] Callback failed', error);
    return res.redirect('/?error=auth_failed');
  }
}
