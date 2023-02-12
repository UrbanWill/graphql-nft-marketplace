import { Config, Logger } from "../../types";
import { AppContext } from "../../types";

import { GraphQLRequestContext } from "@apollo/server";

export const createApolloLoggerPlugin = (logger: Logger, config: Config) => {
  return {
    async serverWillStart() {
      logger.info(`🚀 Server ready at port ${config.port}`);
    },
    async requestDidStart(requestContext: GraphQLRequestContext<AppContext>) {
      const {
        request: { operationName, variables, query },
      } = requestContext;

      // Skip logging introspection queries
      if (operationName === "IntrospectionQuery") {
        return;
      }

      // Extract operation type and name from query if operationName? is not set
      const operation = query?.match(/\b(\w+)\b\s(\w+)\b/)?.[0];
      logger.trace(
        {
          operationName: operationName ?? operation,
          variables: variables ?? false,
        },
        "Request start"
      );

      return {
        willSendResponse: async ({
          errors,
          response,
        }: GraphQLRequestContext<AppContext>) => {
          if (!errors) {
            logger.trace(response, "Request end");
          }
        },
      };
    },
  };
};
