import booksRepository from "./BooksRepository.js";

export default class AddBooksPresenter {
  addBook = async (book) => {
    await booksRepository.addBook({ name: book.name, author: book.author });
  };
}
