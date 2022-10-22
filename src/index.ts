import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import BooksDataSource from "./datasource/booksdatasource";
import resolvers from "./resolvers";
import { createApolloLoggerPlugin } from "./logger/createApolloLoggerPlugin";
import { readFileSync } from "fs";
import { Context } from "../types";

import { createLogger } from "./logger/createLogger";
import config from "../config";

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });
const logger = createLogger();

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

// @ts-ignore
const { url } = await startStandaloneServer(server, {
  context: async () => {
    return {
      // We are using a static data set for this example, but normally
      // this would be where you'd add your data source connections
      // or your REST API classes.
      dataSources: {
        booksAPI: new BooksDataSource(),
      },
      logger: logger,
    };
  },
  plugins: [createApolloLoggerPlugin(logger, config)],
});

console.log(`🚀  Server ready at: ${url}`);
