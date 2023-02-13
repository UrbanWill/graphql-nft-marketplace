import { Config, Environment, LogLevel } from "./types";

const {
  BUILD_VERSION,
  COMMIT_SHA,
  ENVIRONMENT,
  LOG_LEVEL,
  API_JWT_SECRET,
  PORT,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PROJECT_KEY_ID,
  FIREBASE_CLIENT_ID,
  FIREBASE_CLIENT_X_URL,
  FIREBASE_API_KEY,
  NODE_ENV,
} = process.env;

const config: Config = {
  name: "nft-marketplace-api",
  projectId: "nft-marketplace-515a7",
  firebasePrivateKey: FIREBASE_PRIVATE_KEY || "",
  firebaseClientEmail: FIREBASE_CLIENT_EMAIL || "",
  firebaseClientId: FIREBASE_CLIENT_ID || "",
  firebaseProjectKeyId: FIREBASE_PROJECT_KEY_ID || "",
  firebaseClientX509CertUrl: FIREBASE_CLIENT_X_URL || "",
  firebaseAuthUrl: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`,
  logLevel: (LOG_LEVEL as LogLevel) || "trace",
  port: PORT || 4000,
  environment: (ENVIRONMENT as Environment) ?? "dev",
  nodeEnv: (NODE_ENV as Environment) ?? "dev",
  version: `${BUILD_VERSION || "unknown"}-${COMMIT_SHA || "unknown"}`,
  firestoreBatchSize: 499,
  apiJwtSecret: API_JWT_SECRET || "jwtsecret",
  nftMarketCollection: "nft-market",
  nftMarketCollectionSubCollectionX: "nft-market-sub-collection-x",
  booksCollection: "books",
  noncesCollection: "nonces",
  usersCollection: "users",
};

export default config;
