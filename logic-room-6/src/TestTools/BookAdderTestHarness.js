import Observable from "../Shared/Observable";
import booksRepository from "../Books/BooksRepository";
import GetPrivateBooksStub from "../TestTools/GetPrivateBooksStub";
import BookListPresenter from "../Books/BookListPresenter";
import AddBooksPresenter from "../Books/AddBooksPresenter";
import httpGateway from "../Shared/HttpGateway";
import GetPublicBooksStub from "../TestTools/GetPublicBooksStub";

export default class TestHarness {
  init = async (callback) => {
    // clears stubs and spies
    jest.clearAllMocks();
    // clears state
    booksRepository.booksPm = new Observable([]);
    booksRepository.mode = "books";

    let pivotedStub = GetPrivateBooksStub();
    httpGateway.get = jest
      .fn()
      .mockImplementation((path) => Promise.resolve(pivotedStub));
    httpGateway.post = jest
      .fn()
      .mockImplementation((data) => Promise.resolve({}));
    let bookListPresenter = new BookListPresenter();
    await bookListPresenter.load(callback);
  };

  addBook = async () => {
    jest.clearAllMocks();
    let pivotedStub = GetPrivateBooksStub();
    pivotedStub.result.push(pivotedStub.result[1]);
    httpGateway.get = jest
      .fn()
      .mockImplementation((path) => Promise.resolve(pivotedStub));
    httpGateway.post = jest
      .fn()
      .mockImplementation((data) => Promise.resolve({}));

    let addBooksPresenter = new AddBooksPresenter();
    await addBooksPresenter.addBook({
      name: "I, Robot",
      author: "Isaac Asimov"
    });
  };
  filterBooks = async () => {
    jest.clearAllMocks();
    let pivotedStub = GetPublicBooksStub();
    httpGateway.get = jest
      .fn()
      .mockImplementation((path) => Promise.resolve(pivotedStub));
    httpGateway.post = jest
      .fn()
      .mockImplementation((data) => Promise.resolve({}));
    let bookListPresenter = new BookListPresenter();
    await bookListPresenter.setMode("public");
  };
  sortBooks = async () => {
    jest.clearAllMocks();

    let pivotedStub = GetPrivateBooksStub();
    httpGateway.get = jest
      .fn()
      .mockImplementation((path) => Promise.resolve(pivotedStub));
    httpGateway.post = jest
      .fn()
      .mockImplementation((data) => Promise.resolve({}));
    pivotedStub.result.sort((a, b) => (a.name > b.name ? 1 : -1));
    let bookListPresenter = new BookListPresenter();
    await bookListPresenter.sort();
  };
}
