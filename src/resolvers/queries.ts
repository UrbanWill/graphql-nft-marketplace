import { QueryResolvers } from "../generated/graphql";

const queries: QueryResolvers = {
  books: async (_, __, context) => {
    const books = await context.dataSources.nftMarketplaceAPI.getBooks();
    return books;
  },
};

export default queries;
