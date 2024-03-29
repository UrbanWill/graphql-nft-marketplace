import { NftMarketplaceDataSource } from "../src/datasource/createDataSource";
import type { Logger as PinoLogger } from "pino";
import { Role } from "../src/generated/graphql";

export type Environment = "test" | "dev" | "prod";

export type LogLevel = "debug" | "info" | "warn" | "error" | "trace";

export interface Config {
  name: string;
  projectId: string;
  firebasePrivateKey: string;
  firebaseClientEmail: string;
  firebaseClientId: string;
  firebaseProjectKeyId: string;
  firebaseClientX509CertUrl: string;
  firebaseAuthUrl: string;
  logLevel: LogLevel;
  port: string | number;
  environment: Environment;
  nodeEnv: Environment;
  version: string;
  firestoreBatchSize: number;
  apiJwtSecret: string;
  nftMarketCollection: string;
  nftMarketCollectionSubCollectionX: string;
  booksCollection: string;
  noncesCollection: string;
  usersCollection: string;
}

export interface Logger extends PinoLogger {
  logMemoryUsage: () => void;
}
export interface AppContext {
  dataSources: {
    nftMarketplaceAPI: NftMarketplaceDataSource;
  };
  logger: Logger;
  user: {
    id: string | null;
    role: Role;
  };
}
