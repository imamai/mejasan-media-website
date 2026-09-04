export type PlatformStatus = {
  status: "active" | "suspended" | "maintenance";
  status_message: string | null;
  maintenance_return_at: string | null;
};

const STATUS_API_URL =
  process.env.EDOS_STATUS_API_URL ?? "https://www.edoscentre.co.ke/api/public/website-status";
// Set in .env — lets this same file be reused unmodified by future sites.
const SITE_SLUG = process.env.EDOS_SITE_SLUG ?? "mejasan-media-production";

const ACTIVE: PlatformStatus = { status: "active", status_message: null, maintenance_return_at: null };

/**
 * Checks this site's status with the EDOS Centre admin platform (the shared
 * billing/hosting control panel other managed sites also report to). Fails
 * open on any error/timeout — an outage on the platform side must never take
 * this site down, only an explicit suspend/maintenance flag should. Called
 * from middleware, so this stays framework-agnostic (no "server-only" import,
 * no Node-only APIs) to run cleanly on the Edge runtime.
 */
export async function getPlatformStatus(): Promise<PlatformStatus> {
  try {
    const res = await fetch(`${STATUS_API_URL}?slug=${encodeURIComponent(SITE_SLUG)}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return ACTIVE;
    const data = await res.json();
    if (data?.status === "suspended" || data?.status === "maintenance") {
      return { status: data.status, status_message: data.status_message ?? null, maintenance_return_at: data.maintenance_return_at ?? null };
    }
    return ACTIVE;
  } catch {
    return ACTIVE;
  }
}
