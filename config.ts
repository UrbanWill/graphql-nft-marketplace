import { Config, Environment, LogLevel } from "./types";

const {
  BUILD_VERSION,
  COMMIT_SHA,
  ENVIRONMENT,
  LOG_LEVEL,
  API_JWT_SECRET,
  PORT,
} = process.env;

const config: Config = {
  name: "nft-marketplace-api",
  logLevel: (LOG_LEVEL as LogLevel) || "trace",
  port: PORT || 4000,
  environment: (ENVIRONMENT as Environment) ?? "dev",
  version: `${BUILD_VERSION || "unknown"}-${COMMIT_SHA || "unknown"}`,
  firestoreBatchSize: 499,
  apiJwtSecret: API_JWT_SECRET || "jwtsecret",
  nftMarketCollection: "nft-market",
  nftMarketCollectionSubCollectionX: "nft-market-sub-collection-x",
};

export default config;
