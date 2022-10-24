import { MutationResolvers } from "../generated/graphql";

const mutations: MutationResolvers = {
  addBook: async (_, { title, author }, context) => {
    return await context.dataSources.nftMarketplaceAPI.addBook({
      title,
      author,
    });
  },
};

export default mutations;
