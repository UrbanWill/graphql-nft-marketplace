import { Config, Logger } from "../../types";

import type { GraphQLRequestContext } from "apollo-server-core";

export const createApolloLoggerPlugin = (logger: Logger, config: Config) => {
  return {
    async serverWillStart() {
      logger.info(`🚀 Server ready at port ${config.port}`);
    },
    async requestDidStart(requestContext: GraphQLRequestContext) {
      const {
        request: { operationName, variables },
      } = requestContext;
      logger.trace(
        {
          operationName: operationName,
          variables: variables ?? false,
        },
        "Request start"
      );

      return {
        willSendResponse: async ({
          errors,
          response,
        }: GraphQLRequestContext) => {
          if (!errors) {
            logger.trace(response, "Request end");
          }
        },
      };
    },
  };
};
