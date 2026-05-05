module.exports = {
  apps: [
    {
      name: 'portfolio-backend',
      cwd: './backend',
      script: 'node_modules/@strapi/strapi/bin/strapi.js',
      args: 'start',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: 1337,
        PROXY: 'true',
      },
    },
    {
      name: 'portfolio-frontend',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start --hostname 127.0.0.1 --port 3000',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};

