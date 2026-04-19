/**
 * OAuth post-login path. Must stay a same-origin path (no open redirects).
 */
export const DEFAULT_AUTH_REDIRECT = "/dashboard";

/** Allow only internal paths like /dashboard or /dashboard/settings */
export function safeNextPath(next: string | null): string {
  if (!next || typeof next !== "string") {
    return DEFAULT_AUTH_REDIRECT;
  }
  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }
  return trimmed;
}
