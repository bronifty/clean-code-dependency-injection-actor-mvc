import React from 'react';
import BookListPresenter from './BookListPresenter';

const BookListComponent = () => {
  const bookListPresenter = new BookListPresenter();
  const [vm, setVm] = React.useState([]);

  React.useEffect(() => {
    bookListPresenter.load((vm) => {
      setVm(vm);
    });
  }, []);
  return (
    <div>
      <h5 className='book-list-title'>Book List (api)</h5>
      <div>
        {vm.map((book, idx) => (
          <div key={idx}>{book.name}</div>
        ))}
        <button
          type='button'
          onClick={() => bookListPresenter.setMode('public')}
        >
          Show Public
        </button>
        <button
          type='button'
          onClick={() => bookListPresenter.setMode('private')}
        >
          Show Private
        </button>
        <br />
        <button type='button' onClick={() => bookListPresenter.sort('asc')}>
          sort on Name - ASC
        </button>
        <button type='button' onClick={() => bookListPresenter.sort('desc')}>
          Sort on Name - DESC
        </button>
        <button type='button' onClick={() => bookListPresenter.reset()}>
          Reset
        </button>
        <br />
      </div>
    </div>
  );
};

export default BookListComponent;
