import type { Core } from '@strapi/strapi';

const config: Core.Config.Api = {
  rest: {
    // Default page size for list endpoints
    defaultLimit: 50,
    // Hard cap — prevents excessively large payloads
    maxLimit: 100,
    // Include total count in paginated responses
    withCount: true,
  },
};

export default config;
