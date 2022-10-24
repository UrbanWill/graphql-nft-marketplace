import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { AddBookMutationResponse, Book } from "../../generated/graphql";
import config from "../../../config";
import { collection, add } from "typesaurus";

const addBook = async ({
  title,
  author,
}: Book): Promise<AddBookMutationResponse> => {
  const newBook = { title, author };

  try {
    const res = await add(collection<Book>(config.booksCollection), newBook);

    return {
      code: "200",
      success: true,
      message: "New book added!",
      book: {
        ...newBook,
        id: res.id,
      },
    };
  } catch {
    throw new GraphQLError("Error adding book", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  }
};

export default addBook;
