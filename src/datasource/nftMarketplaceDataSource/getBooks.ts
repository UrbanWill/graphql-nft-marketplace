import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { collection, all } from "typesaurus";
import { Book } from "../../generated/graphql";
import config from "../../../config";
import { createLogger } from "../../logger/createLogger";

const logger = createLogger();

// types
import { IDecodedUserToken } from "../../../types";

const getBooks = async ({
  user,
}: {
  user: IDecodedUserToken;
}): Promise<Book[]> => {
  const booksEntries = collection<Book>(config.booksCollection);

  if (!user) {
    logger.error({ error: "User is not authenticated" });
    throw new GraphQLError(`Unauthorized`, {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  try {
    const res = await all(booksEntries);
    const books = res.map((book) => ({ ...book.data, id: book.ref.id }));

    return books;
  } catch (error) {
    logger.error({ error });
    throw new GraphQLError(`Error fetching books, ${error}`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  }
};

export default getBooks;
