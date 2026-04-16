import type { Core } from '@strapi/strapi';

const config = (_params: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '30d',
      },
    },
  },
});

export default config;
