/**
 * Global query sanitizer — defensive layer against injection flaws.
 *
 * - Rejects `populate=*` from public (unauthenticated) traffic to prevent
 *   relation-tree enumeration / over-fetching.
 * - Rejects `filters[$where]` and raw `$` operator overrides.
 * - Caps `pagination[pageSize]` so a client cannot request giant pages.
 * - Strips proto-pollution keys (`__proto__`, `constructor`, `prototype`).
 * - Scans all string values for obvious SQLi/XSS/NoSQL payloads; 400 on hit.
 */
import type { Core } from '@strapi/strapi';

const MAX_PAGE_SIZE = 100;
const BANNED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

// Conservative signatures — tuned to avoid false positives on normal content.
const INJECTION_PATTERNS: RegExp[] = [
  /\bunion\b[\s\S]*\bselect\b/i,
  /\bselect\b[\s\S]*\bfrom\b[\s\S]*\binformation_schema\b/i,
  /\b(?:drop|truncate|alter)\s+(?:table|database|schema)\b/i,
  /;\s*(?:--|#|\/\*)/,
  /<\s*script\b/i,
  /\bon(?:error|load|click|mouseover)\s*=/i,
  /\bjavascript:/i,
  /\bvbscript:/i,
  /\$\{[^}]*\}/, // template-literal style SSTI
  /\{\{[^}]*\}\}/, // handlebars SSTI
];

function scan(value: unknown, depth = 0): boolean {
  if (depth > 6) return true;
  if (value == null) return false;
  if (typeof value === 'string') {
    return INJECTION_PATTERNS.some((re) => re.test(value));
  }
  if (Array.isArray(value)) {
    return value.some((v) => scan(v, depth + 1));
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (BANNED_KEYS.has(k)) return true;
      if (typeof k === 'string' && k.startsWith('$')) return true; // block $where/$function
      if (scan(v, depth + 1)) return true;
    }
  }
  return false;
}

export default (_config: unknown, { strapi: _strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    // Only police REST under /api; admin uses its own auth layer.
    if (!ctx.path.startsWith('/api')) {
      return next();
    }

    const query = ctx.request.query ?? {};

    // 1. populate=* — allow only for authenticated internal clients
    const populate = query.populate;
    if (populate === '*' && !ctx.state?.auth?.credentials) {
      ctx.throw(400, 'populate=* is not permitted on public API');
    }

    // 2. Cap page size
    const pageSize = Number(query?.pagination?.pageSize ?? query?.['pagination[pageSize]']);
    if (Number.isFinite(pageSize) && pageSize > MAX_PAGE_SIZE) {
      ctx.throw(400, `pagination[pageSize] exceeds ${MAX_PAGE_SIZE}`);
    }

    // 3. Scan payload + query for injection/SSTI/proto-pollution
    if (scan(query) || scan(ctx.request.body)) {
      ctx.throw(400, 'Rejected: suspicious request payload');
    }

    await next();
  };
};
