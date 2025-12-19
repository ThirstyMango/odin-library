const myLibrary = [];

function Book(name, author, pages, read, rating) {
  this.name = name;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.rating = rating;
  this.id = crypto.randomUUID();
}

function addBookToLibrary(name, author, pages, read) {
  const book = new Book(name, author, pages, read);
  myLibrary.push(book);
}
