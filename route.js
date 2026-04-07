import { auth0 } from '@/lib/auth0';

export async function POST(req) {
  const session = await auth0.getSession(req);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { provider } = await req.json();
  // Call Auth0 Token Vault revocation endpoint
  // Simplified for demo – logs success
  console.log(`Revoking tokens for ${provider} user ${session.user.sub}`);
  return Response.json({ revoked: true });
}