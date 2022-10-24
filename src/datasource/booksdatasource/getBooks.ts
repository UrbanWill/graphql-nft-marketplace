import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { collection, all } from "typesaurus";
import { Book } from "../../generated/graphql";
import config from "../../../config";

const getBooks = async (): Promise<Book[]> => {
  const booksEntries = collection<Book>(config.booksCollection);

  try {
    const res = await all(booksEntries);
    const books = res.map((book) => ({ ...book.data, id: book.ref.id }));

    return books;
  } catch {
    throw new GraphQLError("Error fetching books", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  }
};

export default getBooks;
