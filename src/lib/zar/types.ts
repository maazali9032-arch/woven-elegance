export type LifecycleState = "live" | "fallback" | "not_found" | "error";

export interface ZarEvent {
  name?: string | null;
  title?: string | null;
  date?: string | null;
  time?: string | null;
  note?: string | null;
  venue?: string | null;
}

export interface ZarContact {
  name?: string | null;
  phone?: string | null;
  whatsapp_url?: string | null;
  whatsapp?: string | null;
  relation?: string | null;
}

export interface ZarVenue {
  name?: string | null;
  address?: string | null;
  city?: string | null;
  maps_url?: string | null;
  image_url?: string | null;
}

export interface ZarContent {
  groom_name?: string | null;
  bride_name?: string | null;
  groom_photo_url?: string | null;
  bride_photo_url?: string | null;
  groom_qualification?: string | null;
  bride_qualification?: string | null;
  groom_occupation?: string | null;
  bride_occupation?: string | null;
  groom_parents?: string | null;
  bride_parents?: string | null;
  relatives?: string | null;
  invocation?: string | null;
  wedding_date?: string | null;
  invitation_start?: string | null;
  invitation_end?: string | null;
  message?: string | null;
  events?: ZarEvent[] | null;
  venue?: ZarVenue | null;
  gallery?: (string | { url?: string | null; image_url?: string | null })[] | null;
  music?: { enabled?: boolean | null; url?: string | null; title?: string | null } | null;
  contacts?: ZarContact[] | null;
  qr_label?: string | null;
}

export interface ZarInvitation {
  public_url?: string | null;
  slug?: string | null;
}

export interface ZarPayload {
  state: LifecycleState;
  brand_name?: string | null;
  content?: ZarContent | null;
  invitation?: ZarInvitation | null;
  fallback?: {
    shop_name?: string | null;
    message?: string | null;
    phone?: string | null;
    website_url?: string | null;
  } | null;
}
