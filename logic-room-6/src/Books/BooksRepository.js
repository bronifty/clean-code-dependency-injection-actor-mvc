import httpGateway from "../Shared/HttpGateway";
import Observable from "../Shared/Observable";

class BooksRepository {
  booksPm = null;
  lastAddedBookPm = null;
  totalBooksPm = null;
  mode = "books";
  baseUrl = "https://api.logicroom.co/api/nathan.j.morton@gmail.com/";

  constructor() {
    this.booksPm = new Observable([]);
    this.lastAddedBookPm = new Observable("");
    this.totalBooksPm = new Observable(0);
  }

  getBooks = async (callback) => {
    this.booksPm.subscribe(callback);
    if (this.booksPm.value.length === 0) {
      await this.loadApiData();
    } else {
      this.refreshModelData();
    }
  };

  addBook = async (programmersModel) => {
    let dto = {
      name: programmersModel.name,
      author: programmersModel.author,
      ownerId: "nathan.j.morton@gmail.com"
    };
    await httpGateway.post(this.baseUrl + "books", dto);
    await this.loadApiData();
    this.lastAddedBookPm.value = programmersModel.name;
    this.lastAddedBookPm.notify();
    this.totalBooksPm.value = this.booksPm.value.length;
    this.totalBooksPm.notify();
  };

  getLastAddedBook = async (callback) => {
    this.lastAddedBookPm.subscribe(callback);
  };

  getTotal = async (callback) => {
    this.totalBooksPm.subscribe(callback);
  };

  loadApiData = async () => {
    const dto = await httpGateway.get(this.baseUrl + this.mode);
    this.booksPm.value = dto.result.map((dtoItem) => {
      return dtoItem;
    });
    this.booksPm.notify();
    this.totalBooksPm.value = this.booksPm.value.length;
    this.totalBooksPm.notify();
  };

  refreshModelData = () => {
    this.booksPm.value = this.booksPm.value.map((pm) => {
      return pm;
    });
    this.booksPm.notify();
  };

  sort = async (order) => {
    this.booksPm.value = this.booksPm.value.sort((a, b) => {
      if (a.name < b.name) {
        return order === "desc" ? 1 : -1;
      }
      if (a.name > b.name) {
        return order === "desc" ? -1 : 1;
      }
      return 0;
    });
    this.booksPm.notify();
  };

  reset = async () => {
    await httpGateway.get(this.baseUrl + "reset");
    await this.loadApiData();
  };
}

const booksRepository = new BooksRepository();
export default booksRepository;
