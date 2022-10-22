import { QueryResolvers } from "../generated/graphql";
// import { Context } from "../../types";

// Use the generated `QueryResolvers` type to type check our queries!
const queries: QueryResolvers = {
  // Our third argument (`contextValue`) has a type here, so we
  // can check the properties within our resolver's shared context value.
  books: async (_, __, contextValue) => {
    const books = await contextValue.dataSources.booksAPI.getBooks();
    contextValue.logger.info(books[0].title);
    return books;
  },
};

export default queries;
