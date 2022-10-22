// Use our automatically generated Book and AddBookMutationResponse types
// for type safety in our data source class
import { AddBookMutationResponse, Book } from "../../generated/graphql";

export default class BooksDataSource {
  // Our example static data set
  books: { title?: string; author?: string }[] = [
    {
      title: "The Awakening",
      author: "Kate Chopin",
    },
    {
      title: "City of Glass",
      author: "Paul Auster",
    },
    {
      title: "Test title",
      author: "Test author",
    },
  ];

  getBooks(): Book[] {
    // simulate fetching a list of books
    return this.books;
  }

  // We are using a static data set for this small example, but normally
  // this Mutation would *mutate* our underlying data using a database
  // or a REST API.
  async addBook(book: Book): Promise<AddBookMutationResponse> {
    this.books.push(book);

    return {
      code: "200",
      success: true,
      message: "New book added!",
      book: this.books[this.books.length - 1],
    };
  }
}
