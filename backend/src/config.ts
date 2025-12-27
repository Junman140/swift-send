export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  env: process.env.NODE_ENV || 'development',
  workerDelayMs: process.env.WORKER_DELAY_MS ? parseInt(process.env.WORKER_DELAY_MS, 10) : 2000,
};

export const isProd = () => config.env === 'production';
