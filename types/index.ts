import type { Logger as PinoLogger } from "pino";
import { Book, AddBookMutationResponse } from "../src/generated/graphql";

export type Environment = "dev" | "prod";

export type LogLevel = "debug" | "info" | "warn" | "error" | "trace";

export interface Config {
  name: string;
  logLevel: LogLevel;
  port: string | number;
  environment: Environment;
  version: string;
  firestoreBatchSize: number;
  apiJwtSecret: string;
  nftMarketCollection: string;
  nftMarketCollectionSubCollectionX: string;
}

export interface Logger extends PinoLogger {
  logMemoryUsage: () => void;
}

export interface IBooksDataSource {
  getBooks: () => Book[];
  addBook: (Book) => AddBookMutationResponse;
}

export interface Context {
  dataSources: {
    booksAPI: IBooksDataSource;
  };
  logger: Logger;
}
