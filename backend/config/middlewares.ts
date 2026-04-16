import type { Core } from '@strapi/strapi';

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map((o: string) => o.trim())
  .filter(Boolean);

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'base-uri': ["'self'"],
          'form-action': ["'self'"],
          'frame-ancestors': ["'none'"],
          'object-src': ["'none'"],
          'script-src': ["'self'", "'unsafe-inline'"],
          'style-src': ["'self'", "'unsafe-inline'"],
          'connect-src': ["'self'", ...ALLOWED_ORIGINS],
          'img-src': ["'self'", 'data:', 'blob:'],
          'media-src': ["'self'", 'data:', 'blob:'],
          'font-src': ["'self'", 'data:'],
          'worker-src': ["'self'", 'blob:'],
          upgradeInsecureRequests: null,
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-site' },
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      hsts: {
        maxAge: 63072000,
        includeSubDomains: true,
        preload: true,
      },
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: ALLOWED_ORIGINS,
      methods: ['GET', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      credentials: false,
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  {
    name: 'strapi::query',
    config: {
      // Limit nested depth — blocks populate-bomb / filter-depth DoS
      depth: 5,
      // Prevent prototype pollution via query parsing
      allowPrototypes: false,
      arrayLimit: 50,
      parameterLimit: 100,
    },
  },
  {
    name: 'strapi::body',
    config: {
      // Hard ceilings — upload handled separately by plugin
      jsonLimit: '1mb',
      formLimit: '1mb',
      textLimit: '1mb',
      multipart: true,
      formidable: {
        maxFileSize: 20 * 1024 * 1024, // 20 MB
      },
      includeUnparsed: false,
    },
  },
  {
    name: 'strapi::session',
    config: {
      // Cookie hardening — 'secure' flips on when behind HTTPS proxy
      key: 'strapi.sid',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      overwrite: true,
    },
  },
  'strapi::favicon',
  'strapi::public',
  // Custom sanitizer runs last so it sees parsed query
  'global::query-sanitizer',
];

export default config;
