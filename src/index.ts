import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import logger from "pino";
import { Resolvers } from "./generated/graphql";

import { readFileSync } from "fs";

const appLogger = logger();

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const resolvers: Resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    addBook: async (_, args) => {
      const { title, author } = args;
      const book = { title, author };
      appLogger.info({ book });
      await books.push(book);
      return { book };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
