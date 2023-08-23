import React from "react";
import AddBooksPresenter from "./AddBooksPresenter";

const AddBooksComponent = () => {
  let addBooksPresenter = new AddBooksPresenter();
  const defaultValues = {
    name: "",
    author: ""
  };
  const [fields, setFields] = React.useState(defaultValues);
  const setField = (field, value) => {
    setFields({
      ...fields,
      [field]: value
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    addBooksPresenter.addBook(fields);
    setFields(defaultValues);
  };
  return (
    <div>
      <h5>Add Book (api)</h5>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="name">name: </label>
        <input
          id="name"
          type="text"
          value={fields.name}
          onChange={(e) => setField("name", e.target.value)}
        />{" "}
        <label htmlFor="author">author: </label>
        <input
          id="author"
          type="text"
          value={fields.author}
          onChange={(e) => setField("author", e.target.value)}
        />{" "}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddBooksComponent;

// const defaultValues = { name: '', author: '' };
// const [fields, setFields] = React.useState(defaultValues);
// const setField = (field, value) => {
//   setFields((old) => ({ ...old, [field]: value }));
// };
