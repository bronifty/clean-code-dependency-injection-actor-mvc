export default function GetPublicBooksStub() {
  return {
    success: true,
    result: [
      {
        bookId: 31,
        name: "Moby Dick",
        ownerId: null,
        author: "Herman Melville"
      },
      { bookId: 41, name: "The Art of War", ownerId: null, author: "Sun Tzu" },
      {
        bookId: 129021,
        name: "Wind in the willows",
        ownerId: "nathan.j.morton@gmail.com",
        author: "Kenneth Graeme"
      },
      {
        bookId: 129031,
        name: "I, Robot",
        ownerId: "nathan.j.morton@gmail.com",
        author: "Isaac Asimov"
      },
      {
        bookId: 129041,
        name: "The Hobbit",
        ownerId: "nathan.j.morton@gmail.com",
        author: "Jrr Tolkein"
      }
    ]
  };
}
