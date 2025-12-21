function Book(name, author, pages, read, rating) {
  this.id = crypto.randomUUID();
  this.name = name;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.rating = rating;
}

export { Book };
