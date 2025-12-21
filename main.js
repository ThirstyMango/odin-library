import { DOM } from "./scripts/DOM.js";
import { View } from "./scripts/View.js";
import { Library } from "./scripts/Library.js";
import { Book } from "./scripts/Book.js";

const myDom = new DOM();
const myView = new View();
const myLibrary = new Library();

const testingData = [
  ["Hobit", "J.R.R. Tolkien", 219, true, 8],
  ["Lord of the rings", "J.R.R. Tolkien", 111, false, 7],
  ["Pentagram", "Jo Nesbo", 223, true, 9],
  ["Golem", "Gustav Meyrink", 331, true, 3],
];

const books = testingData.map((bookArr) => new Book(...bookArr));

myLibrary.addBooksToLibrary(books);
myView.displayLibrary(myLibrary.data, myDom.library);

// Event listeners

const handleRemoveClick = function handleRemoveClick(targetEl) {
  const bookEl = myDom.findBookElFromChild(targetEl);
  const bookId = bookEl.dataset.id;
  myLibrary.removeBookFromLibrary(bookId);
  bookEl.remove();
};

const handleReadClick = function handleReadClick(targetEl) {
  const bookEl = myDom.findBookElFromChild(targetEl);
  const bookId = bookEl.dataset.id;
  myLibrary.setBookParameter(bookId, "read", targetEl.checked);
};

const handleRatingClick = function handleRatingClick(targetEl) {
  const bookEl = myDom.findBookElFromChild(targetEl);
  const bookId = bookEl.dataset.id;

  myLibrary.setBookParameter(bookId, "rating", targetEl.value);
  console.log(myLibrary.findBookById(bookId));
};

const handleClick = function handleClick(e) {
  const targetType = e.target.dataset.element;
  switch (targetType) {
    case "read":
      handleReadClick(e.target);
      break;
    case "rating":
      handleRatingClick(e.target);
      break;
    case "remove":
      handleRemoveClick(e.target);
      break;
  }
};

// Add Event listener
myDom.library.addEventListener("click", handleClick);
