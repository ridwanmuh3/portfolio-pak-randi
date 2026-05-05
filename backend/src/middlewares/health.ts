import type { Core } from '@strapi/strapi';

export default (_config: unknown, { strapi: _strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    if (ctx.path === '/_health') {
      ctx.status = 200;
      ctx.type = 'application/json';
      ctx.body = { status: 'ok' };
      return;
    }

    await next();
  };
};

