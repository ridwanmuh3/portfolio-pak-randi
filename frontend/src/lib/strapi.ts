/**
 * Strapi v5 API client for the portfolio frontend.
 *
 * Security notes:
 * - Uses a SERVER-SIDE read-only API token (STRAPI_API_TOKEN).
 *   This token is never exposed to the browser.
 * - Runs server-side only and disables Next fetch caching for SSR.
 * - Any fetch error falls through to the static fallback data
 *   so the site never fully breaks if Strapi is unavailable.
 */
import 'server-only';

import { cache } from 'react';

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

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const STRAPI_URL = assertHttpUrl(
  process.env.STRAPI_URL ?? '',
  IS_PRODUCTION ? '' : 'http://localhost:1337',
);
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN ?? '';

// ---------------------------------------------------------------------------
// Core fetch helper
// ---------------------------------------------------------------------------
async function strapiGet<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T | null> {
  if (!STRAPI_URL) {
    console.error('[strapi] STRAPI_URL is not configured');
    return null;
  }

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
      cache: 'no-store',
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
): Promise<T[] | null> {
  const res = await strapiGet<StrapiListResponse<T>>(
    endpoint,
    { 'pagination[pageSize]': '100', 'sort': 'order:asc' },
  );
  return res?.data ?? null;
}

// ---------------------------------------------------------------------------
// Public API functions — one per content type
// ---------------------------------------------------------------------------

export const getPublications = cache(async (): Promise<StrapiPublication[] | null> => {
  return getList<StrapiPublication>('publications');
});

export const getResearchProjects = cache(async (): Promise<StrapiResearchProject[] | null> => {
  return getList<StrapiResearchProject>('research-projects');
});

export const getCollaborators = cache(async (): Promise<StrapiCollaborator[] | null> => {
  return getList<StrapiCollaborator>('collaborators');
});

export const getFundings = cache(async (): Promise<StrapiFunding[] | null> => {
  return getList<StrapiFunding>('fundings');
});

export const getShowcaseProjects = cache(async (): Promise<StrapiShowcaseProject[] | null> => {
  return getList<StrapiShowcaseProject>('showcase-projects');
});

export const getExperiences = cache(async (): Promise<StrapiExperience[] | null> => {
  return getList<StrapiExperience>('experiences');
});

export const getEducations = cache(async (): Promise<StrapiEducation[] | null> => {
  return getList<StrapiEducation>('educations');
});

export const getSkillGroups = cache(async (): Promise<StrapiSkillGroup[] | null> => {
  return getList<StrapiSkillGroup>('skill-groups');
});

export const getAwards = cache(async (): Promise<StrapiAward[] | null> => {
  return getList<StrapiAward>('awards');
});

export const getCurrentCourses = cache(async (): Promise<StrapiCurrentCourse[] | null> => {
  return getList<StrapiCurrentCourse>('current-courses');
});

export const getPastCourses = cache(async (): Promise<StrapiPastCourse[] | null> => {
  return getList<StrapiPastCourse>('past-courses');
});

export const getSupervisions = cache(async (): Promise<StrapiSupervision[] | null> => {
  return getList<StrapiSupervision>('supervisions');
});

export const getJournalReviews = cache(async (): Promise<StrapiJournalReview[] | null> => {
  return getList<StrapiJournalReview>('journal-reviews');
});

export const getConferenceCommittees = cache(async (): Promise<StrapiConferenceCommittee[] | null> => {
  return getList<StrapiConferenceCommittee>('conference-committees');
});

export const getTalks = cache(async (): Promise<StrapiTalk[] | null> => {
  return getList<StrapiTalk>('talks');
});

export const getMemberships = cache(async (): Promise<StrapiMembership[] | null> => {
  return getList<StrapiMembership>('memberships');
});

export const getSiteConfig = cache(async (): Promise<StrapiSiteConfig | null> => {
  // populate=* so the profileImage media relation is returned with its URL.
  const res = await strapiGet<StrapiSingleResponse<StrapiSiteConfig>>(
    'site-config',
    { populate: '*' },
  );
  return res?.data ?? null;
});

export const getHomeConfig = cache(async (): Promise<StrapiHomeConfig | null> => {
  const res = await strapiGet<StrapiSingleResponse<StrapiHomeConfig>>('home-config');
  return res?.data ?? null;
});
