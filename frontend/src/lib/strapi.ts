/**
 * Strapi v5 API client for the portfolio frontend.
 *
 * Security notes:
 * - Uses a SERVER-SIDE read-only API token (STRAPI_API_TOKEN).
 *   This token is never exposed to the browser.
 * - All fetches include `next: { revalidate }` for ISR caching.
 * - Any fetch error falls through to the static fallback data
 *   so the site never fully breaks if Strapi is unavailable.
 */

import type {
  StrapiListResponse,
  StrapiSingleResponse,
  StrapiPublication,
  StrapiResearchProject,
  StrapiCollaborator,
  StrapiFunding,
  StrapiShowcaseProject,
  StrapiExperience,
  StrapiEducation,
  StrapiSkillGroup,
  StrapiAward,
  StrapiCurrentCourse,
  StrapiPastCourse,
  StrapiSupervision,
  StrapiJournalReview,
  StrapiConferenceCommittee,
  StrapiTalk,
  StrapiMembership,
  StrapiSiteConfig,
  StrapiHomeConfig,
  StrapiMedia,
} from '@/types/strapi';

// ---------------------------------------------------------------------------
// Config — read from environment at module load time (server-side only)
// ---------------------------------------------------------------------------
function assertHttpUrl(raw: string, fallback: string): string {
  try {
    const u = new URL(raw);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('scheme');
    return u.toString().replace(/\/$/, '');
  } catch {
    return fallback;
  }
}

const STRAPI_URL = assertHttpUrl(process.env.STRAPI_URL ?? '', 'http://localhost:1337');
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN ?? '';
const STRAPI_PUBLIC_URL = assertHttpUrl(process.env.NEXT_PUBLIC_STRAPI_URL ?? '', STRAPI_URL);

/**
 * Resolve a Strapi media object (or a raw relative URL) into an absolute URL.
 * Rejects any scheme that isn't http(s) — blocks javascript:, data:, file:,
 * vbscript: smuggled in via a malicious CMS entry.
 */
export function resolveStrapiMediaUrl(
  media: StrapiMedia | string | null | undefined,
): string | null {
  if (!media) return null;
  const raw = typeof media === 'string' ? media : media.url;
  if (!raw || typeof raw !== 'string') return null;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const u = new URL(raw);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
      return u.toString();
    } catch {
      return null;
    }
  }

  // Reject anything that isn't a simple server-relative path
  if (!/^\/?[A-Za-z0-9_\-./]+$/.test(raw)) return null;
  return `${STRAPI_PUBLIC_URL}${raw.startsWith('/') ? '' : '/'}${raw}`;
}

/** ISR revalidation interval in seconds. Override per-call if needed. */
const DEFAULT_REVALIDATE = 60;

// ---------------------------------------------------------------------------
// Core fetch helper
// ---------------------------------------------------------------------------
async function strapiGet<T>(
  path: string,
  params: Record<string, string> = {},
  revalidate: number = DEFAULT_REVALIDATE,
): Promise<T | null> {
  if (!STRAPI_API_TOKEN) {
    // Warn loudly in dev; fail silently in prod — static fallbacks handle it
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[strapi] STRAPI_API_TOKEN is not set — API calls will fail');
    }
    return null;
  }

  // Harden path — only allow slugs we control. No traversal, no schemes.
  if (!/^[a-z0-9][a-z0-9\-/]*$/i.test(path) || path.includes('..')) {
    console.error('[strapi] rejected path:', path);
    return null;
  }

  const url = new URL(`${STRAPI_URL}/api/${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (typeof key !== 'string' || typeof value !== 'string') continue;
    if (key.length > 64 || value.length > 256) continue;
    url.searchParams.set(key, value);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        Accept: 'application/json',
      },
      signal: controller.signal,
      // Next.js ISR — revalidate every N seconds
      next: { revalidate },
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      console.error(`[strapi] ${res.status} ${res.statusText} — GET ${url.pathname}`);
      return null;
    }

    const ctype = res.headers.get('content-type') ?? '';
    if (!ctype.includes('application/json')) {
      console.error('[strapi] unexpected content-type:', ctype);
      return null;
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error('[strapi] fetch error:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// List helper — returns sorted array or null
// ---------------------------------------------------------------------------
async function getList<T extends { order: number }>(
  endpoint: string,
  revalidate?: number,
): Promise<T[] | null> {
  const res = await strapiGet<StrapiListResponse<T>>(
    endpoint,
    { 'pagination[pageSize]': '100', 'sort': 'order:asc' },
    revalidate,
  );
  return res?.data ?? null;
}

// ---------------------------------------------------------------------------
// Public API functions — one per content type
// ---------------------------------------------------------------------------

export async function getPublications(): Promise<StrapiPublication[] | null> {
  return getList<StrapiPublication>('publications');
}

export async function getResearchProjects(): Promise<StrapiResearchProject[] | null> {
  return getList<StrapiResearchProject>('research-projects');
}

export async function getCollaborators(): Promise<StrapiCollaborator[] | null> {
  return getList<StrapiCollaborator>('collaborators');
}

export async function getFundings(): Promise<StrapiFunding[] | null> {
  return getList<StrapiFunding>('fundings');
}

export async function getShowcaseProjects(): Promise<StrapiShowcaseProject[] | null> {
  return getList<StrapiShowcaseProject>('showcase-projects');
}

export async function getExperiences(): Promise<StrapiExperience[] | null> {
  return getList<StrapiExperience>('experiences');
}

export async function getEducations(): Promise<StrapiEducation[] | null> {
  return getList<StrapiEducation>('educations');
}

export async function getSkillGroups(): Promise<StrapiSkillGroup[] | null> {
  return getList<StrapiSkillGroup>('skill-groups');
}

export async function getAwards(): Promise<StrapiAward[] | null> {
  return getList<StrapiAward>('awards');
}

export async function getCurrentCourses(): Promise<StrapiCurrentCourse[] | null> {
  return getList<StrapiCurrentCourse>('current-courses');
}

export async function getPastCourses(): Promise<StrapiPastCourse[] | null> {
  return getList<StrapiPastCourse>('past-courses');
}

export async function getSupervisions(): Promise<StrapiSupervision[] | null> {
  return getList<StrapiSupervision>('supervisions');
}

export async function getJournalReviews(): Promise<StrapiJournalReview[] | null> {
  return getList<StrapiJournalReview>('journal-reviews');
}

export async function getConferenceCommittees(): Promise<StrapiConferenceCommittee[] | null> {
  return getList<StrapiConferenceCommittee>('conference-committees');
}

export async function getTalks(): Promise<StrapiTalk[] | null> {
  return getList<StrapiTalk>('talks');
}

export async function getMemberships(): Promise<StrapiMembership[] | null> {
  return getList<StrapiMembership>('memberships');
}

export async function getSiteConfig(): Promise<StrapiSiteConfig | null> {
  // populate=* so the profileImage media relation is returned with its URL.
  const res = await strapiGet<StrapiSingleResponse<StrapiSiteConfig>>(
    'site-config',
    { populate: '*' },
  );
  return res?.data ?? null;
}

export async function getHomeConfig(): Promise<StrapiHomeConfig | null> {
  const res = await strapiGet<StrapiSingleResponse<StrapiHomeConfig>>('home-config');
  return res?.data ?? null;
}
