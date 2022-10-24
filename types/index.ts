import type { Logger as PinoLogger } from "pino";
import { Book, AddBookMutationResponse } from "../src/generated/graphql";
import type { DataSource as ApolloDataSource } from "apollo-datasource";
import { Context } from "apollo-server-core";

export type Environment = "dev" | "prod";

export type LogLevel = "debug" | "info" | "warn" | "error" | "trace";

export interface Config {
  name: string;
  projectId: string;
  logLevel: LogLevel;
  port: string | number;
  environment: Environment;
  version: string;
  firestoreBatchSize: number;
  apiJwtSecret: string;
  nftMarketCollection: string;
  nftMarketCollectionSubCollectionX: string;
  booksCollection: string;
}

export interface Logger extends PinoLogger {
  logMemoryUsage: () => void;
}

export interface FirestoreDatasource extends ApolloDataSource<Context> {
  getBooks: () => Promise<Book[]>;
  addBook: (Book) => Promise<AddBookMutationResponse>;
}

export interface AppContext {
  dataSources: {
    booksAPI: FirestoreDatasource;
  };
  logger: Logger;
}
