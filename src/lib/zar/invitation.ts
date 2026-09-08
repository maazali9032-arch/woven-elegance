import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { LifecycleState, ZarPayload } from "./types";

/** Extract the invitation slug from a pathname: only the final non-empty segment. */
export function slugFromPath(pathname: string): string | null {
  const segments = pathname.split("/").filter((s) => s.length > 0);
  const raw = segments[segments.length - 1];
  if (!raw) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null; // malformed percent encoding => not_found
  }
  decoded = decoded.trim();
  if (!decoded) return null;
  if (decoded.includes("/") || decoded.includes("\\")) return null;
  return decoded;
}

function unwrap(value: unknown): Record<string, unknown> | null {
  let node: unknown = value;
  if (Array.isArray(node)) node = node[0];
  if (!node || typeof node !== "object") return null;
  const obj = node as Record<string, unknown>;
  if (obj["data"] && typeof obj["data"] === "object" && !Array.isArray(obj["data"])) {
    return unwrap(obj["data"]);
  }
  return obj;
}

const STATES: LifecycleState[] = ["live", "fallback", "not_found", "error"];

function pickState(obj: Record<string, unknown>): LifecycleState {
  const raw = (obj["state"] ?? obj["status"] ?? obj["lifecycle"] ?? obj["lifecycle_state"]) as
    string | undefined;
  if (raw && (STATES as string[]).includes(raw)) return raw as LifecycleState;
  if (raw === "notfound" || raw === "missing") return "not_found";
  if (obj["content"] || obj["invitation"]) return "live";
  return "not_found";
}

function pickBrand(obj: Record<string, unknown>): string | null {
  const candidates = [
    obj["brand_name"],
    obj["shop_brand_name"],
    obj["shop_display_name"],
    obj["brand"],
    obj["shop_name"],
    (obj["shop"] as Record<string, unknown> | undefined)?.["brand_name"],
    (obj["shop"] as Record<string, unknown> | undefined)?.["display_name"],
    (obj["shop"] as Record<string, unknown> | undefined)?.["name"],
    (obj["fallback"] as Record<string, unknown> | undefined)?.["shop_name"],
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return null;
}

export interface FetchResult extends ZarPayload {
  /** true when the failure is a client/network/config problem rather than an RPC verdict */
  errorMessage?: string;
}

export async function fetchInvitation(slug: string): Promise<FetchResult> {
  if (!isSupabaseConfigured) {
    return { state: "error", errorMessage: "Invitation service is not configured." };
  }
  const supabase = getSupabase();
  if (!supabase) {
    return { state: "error", errorMessage: "Invitation service is not configured." };
  }

  const { data, error } = await supabase.rpc("get_public_invitation_content", {
    p_slug: slug,
  });

  if (error) {
    return { state: "error", errorMessage: error.message };
  }

  const obj = unwrap(data);
  if (!obj) return { state: "not_found" };

  const state = pickState(obj);
  const content = (obj["content"] ?? obj["invitation_content"] ?? null) as ZarPayload["content"];
  const invitation = (obj["invitation"] ?? null) as ZarPayload["invitation"];
  const fallback = (obj["fallback"] ?? obj["shop_fallback"] ?? null) as ZarPayload["fallback"];

  return {
    state,
    brand_name: pickBrand(obj),
    content: state === "live" ? (content ?? null) : null,
    invitation: state === "live" ? (invitation ?? null) : null,
    fallback: state === "fallback" ? (fallback ?? null) : null,
  };
}
