export function getEnv() {
  return {
    MODE: process.env.NODE_ENV,
    VITE_STRAPI_API_URL: import.meta.env.VITE_STRAPI_API_URL ?? "http://localhost:1337",
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  const ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
