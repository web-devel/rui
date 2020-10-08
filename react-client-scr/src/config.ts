export const CUBA_APP_URL = process.env.REACT_APP_CUBA_URL ?? "/app/rest/";
export const REST_CLIENT_ID = process.env.REACT_APP_REST_CLIENT_ID ?? "client";
export const REST_CLIENT_SECRET =
  process.env.REACT_APP_REST_CLIENT_SECRET ?? "secret";

export const DEV_MODE = Boolean(process.env.REACT_APP_DEV_MODE)
export const DEFAULT_COUNT = 10; // Typical amount of entities to be loaded on browse screens
