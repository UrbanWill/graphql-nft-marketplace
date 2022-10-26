import { QueryResolvers } from "../generated/graphql";
import { AppContext } from "../../types";

const queries: QueryResolvers = {
  books: async (
    _parent: unknown,
    _,
    { dataSources: { nftMarketplaceAPI } }: AppContext
  ) => {
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
