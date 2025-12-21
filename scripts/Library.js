function Library() {
  this.data = [];

  this.removeBookFromLibrary = function (bookId) {
    this.data = this.data.filter((book) => book.id !== bookId);
  };

  this.findBookById = function (bookId) {
    return this.data.find((book) => book.id === bookId);
  };

  this.setBookParameter = function (bookId, parKey, parValue) {
    const cBook = this.findBookById(bookId);
    cBook[parKey] = parValue;
  };

  this.addBookToLibrary = function (book) {
    this.data.push(book);
  };

  this.addBooksToLibrary = function (books) {
    for (const book of books) {
      this.addBookToLibrary(book);
    }
  };
}

export { Library };
