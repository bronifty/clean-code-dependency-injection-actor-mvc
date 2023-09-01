import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
// class HttpGateway {
//   get = async (path) => {
//     const response = await fetch(path);
//     const booksDto = response.json();
//     return booksDto;
//   };
//   post = async (path, requestDto) => {
//     const response = await fetch(path, {
//       method: "POST",
//       body: JSON.stringify(requestDto),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const responseDto = response.json();
//     return responseDto;
//   };
// }
class HttpGateway {
  books = [
    { name: "Book 1", author: "Author 1" },
    { name: "Book 2", author: "Author 2" },
  ];
  get = async (path) => {
    return { result: this.books };
  };
  post = async (path, requestDto) => {
    this.books.push(requestDto);
    return { success: true };
  };
  delete = async (path) => {
    this.books.length = 0;
    return { success: true };
  };
}
const httpGateway = new HttpGateway();
export class Observable {
  _value = null;
  observers = [];
  constructor(initialValue) {
    this._value = initialValue;
  }
  set value(newValue) {
    this._value = newValue;
  }
  get value() {
    return this._value;
  }
  subscribe = (func) => {
    this.observers.push(func);
  };
  notify = () => {
    this.observers.forEach((observer) => {
      observer(this._value);
    });
  };
}
class BooksRepository {
  programmersModel = null;
  apiUrl = "fakedata";
  constructor() {
    this.programmersModel = new Observable([]);
  }
  getBooks = async (callback) => {
    this.programmersModel.subscribe(callback);
    await this.loadApiData();
    this.programmersModel.notify();
  };
  addBook = async (fields) => {
    await this.postApiData(fields);
    await this.loadApiData();
    this.programmersModel.notify();
  };
  removeBooks = async () => {
    await this.deleteApiData();
    await this.loadApiData();
    this.programmersModel.notify();
  };
  // loadApiData = async () => {
  //   const booksDto = await httpGateway.get(this.apiUrl + "books");
  //   this.programmersModel.value = booksDto.result.map((bookDto) => {
  //     return bookDto;
  //   });
  // };
  // postApiData = async (fields) => {
  //   await httpGateway.post(this.apiUrl + "books", fields);
  // };
  // deleteApiData = async () => {
  //   await httpGateway.get(this.apiUrl + "reset");
  // };
  loadApiData = async () => {
    const booksDto = await httpGateway.get(this.apiUrl + "books");
    this.programmersModel.value = booksDto.result.map((bookDto) => {
      return bookDto;
    });
  };

  postApiData = async (fields) => {
    await httpGateway.post(this.apiUrl + "books", fields);
  };

  deleteApiData = async () => {
    await httpGateway.delete(this.apiUrl + "reset");
  };
}

const booksRepository = new BooksRepository();
export class BooksPresenter {
  load = async (callback) => {
    await booksRepository.getBooks((booksPm) => {
      const booksVm = booksPm.map((bookPm) => {
        return { name: bookPm.name };
      });
      callback(booksVm);
    });
  };
  post = async (fields) => {
    await booksRepository.addBook(fields);
  };
  delete = async () => {
    await booksRepository.removeBooks();
  };
}
function App() {
  const booksPresenter = new BooksPresenter();
  const [stateViewModel, copyViewModelToStateViewModel] = React.useState([]);
  const defaultValues = {
    name: "",
    author: "",
  };
  const [fields, setFields] = React.useState(defaultValues);
  React.useEffect(() => {
    async function load() {
      await booksPresenter.load((viewModel) => {
        copyViewModelToStateViewModel(viewModel);
      });
    }
    load();
  }, []);
  const setField = (field, value) => {
    setFields((old) => ({ ...old, [field]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    booksPresenter.post(fields);
    setFields(defaultValues);
  };
  const removeBooks = () => {
    booksPresenter.delete();
  };
  return (
    <div>
      <h2>Books</h2>
      {stateViewModel.map((book, i) => {
        return <div key={i}>{book.name}</div>;
      })}
      <h2>Add Book</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="name">name: </label>
        <input
          id="name"
          type="text"
          value={fields.name}
          onChange={(e) => setField("name", e.target.value)}
        />
        <label htmlFor="author">author: </label>
        <input
          id="author"
          type="text"
          value={fields.author}
          onChange={(e) => setField("author", e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <h2>Remove Books</h2>
      <button onClick={removeBooks}>Delete Books</button>
    </div>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
