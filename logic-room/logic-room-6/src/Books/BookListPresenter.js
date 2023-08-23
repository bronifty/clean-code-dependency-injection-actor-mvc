import booksRepository from "./BooksRepository.js";

export default class BookListPresenter {
  load = async (callback) => {
    await booksRepository.getBooks((booksPm) => {
      const booksVm = booksPm.map((bookPm) => {
        return { name: bookPm.name, author: bookPm.author };
      });
      callback(booksVm);
    });
  };
  setMode = async (mode) => {
    booksRepository.mode = mode === "public" ? "allbooks" : "books";
    await booksRepository.loadApiData();
  };
  sort = async (order) => {
    await booksRepository.sort(order);
  };
  reset = async () => {
    await booksRepository.reset();
  };
}
