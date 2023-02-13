import { MutationResolvers } from "../generated/graphql";
import { AppContext } from "../../types";

const mutations: MutationResolvers = {
  loginWithWallet: async (
    _parent: unknown,
    { walletAddress, message, signedMessage },
    { dataSources: { nftMarketplaceAPI } }: AppContext
  ) => {
    return await nftMarketplaceAPI.loginWithWallet({
      walletAddress,
      message,
      signedMessage,
    });
  },
};

export default mutations;
