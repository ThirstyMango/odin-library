import { Book } from "./Book.js";

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

  this.addBookToLibrary = function (name, author, pages, read) {
    const bookToAdd = new Book(name, author, pages, read);
    this.data.push(bookToAdd);
    return bookToAdd;
  };
}

export { Library };
