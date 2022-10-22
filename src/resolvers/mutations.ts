import { MutationResolvers } from "../generated/graphql";
// import { Context } from "../../types";

// Use the generated `MutationResolvers` type to type check our mutations!
const mutations: MutationResolvers = {
  // Below, we mock adding a new book. Our data set is static for this
  // example, so we won't actually modify our data.
  addBook: async (_, { title, author }, context) => {
    return await context.dataSources.booksAPI.addBook({ title, author });
  },
};

export default mutations;
