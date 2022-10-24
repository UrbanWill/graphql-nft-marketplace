import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import createDataSource from "./datasource/createDataSource";
import resolvers from "./resolvers";
import { createApolloLoggerPlugin } from "./logger/createApolloLoggerPlugin";
import { readFileSync } from "fs";
import { AppContext } from "../types";

import { createLogger } from "./logger/createLogger";
import config from "../config";

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });
const logger = createLogger();
const datasource = createDataSource(config, logger);

const server = new ApolloServer<AppContext>({
  typeDefs,
  resolvers,
});

// TODO: Fix the types for the standalone server
// @ts-ignore
const { url } = await startStandaloneServer(server, {
  context: async () => {
    return {
      dataSources: {
        booksAPI: datasource,
      },
      logger: logger,
    };
  },
  plugins: [createApolloLoggerPlugin(logger, config)],
});

console.log(`🚀  Server ready at: ${url}`);
