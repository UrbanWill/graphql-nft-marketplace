import { QueryResolvers } from "../generated/graphql";
import { AppContext } from "../../types";

const queries: QueryResolvers = {
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
