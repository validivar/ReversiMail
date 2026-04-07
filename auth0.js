import { initAuth0 } from '@auth0/nextjs-auth0';

export const auth0 = initAuth0({
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  routes: {
    callback: '/api/auth/callback',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
  },
  session: {
    rollingDuration: 60 * 60 * 24,
  },
});

export async function getTokenVaultToken(userId, scopes) {
  // Simplified – in production use Auth0 Management API /tokenvault
  // For demo, we return a mock token (replace with real exchange)
  console.log(`Requesting token for user ${userId} with scopes:`, scopes);
  return 'mock-gmail-access-token';
}