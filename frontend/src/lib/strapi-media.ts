import type { StrapiMedia } from "@/types/strapi";

/**
 * Resolve a Strapi media object (or a raw relative URL) into an absolute URL.
 * Rejects any scheme that isn't http(s) — blocks javascript:, data:, file:,
 * vbscript: smuggled in via a malicious CMS entry.
 */
export function resolveStrapiMediaUrl(
  media: StrapiMedia | string | null | undefined,
  publicBaseUrl: string | null | undefined,
): string | null {
  if (!media || !publicBaseUrl) return null;
  const raw = typeof media === "string" ? media : media.url;
  if (!raw || typeof raw !== "string") return null;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      if (url.protocol !== "http:" && url.protocol !== "https:") return null;
      return url.toString();
    } catch {
      return null;
    }
  }

  if (!/^\/?[A-Za-z0-9_\-./]+$/.test(raw)) return null;
  return `${publicBaseUrl.replace(/\/$/, "")}${raw.startsWith("/") ? "" : "/"}${raw}`;
}
