import { QueryResolvers } from "../generated/graphql";
import { AppContext } from "../../types";
import { createLogger } from "../logger/createLogger";

const logger = createLogger();

const queries: QueryResolvers = {
  books: async (
    _parent: unknown,
    _,
    { dataSources: { nftMarketplaceAPI }, user }: AppContext
  ) => {
    logger.info({ user });
    const books = await nftMarketplaceAPI.getBooks();
    return books;
  },
  nonceToSign: async (
    _parent: unknown,
    { walletAddress },
    { dataSources: { nftMarketplaceAPI } }: AppContext
  ) => {
    const nonce = await nftMarketplaceAPI.getNonceToSign(walletAddress);
    return nonce;
  },
};

export default queries;
