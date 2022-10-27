import { MutationResolvers } from "../generated/graphql";
import { AppContext } from "../../types";

const mutations: MutationResolvers = {
  addBook: async (
    _parent: unknown,
    { title, author },
    { dataSources: { nftMarketplaceAPI } }: AppContext
  ) => {
    return await nftMarketplaceAPI.addBook({
      title,
      author,
    });
  },
  loginWithWallet: async (
    _parent: unknown,
    { message, signedMessage },
    { dataSources: { nftMarketplaceAPI } }: AppContext
  ) => {
    return await nftMarketplaceAPI.loginWithWallet({
      message,
      signedMessage,
    });
  },
};

export default mutations;
