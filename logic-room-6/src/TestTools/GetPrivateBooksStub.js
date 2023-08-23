export default function GetPrivateBooksStub() {
  return {
    success: true,
    result: [
      {
        bookId: 76261,
        name: "Wind in the willows",
        ownerId: "pete@logicroom.co",
        author: "Kenneth Graeme"
      },
      {
        bookId: 76271,
        name: "I, Robot",
        ownerId: "pete@logicroom.co",
        author: "Isaac Asimov"
      },
      {
        bookId: 76281,
        name: "The Hobbit",
        ownerId: "pete@logicroom.co",
        author: "Jrr Tolkein"
      }
    ]
  };
}
