/**
 * Token Vault abstraction for Auth0 Token Vault
 * Handles storing, exchanging, and revoking third-party tokens
 */

// Mock in-memory store for demo (replace with Auth0 Token Vault API in production)
const tokenStore = new Map();

export class TokenVault {
  /**
   * Store a token for a user + provider
   * @param {string} userId - Auth0 user ID
   * @param {string} provider - e.g., 'gmail', 'github'
   * @param {object} tokenData - { access_token, refresh_token, expires_at, scopes }
   */
  static async store(userId, provider, tokenData) {
    const key = `${userId}:${provider}`;
    const existing = tokenStore.get(key) || [];
    const newToken = {
      id: crypto.randomUUID(),
      provider,
      ...tokenData,
      createdAt: new Date().toISOString(),
    };
    tokenStore.set(key, [...existing, newToken]);
    console.log(`[TokenVault] Stored token for ${userId}@${provider}`);
    return newToken;
  }

  /**
   * Retrieve tokens for a user + provider (optionally filtered by scopes)
   * @param {string} userId
   * @param {string} provider
   * @param {string[]} requiredScopes - if provided, returns token that has all these scopes
   */
  static async get(userId, provider, requiredScopes = []) {
    const key = `${userId}:${provider}`;
    const tokens = tokenStore.get(key) || [];
    if (requiredScopes.length === 0) return tokens;

    // Find a token that has ALL required scopes
    return tokens.find(token =>
      requiredScopes.every(scope => token.scopes.includes(scope))
    );
  }

  /**
   * Exchange for a token with specific scopes (uses refresh if needed)
   * @param {string} userId
   * @param {string} provider
   * @param {string[]} scopes
   */
  static async exchange(userId, provider, scopes) {
    // In production: call Auth0 Token Vault /oauth/token endpoint
    // with grant_type=client_credentials and user_id
    console.log(`[TokenVault] Exchanging token for ${userId}@${provider} with scopes:`, scopes);
    
    // Simulate token exchange
    const newToken = {
      access_token: `mock_token_${Date.now()}_${scopes.join('_')}`,
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
      scopes,
    };
    await this.store(userId, provider, newToken);
    return newToken;
  }

  /**
   * Revoke all tokens for a user + provider
   * @param {string} userId
   * @param {string} provider
   * @param {string} tokenId - optional specific token ID
   */
  static async revoke(userId, provider, tokenId = null) {
    const key = `${userId}:${provider}`;
    if (!tokenId) {
      tokenStore.delete(key);
      console.log(`[TokenVault] Revoked all tokens for ${userId}@${provider}`);
      return true;
    }
    const tokens = tokenStore.get(key) || [];
    const filtered = tokens.filter(t => t.id !== tokenId);
    tokenStore.set(key, filtered);
    console.log(`[TokenVault] Revoked token ${tokenId} for ${userId}@${provider}`);
    return true;
  }

  /**
   * List all tokens for a user (across providers)
   * @param {string} userId
   */
  static async list(userId) {
    const allTokens = [];
    for (const [key, tokens] of tokenStore.entries()) {
      if (key.startsWith(`${userId}:`)) {
        allTokens.push(...tokens);
      }
    }
    return allTokens;
  }
}

// Convenience exports
export const getTokenVaultToken = TokenVault.exchange;
export const revokeToken = TokenVault.revoke;
export const listTokens = TokenVault.list;