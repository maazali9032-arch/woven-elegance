export function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  return t.length ? t : null;
}

export function digitsOnly(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

export interface SplitDate {
  weekday: string;
  month: string;
  day: string;
  year: string;
  full: string;
}

export function splitDate(value?: string | null): SplitDate | null {
  const t = text(value);
  if (!t) return null;
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return null;
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase(),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: String(d.getDate()),
    year: String(d.getFullYear()),
    full: d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
  };
}

export function formatDateTime(date?: string | null, time?: string | null): string | null {
  const d = splitDate(date);
  const parts = [d ? d.full : text(date), text(time)].filter(Boolean);
  return parts.length ? parts.join(" • ") : null;
}

export function galleryUrls(
  gallery?: (string | { url?: string | null; image_url?: string | null })[] | null,
): string[] {
  if (!Array.isArray(gallery)) return [];
  return gallery
    .map((g) => (typeof g === "string" ? g : (g?.url ?? g?.image_url ?? null)))
    .map((u) => text(u))
    .filter((u): u is string => Boolean(u));
}
