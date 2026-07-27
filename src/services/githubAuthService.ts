import { dbGetKey, dbSetKey } from '../db/indexedDB';

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  email: string | null;
}

const GITHUB_CLIENT_ID_KEY = 'github-oauth-client-id';
const GITHUB_TOKEN_KEY = 'github-access-token';

export function getStoredGitHubClientId(): string {
  return (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_GITHUB_OAUTH_CLIENT_ID : '') || '';
}

export async function loadGitHubClientId(): Promise<string> {
  try {
    const stored = await dbGetKey(GITHUB_CLIENT_ID_KEY) as string | null;
    if (stored) return stored;
  } catch {}
  return getStoredGitHubClientId();
}

export async function setGitHubClientId(id: string): Promise<void> {
  await dbSetKey(GITHUB_CLIENT_ID_KEY, id);
}

export async function getStoredGitHubToken(): Promise<string | null> {
  try { return await dbGetKey(GITHUB_TOKEN_KEY) as string | null; } catch { return null; }
}

export async function setGitHubToken(token: string | null): Promise<void> {
  if (token) await dbSetKey(GITHUB_TOKEN_KEY, token);
  else await dbSetKey(GITHUB_TOKEN_KEY, '');
}

export async function signInWithGitHub(): Promise<{ verificationUri: string; userCode: string; deviceCode: string }> {
  const clientId = await loadGitHubClientId();
  if (!clientId) throw new Error('GitHub OAuth Client ID not configured. Set it in Settings.');

  const deviceRes = await fetch('https://github.com/login/device/code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ client_id: clientId, scope: 'read:user user:email repo' }),
  });
  if (!deviceRes.ok) throw new Error(`GitHub device flow failed: ${deviceRes.status}`);
  const deviceData = await deviceRes.json();
  return {
    verificationUri: deviceData.verification_uri,
    userCode: deviceData.user_code,
    deviceCode: deviceData.device_code,
  };
}

export async function pollGitHubToken(deviceCode: string, clientId: string): Promise<GitHubUser | null> {
  const maxAttempts = 60;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ client_id: clientId, device_code: deviceCode, grant_type: 'urn:ietf:params:oauth:grant-type:device_code' }),
    });
    const tokenData = await tokenRes.json();
    if (tokenData.access_token) {
      await setGitHubToken(tokenData.access_token);
      const userRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: 'application/json' },
      });
      if (!userRes.ok) throw new Error('Failed to fetch GitHub user');
      const userData = await userRes.json();
      return { login: userData.login, avatar_url: userData.avatar_url, name: userData.name, email: userData.email };
    }
    if (tokenData.error === 'authorization_pending') continue;
    if (tokenData.error === 'slow_down') { await new Promise((r) => setTimeout(r, 5000)); continue; }
    if (tokenData.error === 'expired_token') throw new Error('GitHub device code expired. Try again.');
    if (tokenData.error === 'access_denied') throw new Error('GitHub authorization denied.');
    throw new Error(`GitHub auth error: ${tokenData.error_description || tokenData.error}`);
  }
  throw new Error('GitHub authorization timed out.');
}

export async function logoutGitHub(): Promise<void> {
  await setGitHubToken(null);
}

export async function getGitHubUser(): Promise<GitHubUser | null> {
  const token = await getStoredGitHubToken();
  if (!token) return null;
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    if (!res.ok) { await setGitHubToken(null); return null; }
    const userData = await res.json();
    return { login: userData.login, avatar_url: userData.avatar_url, name: userData.name, email: userData.email };
  } catch { return null; }
}
