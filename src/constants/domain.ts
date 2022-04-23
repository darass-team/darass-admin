import { BUILD_MODE_TABLE } from "./../types/buildMode";

const REPLY_MODULE_DOMAIN_TABLE = {
  // production: "https://reply-module.darass.co.kr",
  production: "https://reply-module.dev.darass.co.kr",
  development: "https://reply-module.dev.darass.co.kr",
  localhost: "https://localhost:3000"
} as BUILD_MODE_TABLE;

const MANAGE_DOMAIN_TABLE = {
  // production: "https://darass.co.kr",
  production: "https://dev.darass.co.kr/",
  development: "https://dev.darass.co.kr/",
  localhost: "https://localhost:3001"
} as BUILD_MODE_TABLE;

export const CLIENT_ASSET_DOMAIN = "https://darass-client-assets.netlify.app";

export const REPLY_MODULE_DOMAIN = REPLY_MODULE_DOMAIN_TABLE[process.env.BUILD_MODE as keyof BUILD_MODE_TABLE];

export const MANAGE_PAGE_DOMAIN = MANAGE_DOMAIN_TABLE[process.env.BUILD_MODE as keyof BUILD_MODE_TABLE];

// export const DEPLOY_SCRIPT_DOMAIN = "https://deploy-script.darass.co.kr";
export const DEPLOY_SCRIPT_DOMAIN = "https://deploy-script.dev.darass.co.kr";
