import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import createDataSource from "./datasource/createDataSource";
import resolvers from "./resolvers";
import { createApolloLoggerPlugin } from "./logger/createApolloLoggerPlugin";
import { readFileSync } from "fs";
import { AppContext } from "../types";
import { verifyFirebaseIdToken } from "./auth/verifyFirebaseToken/verifyFirebaseIdToken";

import { createLogger } from "./logger/createLogger";
import config from "../config";

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });
const logger = createLogger();
const datasource = createDataSource(config, logger);

const server = new ApolloServer<AppContext>({
  typeDefs,
  resolvers,
  introspection: true,
});

const startApolloServer = async () => {
  // TODO: Fix plugin types for the standalone server
  // @ts-ignore
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      const authToken = token.match(/Bearer (.*)/)?.[1];
      return {
        dataSources: {
          nftMarketplaceAPI: datasource,
        },
        logger: logger,
        user: !authToken
          ? null
          : { ...(await verifyFirebaseIdToken({ idToken: authToken })) },
      };
    },
    listen: { port: process.env.PORT || 4000 },
    plugins: [createApolloLoggerPlugin(logger, config)],
  });

  console.log(`🚀  Server ready at: ${url}`);
};

startApolloServer();
