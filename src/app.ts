import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { createDataSource } from "./datasource/createDataSource";
import resolvers from "./resolvers";
import { createApolloLoggerPlugin } from "./logger/createApolloLoggerPlugin";
import { readFileSync } from "fs";
import { AppContext } from "../types";
import { verifyFirebaseIdToken } from "./auth/verifyFirebaseToken/verifyFirebaseIdToken";
import { Role } from "./generated/graphql";

import { createLogger } from "./logger/createLogger";
import config from "../config";

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });
const logger = createLogger();
const apolloLoggerPlugin = createApolloLoggerPlugin(logger, config);
const datasource = new createDataSource({ config, logger });

const server = new ApolloServer<AppContext>({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [apolloLoggerPlugin],
});

const startApolloServer = async () => {
  await startStandaloneServer(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      const authToken = token.match(/Bearer (.*)/)?.[1];
      return {
        dataSources: {
          nftMarketplaceAPI: datasource,
        },
        logger: logger,
        user: !authToken
          ? { id: null, role: Role.User }
          : { ...(await verifyFirebaseIdToken({ idToken: authToken })) },
      };
    },
    listen: { port: Number(config.port) },
  });
};

startApolloServer();
