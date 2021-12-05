import { BUILD_MODE_TABLE } from "./../types/buildMode";

const REPLY_MODULE_DOMAIN_TABLE = {
  production: "https://darass-module.netlify.app",
  development: "https://darass-module.netlify.app",
  localhost: "https://localhost:3000"
} as BUILD_MODE_TABLE;

const MANAGE_DOMAIN_TABLE = {
  production: "https://darass.netlify.app",
  development: "https://darass.netlify.app",
  localhost: "https://localhost:3001"
} as BUILD_MODE_TABLE;

export const CLIENT_ASSET_DOMAIN = "https://d257w05ca5bz5h.cloudfront.net";

export const REPLY_MODULE_DOMAIN = REPLY_MODULE_DOMAIN_TABLE[process.env.BUILD_MODE as keyof BUILD_MODE_TABLE];

export const MANAGE_PAGE_DOMAIN = MANAGE_DOMAIN_TABLE[process.env.BUILD_MODE as keyof BUILD_MODE_TABLE];
