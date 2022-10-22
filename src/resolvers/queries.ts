import { QueryResolvers } from "../generated/graphql";

// Use the generated `QueryResolvers` type to type check our queries!
const queries: QueryResolvers = {
  // Our third argument (`contextValue`) has a type here, so we
  // can check the properties within our resolver's shared context value.
  books: async (_, __, contextValue) => {
    return await contextValue.dataSources.booksAPI.getBooks();
  },
};

export default queries;
